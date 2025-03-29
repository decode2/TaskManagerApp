export interface Task{
    id: number;
    title: string;
    isCompleted: boolean;
    date: string;

    recurrenceType?: "none" | "daily" | "weekly" | "monthly" | "custom";
    recurrenceInterval?: number;
    recurrenceCount?: number;
    recurrenceIndex?: number;
}