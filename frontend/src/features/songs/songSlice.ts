import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface SongState {
  currentSong: Song | null;
  songs: Song[];
  loading: boolean;
  error: string | null;
}

const initialState: SongState = {
  currentSong: null,
  songs: [],
  loading: false,
  error: null,
};

const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
    },
    setSongs: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
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
    deleteSong: (state, action: PayloadAction<string>) => {
      state.songs = state.songs.filter(song => song.id !== action.payload);
      if (state.currentSong?.id === action.payload) {
        state.currentSong = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentSong,
  setSongs,
  addSong,
  updateSong,
  deleteSong,
  setLoading,
  setError,
} = songSlice.actions;

export default songSlice.reducer; 