import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Task } from '../types/Task';
import { Project } from '../types/Project';
import PriorityBadge from './ui/PriorityBadge';
import CategoryBadge from './ui/CategoryBadge';

interface TaskCardWithProjectProps {
  task: Task;
  project?: Project | null;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  animated?: boolean;
}

const TaskCardWithProject: React.FC<TaskCardWithProjectProps> = ({
  task,
  project,
  onToggleComplete,
  onEdit,
  onDelete,
  animated = true
}) => {
  const isCompleted = task.isCompleted;
  
  // Clean minimalist design
  const cardClasses = `
    group relative rounded-xl border transition-colors duration-200 hover:shadow-lg
    ${isCompleted 
      ? 'bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700' 
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
    hover:border-gray-300 dark:hover:border-gray-600
    ${isCompleted ? 'opacity-70' : 'opacity-100'}
  `;

  const titleClasses = `
    font-semibold line-clamp-2 transition-colors duration-200
    ${isCompleted 
      ? 'text-gray-500 dark:text-gray-400 line-through' 
      : 'text-gray-900 dark:text-white'
    }
  `;

  const descriptionClasses = `
    text-sm line-clamp-2 mb-3
    ${isCompleted 
      ? 'text-gray-400 dark:text-gray-500' 
      : 'text-gray-600 dark:text-gray-300'
    }
  `;

  const dateClasses = `
    text-xs flex items-center gap-1.5
    ${isCompleted 
      ? 'text-gray-400 dark:text-gray-500' 
      : 'text-gray-500 dark:text-gray-400'
    }
  `;

  const actionButtonClasses = `
    flex items-center justify-center rounded-lg transition-all duration-200
    min-h-[44px] min-w-[44px] touch-manipulation shadow-sm hover:shadow-md
    hover:scale-105 active:scale-95
  `;

  const completionButtonClasses = `
    ${actionButtonClasses}
    ${isCompleted 
      ? 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-700'
      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600'
    }
  `;

  const editButtonClasses = `
    ${actionButtonClasses}
    bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 
    text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
    border-2 border-blue-200 dark:border-blue-700
  `;

  const deleteButtonClasses = `
    ${actionButtonClasses}
    bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 
    text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
    border-2 border-red-200 dark:border-red-700
  `;

  const cardContent = (
    <div className={cardClasses}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Priority, Category, and Project Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <PriorityBadge 
                priority={task.priority} 
                size="sm" 
                variant="default"
                animated={false}
              />
              <CategoryBadge 
                category={task.category} 
                size="sm" 
                variant="default"
                animated={false}
              />
              {/* Project Badge */}
              {project && (
                <div 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border"
                  style={{ 
                    backgroundColor: `${project.color}15`,
                    borderColor: `${project.color}40`,
                    color: project.color
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="truncate max-w-20">{project.name}</span>
                </div>
              )}
            </div>

            {/* Task Title */}
            <h3 className={`text-base sm:text-lg ${titleClasses} mb-2`}>
              {task.title}
            </h3>

            {/* Task Description */}
            {task.description && (
              <p className={descriptionClasses}>
                {task.description}
              </p>
            )}

            {/* Date */}
            <div className={dateClasses}>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{format(new Date(task.date), 'MMM d, yyyy')}</span>
              <span className="mx-1">•</span>
              <span>{format(new Date(task.date), 'h:mm a')}</span>
            </div>

            {/* Tags */}
            {task.tags && task.tags.trim() && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {task.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Completion Button */}
            <button
              onClick={() => onToggleComplete(task)}
              className={completionButtonClasses}
              aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
              title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isCompleted ? (
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              )}
            </button>

            {/* Edit Button */}
            <button
              onClick={() => onEdit(task)}
              className={editButtonClasses}
              aria-label="Edit task"
              title="Edit task"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(task)}
              className={deleteButtonClasses}
              aria-label="Delete task"
              title="Delete task"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -2 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default TaskCardWithProject;
