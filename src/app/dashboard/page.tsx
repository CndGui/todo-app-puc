"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/contexts/AuthContext";
import * as storage from "@/lib/storage";
import type { Project, User } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberError, setMemberError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    setProjects(storage.getProjectsByUser(user.id));
    setAllUsers(storage.getUsers());
  }, [user, router]);

  function addMember() {
    const u = allUsers.find((u) => u.email === memberEmail);
    if (!u) {
      setMemberError("Usuário não encontrado.");
      return;
    }
    if (u.id === user?.id || members.includes(u.id)) {
      setMemberError("Usuário já adicionado.");
      return;
    }
    setMembers([...members, u.id]);
    setMemberEmail("");
    setMemberError("");
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    let finalMembers = [...members];
    if (memberEmail.trim()) {
      const u = allUsers.find((u) => u.email === memberEmail.trim());
      if (u && u.id !== user?.id && !finalMembers.includes(u.id)) {
        finalMembers = [...finalMembers, u.id];
      }
    }
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      description,
      deadline,
      members: [...finalMembers, user!.id],
      createdBy: user!.id,
      createdAt: new Date().toISOString(),
    };
    storage.saveProjects([...storage.getProjects(), project]);
    setProjects(storage.getProjectsByUser(user!.id));
    setShowForm(false);
    setName("");
    setDescription("");
    setDeadline("");
    setMembers([]);
    setMemberEmail("");
  }

  function getMemberName(id: string) {
    return allUsers.find((u) => u.id === id)?.name ?? "Desconhecido";
  }

  if (!user) return null;

  const isTeacher = user.role === "teacher";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meus Trabalhos</h1>
        {isTeacher && (
          <Button onClick={() => setShowForm(!showForm)}>+ Novo Trabalho</Button>
        )}
      </div>

      {isTeacher && showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Criar Trabalho</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Input
              label="Nome do trabalho"
              placeholder="Ex: Trabalho de Matemática"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Textarea
              label="Descrição"
              placeholder="Descreva o trabalho..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
            <Input
              label="Prazo de entrega"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
            <div>
              <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Adicionar aluno
              </label>
              <div className="flex gap-2">
                <Input
                  id="memberEmail"
                  placeholder="Email do aluno"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="secondary" onClick={addMember}>
                  Adicionar
                </Button>
              </div>
              {memberError && <p className="text-red-500 text-xs mt-1">{memberError}</p>}
              {members.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Alunos: {members.map(getMemberName).join(", ")}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit">Criar</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-white rounded-lg border border-gray-200">
          <p className="text-lg mb-1">Nenhum trabalho ainda.</p>
          <p className="text-sm">
            {isTeacher
              ? "Crie seu primeiro trabalho clicando no botão acima."
              : "Aguarde seu professor te adicionar a um trabalho."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => {
            const tasks = storage.getTasksByProject(p.id);
            const doneCount = tasks.filter((t) => t.status === "done").length;
            return (
              <ProjectCard
                key={p.id}
                project={p}
                tasksCount={tasks.length}
                doneCount={doneCount}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
