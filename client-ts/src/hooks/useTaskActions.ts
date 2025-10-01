import { useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api';
import { Task } from '../types/Task';

interface UseTaskActionsProps {
  onTasksUpdated: () => void;
}

export const useTaskActions = ({ onTasksUpdated }: UseTaskActionsProps) => {
  const toggleCompletion = useCallback(async (task: Task) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/tasks/${task.id}`,
        {
          ...task,
          isCompleted: !task.isCompleted,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const action = task.isCompleted ? 'marked as incomplete' : 'completed';
      toast.success(`Task ${action} successfully`, { autoClose: 1500 });
      onTasksUpdated();
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
      toast.error("Failed to update task", { autoClose: 1500 });
    }
  }, [onTasksUpdated]);

  const deleteTask = useCallback(async (taskId: number) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Task deleted successfully", { autoClose: 1500 });
      onTasksUpdated();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task", { autoClose: 1500 });
    }
  }, [onTasksUpdated]);

  const updateTask = useCallback(async (task: Task) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/tasks/${task.id}`,
        task,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      toast.success("Task updated successfully", { autoClose: 1500 });
      onTasksUpdated();
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task", { autoClose: 1500 });
    }
  }, [onTasksUpdated]);

  return {
    toggleCompletion,
    deleteTask,
    updateTask,
  };
};
