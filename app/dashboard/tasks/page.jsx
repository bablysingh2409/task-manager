"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Plus, Filter, Calendar } from "lucide-react";
import { useTodo } from "@/context/TodoContext";
import { useEffect } from "react";

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    filteredTasks,
    tasks,
    statusFilter,
    loading,
    markComplete,
    deleteTask,
    setSearchQuery,
    setStatusFilter,
    setSortOrder,
    searchQuery,
    sortOrder,
    setFilteredTasks
  } = useTodo();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    console.log("Drag result:", result);

    //  current filtered list
    const newOrder = Array.from(filteredTasks);
    const [movedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, movedItem);

    const reorderedIds = newOrder.map((t) => t.id);

    const newGlobalTasks = [...tasks].sort(
      (a, b) => reorderedIds.indexOf(a.id) - reorderedIds.indexOf(b.id)
    );

    setFilteredTasks(newGlobalTasks);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-2">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <Link
            href="/dashboard/tasks/new"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add New Task
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none"
              >
                <option value="asc">Due Date (Earliest)</option>
                <option value="desc">Due Date (Latest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Drag & Drop list */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="taskList">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {filteredTasks.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No tasks found</p>
                  </div>
                ) : (
                  filteredTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(draggableProvided, snapshot) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                          className={`bg-white rounded-lg shadow p-6 transition-shadow ${
                            snapshot.isDragging ? "ring-2 ring-indigo-300" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start sm:flex-row flex-col gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {task.title}
                                </h3>

                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    task.status
                                  )}`}
                                >
                                  {task.status}
                                </span>
                              </div>

                              <p className="text-gray-600 mb-3">
                                {task.description}
                              </p>

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar size={16} />
                                  Due:{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {task.status !== "Completed" && (
                                <>
                                  <Link
                                    href={`/dashboard/tasks/edit/${task.id}`}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    Edit
                                  </Link>

                                  <button
                                    onClick={() => markComplete(task.id)}
                                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    Complete
                                  </button>
                                </>
                              )}

                              {task.status === "Completed" && (
                                <span className="px-4 py-2 text-sm bg-gray-100 text-gray-500 rounded-lg">
                                  Completed
                                </span>
                              )}

                              <button
                                onClick={() => deleteTask(task.id)}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>
    </div>
  );
}
