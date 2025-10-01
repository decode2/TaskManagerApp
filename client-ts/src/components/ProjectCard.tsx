import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected = false,
  onClick,
  onEdit,
  onDelete,
  onArchive,
  animated = true
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const completionPercentage = project.taskCount && project.taskCount > 0 
    ? Math.round((project.completedTaskCount || 0) / project.taskCount * 100)
    : 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector(`[data-dropdown-id="${project.id}"]`);
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, project.id]);

  const cardContent = (
    <div 
      className={`
        relative p-5 rounded-xl cursor-pointer group border-2
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-400' 
          : ''
        }
      `}
      style={{
        backgroundColor: isSelected ? undefined : 'var(--bg-elevated)',
        borderColor: isSelected ? undefined : 'var(--border-light)',
        boxShadow: isSelected ? '0 4px 6px var(--shadow-medium)' : '0 0 0 1px var(--border-light)',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
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
        <h3 className="font-bold text-lg text-primary mb-2 line-clamp-1 group-hover:text-accent-primary transition-colors">
          {project.name}
        </h3>
        
        {/* Description with better spacing */}
        {project.description && (
          <p className="text-sm text-secondary mb-4 line-clamp-2 leading-relaxed">
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
                <span className="text-sm font-medium text-secondary">
                  {project.taskCount || 0} tasks
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-accent-success"></div>
                <span className="text-sm font-medium text-secondary">
                  {project.completedTaskCount || 0} done
                </span>
              </div>
            </div>
            
            {/* Completion percentage with better styling */}
            {project.taskCount && project.taskCount > 0 ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  {completionPercentage}%
                </span>
              </div>
            ) : null}
          </div>

          {/* Progress bar with better design */}
          {project.taskCount && project.taskCount > 0 ? (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${completionPercentage}%`,
                  background: `linear-gradient(90deg, ${project.color}80, ${project.color})`
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Action menu - Right side, click to open */}
      <div className="absolute top-3 right-12 flex items-center">
        <div className="relative">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="p-1.5 rounded-lg text-tertiary hover:text-secondary min-w-[32px] min-h-[32px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            aria-label="Project actions"
            title="Project actions"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            // Apple-style micro-interactions
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(156, 163, 175, 0.1)", // gray-400/10
              transition: { 
                duration: 0.15, 
                ease: [0.25, 0.46, 0.45, 0.94] // Apple's custom easing
              }
            }}
            whileTap={{ 
              scale: 0.95,
              backgroundColor: "rgba(156, 163, 175, 0.2)", // gray-400/20
              transition: { 
                duration: 0.1, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }}
            transition={{
              backgroundColor: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
              scale: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
            }}
            style={{
              // Prevent text reflow during animation
              willChange: 'transform, background-color'
            }}
          >
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{
                rotate: isDropdownOpen ? 90 : 0
              }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </motion.svg>
          </motion.button>
          
          {/* Dropdown menu with Apple-style animations */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                className="absolute right-0 top-full mt-1 w-48 bg-elevated rounded-lg shadow-medium border border-light z-10"
                data-dropdown-id={project.id}
                initial={{ 
                  opacity: 0, 
                  scale: 0.98, 
                  y: -6
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.98, 
                  y: -6
                }}
                transition={{
                  duration: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94], // Apple's custom easing
                }}
                style={{
                  transformOrigin: "top right"
                }}
              >
            <div className="py-1">
              {onEdit && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    onEdit(project);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-secondary flex items-center gap-2"
                  whileHover={{ 
                    backgroundColor: "rgba(156, 163, 175, 0.1)", // gray-400/10
                    transition: { duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                  whileTap={{ 
                    backgroundColor: "rgba(156, 163, 175, 0.2)", // gray-400/20
                    scale: 0.98,
                    transition: { duration: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                >
                  <motion.svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </motion.svg>
                  Edit project
                </motion.button>
              )}
              
              {onArchive && !project.isArchived && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    onArchive(project);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-secondary flex items-center gap-2"
                  whileHover={{ 
                    backgroundColor: "rgba(156, 163, 175, 0.1)",
                    transition: { duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                  whileTap={{ 
                    backgroundColor: "rgba(156, 163, 175, 0.2)",
                    scale: 0.98,
                    transition: { duration: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                >
                  <motion.svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4m0 0l4-4m-4 4V3" />
                  </motion.svg>
                  Archive project
                </motion.button>
              )}
              
              {onDelete && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    onDelete(project);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-accent-error flex items-center gap-2"
                  whileHover={{ 
                    backgroundColor: "rgba(239, 68, 68, 0.1)", // red-500/10
                    transition: { duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                  whileTap={{ 
                    backgroundColor: "rgba(239, 68, 68, 0.2)", // red-500/20
                    scale: 0.98,
                    transition: { duration: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                >
                  <motion.svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </motion.svg>
                  Delete project
                </motion.button>
              )}
            </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  if (animated) {
    // Handle mouse move for parallax effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
      setIsHovered(false);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1
        }}
        exit={{ opacity: 0, y: -20 }}
        className="group motion-element relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ 
          perspective: '1000px',
          willChange: 'transform, filter',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          filter: isHovered && !isSelected
            ? 'drop-shadow(0 20px 25px rgba(0,0,0,0.25)) drop-shadow(0 10px 10px rgba(0,0,0,0.15))'
            : 'none',
          transition: 'filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        whileHover={!isSelected ? {
          y: -12,
          scale: 1.03,
          rotateX: mousePosition.y * 5,
          rotateY: mousePosition.x * 5
        } : {}}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 25
        }}
      >
        {/* Parallax glow effect following mouse */}
        {isHovered && !isSelected && (
          <>
            {/* Dynamic gradient glow that follows mouse */}
            <motion.div
              className="absolute inset-0 rounded-xl -z-10"
              animate={{ 
                opacity: 0.7,
                x: mousePosition.x * 10,
                y: mousePosition.y * 10
              }}
              transition={{ 
                type: 'spring',
                stiffness: 150,
                damping: 20
              }}
              style={{
                background: `radial-gradient(circle at ${50 + mousePosition.x * 50}% ${50 + mousePosition.y * 50}%, var(--accent-primary), transparent 60%)`,
                filter: 'blur(25px)',
                transform: 'scale(1.1)'
              }}
            />
            {/* Secondary glow layer for depth */}
            <motion.div
              className="absolute inset-0 rounded-xl -z-10"
              animate={{ 
                opacity: 0.4,
                x: mousePosition.x * -5,
                y: mousePosition.y * -5
              }}
              transition={{ 
                type: 'spring',
                stiffness: 100,
                damping: 25
              }}
              style={{
                background: `radial-gradient(circle at ${50 - mousePosition.x * 30}% ${50 - mousePosition.y * 30}%, var(--accent-primary), transparent 50%)`,
                filter: 'blur(30px)',
                transform: 'scale(1.15)'
              }}
            />
          </>
        )}
        {cardContent}
      </motion.div>
    );
  }

  return <div className="group">{cardContent}</div>;
};

export default ProjectCard;
