import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskCard from '../../components/TaskCard';
import { Task, TaskPriority, TaskCategory } from '../../types/Task';

// Mock the motion components to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock date-fns format function
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    if (formatStr === 'MMM d, yyyy') return 'Apr 19, 2025';
    if (formatStr === 'h:mm a') return '12:00 AM';
    return 'Apr 19, 2025';
  }),
}));

const mockTask: Task = {
  id: 1,
  userId: 'test-user',
  title: 'Test Task',
  date: '2025-04-19T12:00:00.000Z',
  isCompleted: false,
  recurrenceType: 0,
  priority: TaskPriority.Medium,
  category: TaskCategory.Other,
  description: 'Test description',
  tags: 'tag1, tag2, tag3',
  isArchived: false,
};

const mockTaskWithoutTags: Task = {
  ...mockTask,
  id: 2,
  title: 'Task Without Tags',
  tags: '',
};

describe('TaskCard Component', () => {
  const mockProps = {
    task: mockTask,
    onToggleComplete: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    animated: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task title', () => {
    render(<TaskCard {...mockProps} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task description', () => {
    render(<TaskCard {...mockProps} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render task date and time', () => {
    render(<TaskCard {...mockProps} />);
    expect(screen.getByText('Apr 19, 2025')).toBeInTheDocument();
    expect(screen.getByText('12:00 AM')).toBeInTheDocument();
  });

  it('should render tags when they exist', () => {
    render(<TaskCard {...mockProps} />);
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
  });

  it('should not render tags section when tags are empty', () => {
    render(<TaskCard {...mockProps} task={mockTaskWithoutTags} />);
    
    expect(screen.queryByText('tag1')).not.toBeInTheDocument();
    expect(screen.queryByText('tag2')).not.toBeInTheDocument();
    expect(screen.queryByText('tag3')).not.toBeInTheDocument();
  });

  it('should not render tags section when tags are null', () => {
    const taskWithNullTags = { ...mockTask, tags: undefined };
    render(<TaskCard {...mockProps} task={taskWithNullTags} />);
    
    expect(screen.queryByText('tag1')).not.toBeInTheDocument();
  });

  it('should handle tags with extra spaces', () => {
    const taskWithSpaces = { ...mockTask, tags: ' tag1 , tag2 , tag3 ' };
    render(<TaskCard {...mockProps} task={taskWithSpaces} />);
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
  });

  it('should filter out empty tags', () => {
    const taskWithEmptyTags = { ...mockTask, tags: 'tag1,,tag2, ,tag3' };
    render(<TaskCard {...mockProps} task={taskWithEmptyTags} />);
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
    // Should only have 3 tags, not empty ones
    const tagElements = screen.getAllByText(/^tag\d$/);
    expect(tagElements).toHaveLength(3);
  });

  it('should render action buttons', () => {
    render(<TaskCard {...mockProps} />);
    
    // Check for aria-labels to identify buttons
    expect(screen.getByLabelText('Mark as complete')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit task')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete task')).toBeInTheDocument();
  });

  it('should show completed state when task is completed', () => {
    const completedTask = { ...mockTask, isCompleted: true };
    render(<TaskCard {...mockProps} task={completedTask} />);
    
    expect(screen.getByLabelText('Mark as incomplete')).toBeInTheDocument();
  });
});
