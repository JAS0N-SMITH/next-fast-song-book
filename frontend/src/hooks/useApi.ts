import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface Song {
  id: string;
  title: string;
  key: string;
  tempo: number;
  timeSignature: string;
  chords: string[];
  structure: string[];
  lyrics: string;
  notes: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useApi() {
  const [state, setState] = useState<ApiResponse<unknown>>({
    data: null,
    error: null,
    loading: false,
  });

  const apiCall = useCallback(async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState(prev => ({ ...prev, data, error: null }));
      return { data, error: null, loading: false };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      return { data: null, error: errorMessage, loading: false };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const createSong = useCallback(async (song: Omit<Song, 'id'>): Promise<ApiResponse<Song>> => {
    return apiCall<Song>('/api/songs', {
      method: 'POST',
      body: JSON.stringify(song),
    });
  }, [apiCall]);

  const updateSong = useCallback(async (id: string, song: Partial<Song>): Promise<ApiResponse<Song>> => {
    return apiCall<Song>(`/api/songs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(song),
    });
  }, [apiCall]);

  const deleteSong = useCallback(async (id: string): Promise<ApiResponse<void>> => {
    return apiCall<void>(`/api/songs/${id}`, {
      method: 'DELETE',
    });
  }, [apiCall]);

  return {
    ...state,
    apiCall,
    createSong,
    updateSong,
    deleteSong,
  };
} 