import type { User, Project, Task } from "./types";

const KEYS = {
  users: "taskschool:users",
  projects: "taskschool:projects",
  tasks: "taskschool:tasks",
  session: "taskschool:session",
};

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEYS.users) ?? "[]");
}

export function saveUsers(users: User[]) {
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getProjects(): Project[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEYS.projects) ?? "[]");
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(KEYS.projects, JSON.stringify(projects));
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function getProjectsByUser(userId: string): Project[] {
  return getProjects().filter((p) => p.members.includes(userId));
}

export function getTasks(): Task[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEYS.tasks) ?? "[]");
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(KEYS.tasks, JSON.stringify(tasks));
}

export function getTasksByProject(projectId: string): Task[] {
  return getTasks().filter((t) => t.projectId === projectId);
}

export function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.session);
}

export function setSession(userId: string) {
  localStorage.setItem(KEYS.session, userId);
}

export function clearSession() {
  localStorage.removeItem(KEYS.session);
}
