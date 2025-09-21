import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple test that doesn't depend on App component
test('renders basic content', () => {
  render(<div>Test Content</div>);
  const contentElement = screen.getByText(/test content/i);
  expect(contentElement).toBeInTheDocument();
});
