"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hello, {session.user?.name} 👋
          </h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <QuickActionCard
            title="Create New Task"
            description="Add a new task to your list."
            buttonLabel="Create Task"
            href="/dashboard/tasks/new"
          />

          <QuickActionCard
            title="View All Tasks"
            description="See all your tasks in one place."
            buttonLabel="View Tasks"
            href="/dashboard/tasks"
          />
        </div>

        {/* User Session Details */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Session Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Provider:</strong> GitHub / Google / Credentials</p>
            <p><strong>Last Login:</strong> Just now</p>
          </div>
        </div>

      </main>
    </div>
  );
}


function QuickActionCard({ title, description, buttonLabel, href }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>

      <a
        href={href}
        className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {buttonLabel}
      </a>
    </div>
  );
}
