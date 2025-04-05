export enum RecurrenceType {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Custom = 4,
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
}