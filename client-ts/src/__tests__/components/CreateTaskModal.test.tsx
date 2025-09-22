import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateTaskModal } from '../../components/CreateTaskModal';
import { taskService } from '../../services/taskService';

// Mock the task service
jest.mock('../../services/taskService');
const mockTaskService = taskService as jest.Mocked<typeof taskService>;

describe('CreateTaskModal', () => {
  const mockOnClose = jest.fn();
  const mockOnTaskCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onTaskCreated={mockOnTaskCreated} 
      />
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  it('should create task when form is submitted with valid data', async () => {
    const mockTask = { id: 1, title: 'Test Task', description: 'Test Description' };
    mockTaskService.createTask.mockResolvedValue(mockTask);

    render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onTaskCreated={mockOnTaskCreated} 
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/title/i), { 
      target: { value: 'Test Task' } 
    });
    fireEvent.change(screen.getByLabelText(/description/i), { 
      target: { value: 'Test Description' } 
    });

    // Submit form
    fireEvent.click(screen.getByText(/create task/i));

    await waitFor(() => {
      expect(mockTaskService.createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        dueDate: expect.any(String),
        priority: expect.any(Number),
        category: expect.any(String)
      });
      expect(mockOnTaskCreated).toHaveBeenCalledWith(mockTask);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should show validation error for empty title', async () => {
    render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onTaskCreated={mockOnTaskCreated} 
      />
    );

    // Try to submit without title
    fireEvent.click(screen.getByText(/create task/i));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    expect(mockTaskService.createTask).not.toHaveBeenCalled();
  });

  it('should close modal when cancel button is clicked', () => {
    render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onTaskCreated={mockOnTaskCreated} 
      />
    );

    fireEvent.click(screen.getByText(/cancel/i));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
