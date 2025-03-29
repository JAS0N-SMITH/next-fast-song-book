import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setError, setLoading } from '../features/songs/songSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useApi = () => {
  const dispatch = useDispatch();

  const fetchSongs = async () => {
    try {
      dispatch(setLoading(true));
      const response = await api.get('/songs');
      return response.data;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch songs'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createSong = async (songData: any) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post('/songs', songData);
      return response.data;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create song'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateSong = async (id: number, songData: any) => {
    try {
      dispatch(setLoading(true));
      const response = await api.put(`/songs/${id}`, songData);
      return response.data;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update song'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteSong = async (id: number) => {
    try {
      dispatch(setLoading(true));
      await api.delete(`/songs/${id}`);
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to delete song'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    fetchSongs,
    createSong,
    updateSong,
    deleteSong,
  };
}; 