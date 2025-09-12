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
  
  // Nuevas propiedades
  priority: TaskPriority;
  category: TaskCategory;
  description?: string;
  tags?: string; // JSON string para múltiples etiquetas
  isArchived: boolean;
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

// Colores para prioridades
export const TaskPriorityColorMap: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
  [TaskPriority.Medium]: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
  [TaskPriority.High]: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
  [TaskPriority.Urgent]: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
};

// Colores para categorías
export const TaskCategoryColorMap: Record<TaskCategory, string> = {
  [TaskCategory.Personal]: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
  [TaskCategory.Work]: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
  [TaskCategory.Health]: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
  [TaskCategory.Education]: "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30",
  [TaskCategory.Finance]: "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30",
  [TaskCategory.Shopping]: "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30",
  [TaskCategory.Travel]: "text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30",
  [TaskCategory.Other]: "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30",
};
