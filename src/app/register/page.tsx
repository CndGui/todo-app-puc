"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/lib/types";
import { AuthCard } from "@/components/ui/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = register(name, email, password, role);
    if (ok) {
      router.push("/dashboard");
    } else {
      setError("Este email já está cadastrado.");
    }
  }

  return (
    <AuthCard title="Criar conta" subtitle="TaskSchool — Gestão de tarefas escolares">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nome"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>
          <label htmlFor="buttons" className="block text-sm font-medium text-gray-700 mb-2">Você é:</label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={role === "student" ? "primary" : "ghost"}
              onClick={() => setRole("student")}
              className="flex-1"
            >
              Estudante
            </Button>
            <Button
              type="button"
              variant={role === "teacher" ? "primary" : "ghost"}
              onClick={() => setRole("teacher")}
              className="flex-1"
            >
              Professor
            </Button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          Cadastrar
        </Button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Já tem conta?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
