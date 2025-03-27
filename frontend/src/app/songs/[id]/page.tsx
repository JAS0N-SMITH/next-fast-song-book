'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentSong } from '@/features/songs/songSlice';
import { useApi } from '@/hooks/useApi';
import KeySelector from '@/components/KeySelector';
import TempoControl from '@/components/TempoControl';
import TimeSignatureSelector from '@/components/TimeSignatureSelector';
import ChordProgression from '@/components/ChordProgression';
import SongStructure from '@/components/SongStructure';
import LyricsEditor from '@/components/LyricsEditor';
import NotesEditor from '@/components/NotesEditor';

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

export default function SongDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { apiCall } = useApi();
  const currentSong = useAppSelector((state) => state.songs.currentSong);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (!params.id || params.id === 'undefined') {
      router.push('/songs');
      return;
    }

    const loadSong = async () => {
      try {
        const response = await apiCall<Song>(`/api/songs/${params.id}`);
        if (response.error) {
          setError(response.error);
          return;
        }
        if (!response.data) {
          setError('Song not found');
          return;
        }
        dispatch(setCurrentSong(response.data));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load song');
      } finally {
        setLoading(false);
      }
    };

    loadSong();
  }, [params.id, apiCall, dispatch, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4 text-center">Error: {error}</div>
          <button
            onClick={() => router.push('/songs')}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
          >
            Back to Songs
          </button>
        </div>
      </div>
    );
  }

  if (!currentSong) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="text-gray-600 mb-4 text-center">Song not found</div>
          <button
            onClick={() => router.push('/songs')}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
          >
            Back to Songs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex-1 mr-4">
              <input
                type="text"
                value={currentSong.title}
                onChange={async (e) => {
                  try {
                    const response = await apiCall<Song>(`/api/songs/${currentSong.id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        ...currentSong,
                        title: e.target.value,
                      }),
                    });
                    if (response.error) {
                      setError(response.error);
                      return;
                    }
                    dispatch(setCurrentSong(response.data));
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to update title');
                  }
                }}
                className="text-3xl font-bold w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Enter song title..."
              />
            </div>
            <button
              onClick={() => router.push('/songs')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Back to Songs
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Song Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Song Settings</h2>
              <div className="space-y-4">
                <KeySelector
                  value={currentSong.key}
                  onChange={async (key) => {
                    try {
                      const response = await apiCall<Song>(`/api/songs/${currentSong.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                          ...currentSong,
                          key,
                        }),
                      });
                      if (response.error) {
                        setError(response.error);
                        return;
                      }
                      dispatch(setCurrentSong(response.data));
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to update key');
                    }
                  }}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tempo</label>
                  <TempoControl
                    value={currentSong.tempo}
                    onChange={async (tempo) => {
                      try {
                        const response = await apiCall<Song>(`/api/songs/${currentSong.id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({
                            ...currentSong,
                            tempo,
                          }),
                        });
                        if (response.error) {
                          setError(response.error);
                          return;
                        }
                        dispatch(setCurrentSong(response.data));
                      } catch (err) {
                        setError(err instanceof Error ? err.message : 'Failed to update tempo');
                      }
                    }}
                  />
                </div>
                <TimeSignatureSelector
                  value={currentSong.timeSignature}
                  onChange={async (timeSignature) => {
                    try {
                      const response = await apiCall<Song>(`/api/songs/${currentSong.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                          ...currentSong,
                          timeSignature,
                        }),
                      });
                      if (response.error) {
                        setError(response.error);
                        return;
                      }
                      dispatch(setCurrentSong(response.data));
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to update time signature');
                    }
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chord Progression</h2>
              <ChordProgression
                value={currentSong.chords}
                onChange={async (chords) => {
                  try {
                    const response = await apiCall<Song>(`/api/songs/${currentSong.id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        ...currentSong,
                        chords,
                      }),
                    });
                    if (response.error) {
                      setError(response.error);
                      return;
                    }
                    dispatch(setCurrentSong(response.data));
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to update chord progression');
                  }
                }}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Song Structure</h2>
              <SongStructure
                value={currentSong.structure}
                onChange={async (structure) => {
                  try {
                    const response = await apiCall<Song>(`/api/songs/${currentSong.id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        ...currentSong,
                        structure,
                      }),
                    });
                    if (response.error) {
                      setError(response.error);
                      return;
                    }
                    dispatch(setCurrentSong(response.data));
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to update song structure');
                  }
                }}
              />
            </div>
          </div>

          {/* Right Column - Lyrics and Notes */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lyrics</h2>
              <LyricsEditor
                value={currentSong.lyrics}
                onChange={async (lyrics) => {
                  try {
                    const response = await apiCall<Song>(`/api/songs/${currentSong.id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        ...currentSong,
                        lyrics,
                      }),
                    });
                    if (response.error) {
                      setError(response.error);
                      return;
                    }
                    dispatch(setCurrentSong(response.data));
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to update lyrics');
                  }
                }}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <NotesEditor
                value={currentSong.notes}
                onChange={async (notes) => {
                  try {
                    const response = await apiCall<Song>(`/api/songs/${currentSong.id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        ...currentSong,
                        notes,
                      }),
                    });
                    if (response.error) {
                      setError(response.error);
                      return;
                    }
                    dispatch(setCurrentSong(response.data));
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to update notes');
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 