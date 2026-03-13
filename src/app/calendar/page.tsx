"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import * as storage from "@/lib/storage";
import type { Project, Task } from "@/lib/types";

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function CalendarPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    const userProjects = storage.getProjectsByUser(user.id);
    setProjects(userProjects);
    const projectIds = userProjects.map((p) => p.id);
    setTasks(storage.getTasks().filter((t) => projectIds.includes(t.projectId) && t.deadline));
  }, [user, router]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const today = new Date();

  function toDateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function getItemsForDay(day: number) {
    const dayStr = toDateStr(day);
    return {
      projects: projects.filter((p) => p.deadline === dayStr),
      tasks: tasks.filter((t) => t.deadline === dayStr),
    };
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl text-gray-800">Calendário</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100"
          >
            ←
          </button>
          <span className="min-w-40 text-center font-semibold text-gray-700 capitalize">
            {monthName}
          </span>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-7 border-gray-200 border-b bg-gray-50">
          {WEEK_DAYS.map((d) => (
            <div key={d} className="py-2 text-center font-semibold text-gray-500 text-xs">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i: number) => (
            <div
              key={`empty-${i}`}
              className="min-h-24 border-gray-100 border-r border-b bg-gray-50"
            />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i: number) => {
            const day = i + 1;
            const isToday =
              day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const { projects: dayProjects, tasks: dayTasks } = getItemsForDay(day);
            const hasItems = dayProjects.length > 0 || dayTasks.length > 0;

            return (
              <div
                key={day}
                className={`min-h-24 border-gray-100 border-r border-b p-1 ${isToday ? "bg-blue-50" : hasItems ? "bg-yellow-50" : ""}`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-semibold text-xs ${
                    isToday ? "bg-blue-600 text-white" : "text-gray-600"
                  }`}
                >
                  {day}
                </span>
                <div className="mt-1 flex flex-col gap-0.5">
                  {dayProjects.map((p) => (
                    <span
                      key={p.id}
                      className="truncate rounded bg-purple-100 px-1 py-0.5 text-purple-700 text-xs"
                      title={p.name}
                    >
                      {p.name}
                    </span>
                  ))}
                  {dayTasks.map((t) => (
                    <span
                      key={t.id}
                      className={`truncate rounded px-1 py-0.5 text-xs ${
                        t.status === "done"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                      title={t.title}
                    >
                      {t.title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-gray-500 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-purple-200 bg-purple-100" />
          Prazo de projeto
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-blue-200 bg-blue-100" />
          Tarefa pendente
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-green-200 bg-green-100" />
          Tarefa concluída
        </div>
      </div>
    </div>
  );
}
