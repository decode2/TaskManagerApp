// --- src/types/Task.ts ---

export enum RecurrenceType {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Custom = 4,
}

export enum TaskPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4,
}

export enum TaskCategory {
  Personal = 1,
  Work = 2,
  Health = 3,
  Education = 4,
  Finance = 5,
  Shopping = 6,
  Travel = 7,
  Other = 8,
}

export interface Task {
  id: number;
  userId: string;
  title: string;
  date: string;
  isCompleted: boolean;
  recurrenceType: RecurrenceType;
  recurrenceInterval?: number;
  recurrenceCount?: number;
  recurrenceIndex?: number;
  
  // Basic properties
  priority: TaskPriority;
  category: TaskCategory;
  description?: string;
  tags?: string; // JSON string para múltiples etiquetas
  isArchived: boolean;

  // Advanced properties
  projectId?: number;
  parentTaskId?: number;
  estimatedMinutes?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

export const RecurrenceTypeLabelMap: Record<RecurrenceType, string> = {
  [RecurrenceType.None]: "None",
  [RecurrenceType.Daily]: "Daily",
  [RecurrenceType.Weekly]: "Weekly",
  [RecurrenceType.Monthly]: "Monthly",
  [RecurrenceType.Custom]: "Custom",
};

export const TaskPriorityLabelMap: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "Low",
  [TaskPriority.Medium]: "Medium",
  [TaskPriority.High]: "High",
  [TaskPriority.Urgent]: "Urgent",
};

export const TaskCategoryLabelMap: Record<TaskCategory, string> = {
  [TaskCategory.Personal]: "Personal",
  [TaskCategory.Work]: "Work",
  [TaskCategory.Health]: "Health",
  [TaskCategory.Education]: "Education",
  [TaskCategory.Finance]: "Finance",
  [TaskCategory.Shopping]: "Shopping",
  [TaskCategory.Travel]: "Travel",
  [TaskCategory.Other]: "Other",
};

// Note: Color mapping is now handled directly in the badge components
// for better customization and variant support
