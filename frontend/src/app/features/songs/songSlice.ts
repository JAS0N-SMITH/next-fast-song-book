import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Song {
  id: number;
  title: string;
  key: string;
  tempo: number;
  timeSignature: string;
  structure: Record<string, any>;
  chords: Record<string, any>;
  lyrics: Record<string, any>;
  userId: string;
}

interface SongState {
  songs: Song[];
  currentSong: Song | null;
  loading: boolean;
  error: string | null;
}

const initialState: SongState = {
  songs: [],
  currentSong: null,
  loading: false,
  error: null,
};

const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setSongs: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
    },
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addSong: (state, action: PayloadAction<Song>) => {
      state.songs.push(action.payload);
    },
    updateSong: (state, action: PayloadAction<Song>) => {
      const index = state.songs.findIndex(song => song.id === action.payload.id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
      if (state.currentSong?.id === action.payload.id) {
        state.currentSong = action.payload;
      }
    },
    deleteSong: (state, action: PayloadAction<number>) => {
      state.songs = state.songs.filter(song => song.id !== action.payload);
      if (state.currentSong?.id === action.payload) {
        state.currentSong = null;
      }
    },
  },
});

export const {
  setSongs,
  setCurrentSong,
  setLoading,
  setError,
  addSong,
  updateSong,
  deleteSong,
} = songSlice.actions;

export default songSlice.reducer; 