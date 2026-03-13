import type { Task, TaskStatus } from "@/lib/types";
import { Button } from "./ui/Button";

interface TaskCardProps {
  task: Task;
  status: TaskStatus;
  getUserName: (id: string | null) => string;
  onMove: (direction: "left" | "right") => void;
  onDelete: () => void;
}

export function TaskCard({ task, status, getUserName, onMove, onDelete }: TaskCardProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
      <p className="font-medium text-gray-800 text-sm">{task.title}</p>
      {task.description && (
        <p className="mt-1 text-gray-500 text-xs">{task.description}</p>
      )}
      <p className="mt-2 text-gray-400 text-xs">{getUserName(task.assignedTo)}</p>
      {task.deadline && (
        <p className="text-gray-400 text-xs">
          Prazo: {new Date(task.deadline + "T12:00:00").toLocaleDateString("pt-BR")}
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-1">
        {status !== "todo" && (
          <Button type="button" variant="secondary" size="sm" onClick={() => onMove("left")}>
            ← Voltar
          </Button>
        )}
        {status !== "done" && (
          <Button type="button" variant="soft" size="sm" onClick={() => onMove("right")}>
            Avançar →
          </Button>
        )}
        <Button
          type="button"
          variant="danger"
          size="sm"
          className="ml-auto"
          onClick={onDelete}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
}
