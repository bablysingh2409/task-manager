"use client";

import { createContext, useContext, useState, useEffect } from "react";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?page=1&limit=10"
      );
      const todos = await response.json();

      const enhanced = todos.slice(0, 20).map((todo) => ({
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        description: `This is a detailed description for task: ${todo.title}`,
        status: todo.completed
          ? "Completed"
          : Math.random() > 0.5
          ? "In Progress"
          : "Pending",
        dueDate: generateRandomDate(),
        completed: todo.completed,
      }));

      setTasks(enhanced);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomDate = () => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return date.toISOString().split("T")[0];
  };

  const addTask = async (newTask) => {
    await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTask.title,
        completed: false,
        userId: 1,
      }),
    });
    setTasks([newTask, ...tasks]);
  };

  const markComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: "Completed", completed: true }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <TodoContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        markComplete,
        deleteTask,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  return useContext(TodoContext);
}
