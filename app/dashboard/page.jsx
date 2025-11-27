"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ListTodo, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTodo } from "@/context/TodoContext";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
const {
  totalTasks,
  completedTasks,
  inProgressTasks,
  pendingTasks
} = useTodo();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome {session.user?.name?.split(" ")[0]}!
          </h2>
          <p className="text-gray-600">
            Here&apos;s an overview of your task management
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ListTodo className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{totalTasks}</h3>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{completedTasks}</h3>
            <p className="text-sm text-gray-600">Completed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{inProgressTasks}</h3>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{pendingTasks}</h3>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/tasks/new"
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <div className="text-4xl mb-2">➕</div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Create New Task
              </h4>
              <p className="text-sm text-gray-600">
                Add a new task to your list
              </p>
            </Link>

            <Link
              href="/dashboard/tasks"
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <div className="text-4xl mb-2">📋</div>
              <h4 className="font-semibold text-gray-800 mb-1">View All Tasks</h4>
              <p className="text-sm text-gray-600">
                See and manage all your tasks
              </p>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}
