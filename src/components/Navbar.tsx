"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="font-bold text-lg">
          TaskSchool
        </Link>
        <Link href="/dashboard" className="text-blue-100 hover:text-white text-sm">
          Trabalhos
        </Link>
        <Link href="/calendar" className="text-blue-100 hover:text-white text-sm">
          Calendário
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-blue-100">{user.name}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded cursor-pointer"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
