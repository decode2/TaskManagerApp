export type RecurrenceType = "None" | "Daily" | "Weekly" | "Monthly" | "Custom";

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
}