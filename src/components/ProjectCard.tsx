import Link from "next/link";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  tasksCount: number;
  doneCount: number;
}

export function ProjectCard({ project, tasksCount, doneCount }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow block"
    >
      <h2 className="font-semibold text-gray-800 mb-1">{project.name}</h2>
      {project.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
        <span>Prazo: {new Date(project.deadline + "T12:00:00").toLocaleDateString("pt-BR")}</span>
        <span>
          {doneCount}/{tasksCount} tarefas
        </span>
      </div>
      <div className="mt-2 bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-1.5 rounded-full"
          style={{ width: tasksCount > 0 ? `${(doneCount / tasksCount) * 100}%` : "0%" }}
        />
      </div>
    </Link>
  );
}
