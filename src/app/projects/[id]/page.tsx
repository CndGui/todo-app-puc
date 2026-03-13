"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import * as storage from "@/lib/storage";
import type { Project, Task, TaskStatus, User } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { KanbanColumn } from "@/components/KanbanColumn";

const COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: "todo", label: "A Fazer", color: "bg-gray-100" },
  { key: "in_progress", label: "Em Andamento", color: "bg-blue-50" },
  { key: "done", label: "Concluído", color: "bg-green-50" },
];

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];

export default function ProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const p = storage.getProjectById(projectId);
    if (!p) {
      router.push("/dashboard");
      return;
    }

    setProject(p);
    setTasks(storage.getTasksByProject(projectId));
    setAllUsers(storage.getUsers());
  }, [user, projectId, router]);

  function refreshTasks() {
    setTasks(storage.getTasksByProject(projectId));
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      projectId,
      assignedTo: assignedTo || null,
      status: "todo",
      deadline: deadline || null,
      createdBy: user!.id,
      createdAt: new Date().toISOString(),
    };
    storage.saveTasks([...storage.getTasks(), task]);
    refreshTasks();
    setShowForm(false);
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDeadline("");
  }

  function moveTask(taskId: string, direction: "left" | "right") {
    const updated = storage.getTasks().map((t) => {
      if (t.id !== taskId) return t;
      const idx = STATUS_ORDER.indexOf(t.status);
      const newIdx = direction === "right" ? idx + 1 : idx - 1;
      if (newIdx < 0 || newIdx >= STATUS_ORDER.length) return t;
      return { ...t, status: STATUS_ORDER[newIdx] };
    });
    storage.saveTasks(updated);
    refreshTasks();
  }

  function deleteTask(taskId: string) {
    storage.saveTasks(storage.getTasks().filter((t) => t.id !== taskId));
    refreshTasks();
  }

  function getUserName(id: string | null) {
    if (!id) return "Não atribuído";
    return allUsers.find((u) => u.id === id)?.name ?? "Desconhecido";
  }

  if (!project || !user) return null;

  const members = project.members
    .map((id) => allUsers.find((u) => u.id === id))
    .filter(Boolean) as User[];

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-2 block text-blue-600 text-sm hover:underline cursor-pointer"
        >
          ← Voltar aos trabalhos
        </button>
        <h1 className="font-bold text-2xl text-gray-800">{project.name}</h1>
        {project.description && <p className="mt-1 text-gray-500 text-sm">{project.description}</p>}
        <p className="mt-1 text-gray-400 text-sm">
          Prazo: {new Date(project.deadline + "T12:00:00").toLocaleDateString("pt-BR")} &middot;{" "}
          Membros: {members.map((m) => m.name).join(", ")}
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-700 text-lg">Quadro Kanban</h2>
        <Button type="button" onClick={() => setShowForm(!showForm)}>
          + Nova Tarefa
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-semibold">Nova Tarefa</h3>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <Input
              placeholder="Título da tarefa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-900"
            >
              <option value="">Sem atribuição</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <Input
              label="Prazo (opcional)"
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit">Criar</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.key}
            column={col}
            tasks={tasks.filter((t) => t.status === col.key)}
            getUserName={getUserName}
            onMoveTask={moveTask}
            onDeleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}
