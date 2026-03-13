export type UserRole = "student" | "teacher";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  deadline: string;
  members: string[];
  createdBy: string;
  createdAt: string;
};

export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo: string | null;
  status: TaskStatus;
  deadline: string | null;
  createdBy: string;
  createdAt: string;
};
