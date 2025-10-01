import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { projectService } from '../services/projectService';
import { Project, CreateProjectDto, UpdateProjectDto } from '../types/Project';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData = await projectService.getProjects();
      setProjects(projectsData);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData: CreateProjectDto): Promise<void> => {
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      toast.success('Project created successfully!');
    } catch (err) {
      console.error('Failed to create project:', err);
      toast.error('Failed to create project');
    }
  }, []);

  const updateProject = useCallback(async (id: number, projectData: UpdateProjectDto): Promise<boolean> => {
    try {
      await projectService.updateProject(id, projectData);
      setProjects(prev => 
        prev.map(project => 
          project.id === id 
            ? { ...project, ...projectData, updatedAt: new Date().toISOString() }
            : project
        )
      );
      toast.success('Project updated successfully!');
      return true;
    } catch (err) {
      console.error('Failed to update project:', err);
      toast.error('Failed to update project');
      return false;
    }
  }, []);

  const deleteProject = useCallback(async (id: number): Promise<boolean> => {
    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      toast.success('Project deleted successfully!');
      return true;
    } catch (err) {
      console.error('Failed to delete project:', err);
      toast.error('Failed to delete project');
      return false;
    }
  }, []);

  const archiveProject = useCallback(async (id: number): Promise<boolean> => {
    try {
      await projectService.archiveProject(id);
      setProjects(prev => 
        prev.map(project => 
          project.id === id 
            ? { ...project, isArchived: true, updatedAt: new Date().toISOString() }
            : project
        )
      );
      toast.success('Project archived successfully!');
      return true;
    } catch (err) {
      console.error('Failed to archive project:', err);
      toast.error('Failed to archive project');
      return false;
    }
  }, []);

  const unarchiveProject = useCallback(async (id: number): Promise<boolean> => {
    try {
      await projectService.unarchiveProject(id);
      setProjects(prev => 
        prev.map(project => 
          project.id === id 
            ? { ...project, isArchived: false, updatedAt: new Date().toISOString() }
            : project
        )
      );
      toast.success('Project unarchived successfully!');
      return true;
    } catch (err) {
      console.error('Failed to unarchive project:', err);
      toast.error('Failed to unarchive project');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    unarchiveProject,
  };
};
