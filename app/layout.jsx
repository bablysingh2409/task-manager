import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "sonner";
import { TodoProvider } from "@/context/TodoCotext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task Manager",
  description: "A task management application with OAuth authentication",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <TodoProvider>
            <Toaster />
            {children}
          </TodoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
