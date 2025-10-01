import api from '../api';
import { Project, CreateProjectDto, UpdateProjectDto } from '../types/Project';

export const projectService = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Get a specific project
  getProject: async (id: number): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Get tasks for a project
  getProjectTasks: async (id: number): Promise<any[]> => {
    const response = await api.get(`/projects/${id}/tasks`);
    return response.data;
  },

  // Create a new project
  createProject: async (projectData: CreateProjectDto): Promise<Project> => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Update a project
  updateProject: async (id: number, projectData: UpdateProjectDto): Promise<void> => {
    await api.put(`/projects/${id}`, projectData);
  },

  // Delete a project
  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  // Archive a project
  archiveProject: async (id: number): Promise<void> => {
    await api.patch(`/projects/${id}/archive`);
  },

  // Unarchive a project
  unarchiveProject: async (id: number): Promise<void> => {
    await api.patch(`/projects/${id}/unarchive`);
  },
};
