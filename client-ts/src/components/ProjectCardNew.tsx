import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types/Project';

interface ProjectCardProps {
  project: Project;
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onArchive?: (project: Project) => void;
  animated?: boolean;
}

const ProjectCardNew: React.FC<ProjectCardProps> = ({
  project,
  isSelected = false,
  onClick,
  onEdit,
  onDelete,
  onArchive,
  animated = true
}) => {
  const completionPercentage = project.taskCount && project.taskCount > 0 
    ? Math.round((project.completedTaskCount || 0) / project.taskCount * 100)
    : 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll('.project-dropdown');
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target as Node)) {
          dropdown.classList.remove('opacity-100', 'visible');
          dropdown.classList.add('opacity-0', 'invisible');
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cardContent = (
    <div 
      className={`
        relative p-5 rounded-xl cursor-pointer transition-all duration-300 group
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-400 shadow-lg shadow-blue-100 dark:shadow-blue-900/20' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-gray-900/20'
        }
      `}
      onClick={onClick}
    >
      {/* Color indicator with gradient */}
      <div className="absolute top-4 right-4">
        <div 
          className="w-3 h-3 rounded-full shadow-sm border border-white dark:border-gray-800"
          style={{ backgroundColor: project.color }}
        />
      </div>

      {/* Project info */}
      <div className="pr-16">
        {/* Project name with better typography */}
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.name}
        </h3>
        
        {/* Description with better spacing */}
        {project.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Modern stats layout */}
        <div className="space-y-3">
          {/* Task counts with icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {project.taskCount || 0} tasks
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {project.completedTaskCount || 0} done
                </span>
              </div>
            </div>
            
            {/* Completion percentage with better styling */}
            {project.taskCount && project.taskCount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  {completionPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* Progress bar with better design */}
          {project.taskCount && project.taskCount > 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${completionPercentage}%`,
                  background: `linear-gradient(90deg, ${project.color}80, ${project.color})`
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action menu - Right side, click to open */}
      <div className="absolute top-3 right-12 flex items-center">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Toggle dropdown visibility
              const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
              if (dropdown) {
                const isVisible = dropdown.classList.contains('opacity-100');
                // Close all other dropdowns first
                document.querySelectorAll('.project-dropdown').forEach(el => {
                  el.classList.remove('opacity-100', 'visible');
                  el.classList.add('opacity-0', 'invisible');
                });
                // Toggle current dropdown
                if (!isVisible) {
                  dropdown.classList.remove('opacity-0', 'invisible');
                  dropdown.classList.add('opacity-100', 'visible');
                }
              }
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 min-w-[32px] min-h-[32px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Project actions"
            title="Project actions"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible project-dropdown transition-all duration-200 z-10">
            <div className="py-1">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(project);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit project
                </button>
              )}
              
              {onArchive && !project.isArchived && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(project);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4m0 0l4-4m-4 4V3" />
                  </svg>
                  Archive project
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete project
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group"
      >
        {cardContent}
      </motion.div>
    );
  }

  return <div className="group">{cardContent}</div>;
};

export default ProjectCardNew;
