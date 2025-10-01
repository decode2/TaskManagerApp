import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api';
import { Task } from '../types/Task';

interface UseTasksProps {
  userId?: string;
}

export const useTasks = ({ userId }: UseTasksProps = {}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      const errorMessage = "Failed to load tasks";
      setError(errorMessage);
      toast.error(errorMessage, { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const refreshTasks = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks by different criteria
  const getTasksByDate = useCallback((date: Date) => {
    return tasks.filter(
      (task) => new Date(task.date).toDateString() === date.toDateString()
    );
  }, [tasks]);

  const getTasksByPriority = useCallback((priority: number) => {
    return tasks.filter((task) => task.priority === priority);
  }, [tasks]);

  const getTasksByCategory = useCallback((category: number) => {
    return tasks.filter((task) => task.category === category);
  }, [tasks]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter((task) => task.isCompleted);
  }, [tasks]);

  const getPendingTasks = useCallback(() => {
    return tasks.filter((task) => !task.isCompleted);
  }, [tasks]);

  const getTodayTasks = useCallback(() => {
    const today = new Date();
    return getTasksByDate(today);
  }, [getTasksByDate]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    refreshTasks,
    getTasksByDate,
    getTasksByPriority,
    getTasksByCategory,
    getCompletedTasks,
    getPendingTasks,
    getTodayTasks,
  };
};
