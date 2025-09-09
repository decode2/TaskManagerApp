import { useState, useCallback } from 'react';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Custom hook for handling API calls with loading states and error handling
 * 
 * @param apiFunction - The async function to execute
 * @param options - Configuration options
 * @returns Object with data, loading, error states and execute function
 * 
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useApi(fetchTasks);
 * 
 * // Execute manually
 * const handleFetch = () => execute();
 * 
 * // Execute with parameters
 * const handleCreate = (taskData) => execute(taskData);
 * ```
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(...args);
      setState(prev => ({ ...prev, data: result, loading: false }));
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      return null;
    }
  }, [apiFunction, options.onSuccess, options.onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

/**
 * Hook for handling multiple API calls with individual states
 * 
 * @param apiFunctions - Object with API functions
 * @returns Object with individual useApi instances
 * 
 * @example
 * ```tsx
 * const apis = useMultipleApis({
 *   tasks: fetchTasks,
 *   user: fetchUser,
 *   settings: fetchSettings
 * });
 * 
 * // Use individual APIs
 * apis.tasks.execute();
 * apis.user.execute(userId);
 * ```
 */
export function useMultipleApis<T extends Record<string, (...args: any[]) => Promise<any>>>(
  apiFunctions: T
): { [K in keyof T]: UseApiReturn<Awaited<ReturnType<T[K]>>> } {
  const apis = {} as { [K in keyof T]: UseApiReturn<Awaited<ReturnType<T[K]>>> };

  for (const key in apiFunctions) {
    apis[key] = useApi(apiFunctions[key]);
  }

  return apis;
}
