import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  column: { key: TaskStatus; label: string; color: string };
  tasks: Task[];
  getUserName: (id: string | null) => string;
  onMoveTask: (taskId: string, direction: "left" | "right") => void;
  onDeleteTask: (taskId: string) => void;
}

export function KanbanColumn({
  column,
  tasks,
  getUserName,
  onMoveTask,
  onDeleteTask,
}: KanbanColumnProps) {
  return (
    <div className={`${column.color} rounded-lg p-4`}>
      <h3 className="mb-3 flex items-center justify-between font-semibold text-gray-700">
        {column.label}
        <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-gray-600 text-xs">
          {tasks.length}
        </span>
      </h3>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            status={column.key}
            getUserName={getUserName}
            onMove={(dir) => onMoveTask(task.id, dir)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
        {tasks.length === 0 && (
          <p className="py-4 text-center text-gray-400 text-xs">Nenhuma tarefa</p>
        )}
      </div>
    </div>
  );
}
