"use client";

import { createContext, useContext, useState, useEffect } from "react";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchQuery, statusFilter, sortOrder]);

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
      toast.error("Failed to fetch tasks.");
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

  const filterAndSortTasks = () => {
    let filtered = [...tasks];

    if (searchQuery) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredTasks(filtered);
  };

  const updateTask = async (id, updatedTask) => {
    await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updatedTask.title,
        completed: updatedTask.status === "Completed",
        userId: 1,
      }),
    });
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
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


  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  return (
    <TodoContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        markComplete,
        deleteTask,
        updateTask,
        setSearchQuery,
        setStatusFilter,
        setSortOrder,
        filteredTasks,
        sortOrder,
        statusFilter,
        searchQuery,
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        setFilteredTasks
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  return useContext(TodoContext);
}
