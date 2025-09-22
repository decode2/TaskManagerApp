import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '../../hooks/useApi';

// Mock fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useApi Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const mockApiFunction = jest.fn();
    const { result } = renderHook(() => useApi(mockApiFunction));

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.execute).toBe('function');
    expect(typeof result.current.reset).toBe('function');
    expect(typeof result.current.setData).toBe('function');
  });

  it('should execute API function and update state', async () => {
    const mockData = { id: 1, title: 'Test Task' };
    const mockApiFunction = jest.fn().mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useApi(mockApiFunction));

    // Execute the API function
    await result.current.execute();

    expect(mockApiFunction).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle API function errors', async () => {
    const mockError = new Error('API Error');
    const mockApiFunction = jest.fn().mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useApi(mockApiFunction));

    // Execute the API function
    await result.current.execute();

    expect(mockApiFunction).toHaveBeenCalled();
    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('API Error');
  });

  it('should reset state when reset is called', async () => {
    const mockData = { id: 1, title: 'Test Task' };
    const mockApiFunction = jest.fn().mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useApi(mockApiFunction));

    // Execute and get data
    await result.current.execute();
    expect(result.current.data).toEqual(mockData);

    // Reset state
    result.current.reset();

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should set data when setData is called', () => {
    const mockApiFunction = jest.fn();
    const { result } = renderHook(() => useApi(mockApiFunction));

    const newData = { id: 2, title: 'New Task' };
    result.current.setData(newData);

    expect(result.current.data).toEqual(newData);
  });
});
