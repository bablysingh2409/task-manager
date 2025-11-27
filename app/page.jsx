import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Task Manager
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your tasks efficiently
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}