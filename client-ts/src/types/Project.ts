export interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt?: string;
  isArchived: boolean;
  taskCount?: number;
  completedTaskCount?: number;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  color: string;
}

export interface UpdateProjectDto {
  name: string;
  description?: string;
  color: string;
  isArchived: boolean;
}

export const PROJECT_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#14B8A6', // Teal
  '#F43F5E', // Rose
] as const;

export type ProjectColor = typeof PROJECT_COLORS[number];
