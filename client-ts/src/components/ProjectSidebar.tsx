import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types/Project';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

interface ProjectSidebarProps {
  projects: Project[];
  selectedProjectId?: number | null;
  onProjectSelect: (projectId: number | null) => void;
  onProjectCreate: (data: any) => Promise<void>;
  onProjectUpdate: (id: number, data: any) => Promise<boolean>;
  onProjectDelete: (id: number) => Promise<boolean>;
  onProjectArchive: (id: number) => Promise<boolean>;
  loading?: boolean;
  className?: string;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
  onProjectArchive,
  loading = false,
  className = ''
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = async (data: any) => {
    await onProjectCreate(data);
    setShowCreateModal(false);
  };

  const handleUpdateProject = async (data: any) => {
    if (editingProject) {
      const success = await onProjectUpdate(editingProject.id, data);
      if (success) {
        setEditingProject(null);
      }
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      await onProjectDelete(project.id);
    }
  };

  const handleArchiveProject = async (project: Project) => {
    if (window.confirm(`Are you sure you want to archive "${project.name}"?`)) {
      await onProjectArchive(project.id);
    }
  };

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col ${className}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Projects
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              aria-label="Create new project"
              title="Create new project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

          {/* All Tasks Button */}
          <button
            onClick={() => onProjectSelect(null)}
            className={`
              w-full p-3 rounded-lg text-left transition-all duration-200 mb-2
              ${selectedProjectId === null
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-gray-500" />
              <div>
                <div className="font-medium">All Tasks</div>
                <div className="text-sm opacity-75">View all your tasks</div>
              </div>
            </div>
          </button>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-200px)]">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-20" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                No projects yet
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                Create your first project
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                        <ProjectCard
                    project={project}
                    isSelected={selectedProjectId === project.id}
                    onClick={() => onProjectSelect(project.id)}
                    onEdit={setEditingProject}
                    onDelete={handleDeleteProject}
                    onArchive={handleArchiveProject}
                    animated={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        title="Create New Project"
      />

      <ProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={handleUpdateProject}
        project={editingProject}
        title="Edit Project"
      />
    </>
  );
};

export default ProjectSidebar;
