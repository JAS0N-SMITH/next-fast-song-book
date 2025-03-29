'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCurrentSong } from '../../../features/songs/songSlice';
import { useApi } from '../../../hooks/useApi';
import KeySelector from '../../../components/KeySelector';
import TempoControl from '../../../components/TempoControl';
import TimeSignatureSelector from '../../../components/TimeSignatureSelector';
import ChordProgression from '../../../components/ChordProgression';
import SongStructure from '../../../components/SongStructure';
import LyricsEditor from '../../../components/LyricsEditor';
import { ThemeToggle } from '../../../components/ThemeToggle';
import Link from 'next/link';

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
  const dispatch = useDispatch();
  const { apiCall, updateSong } = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [title, setTitle] = useState('');
  const [key, setKey] = useState('C');
  const [tempo, setTempo] = useState(120);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [chords, setChords] = useState<string[]>([]);
  const [structure, setStructure] = useState<string[]>([]);
  const [lyrics, setLyrics] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadSong = async () => {
      try {
        const response = await apiCall<Song>(`/api/songs/${params.id}`);
        if (response.error) {
          throw new Error(response.error);
        }
        if (!response.data) {
          throw new Error('Song not found');
        }
        const songData = response.data;
        setSong(songData);
        setTitle(songData.title);
        setKey(songData.key);
        setTempo(songData.tempo);
        setTimeSignature(songData.timeSignature);
        setChords(songData.chords);
        setStructure(songData.structure);
        setLyrics(songData.lyrics);
        setNotes(songData.notes);
      } catch (error) {
        console.error('Failed to load song:', error);
        setError(error instanceof Error ? error.message : 'Failed to load song');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadSong();
    }
  }, [params.id, apiCall]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!song) {
      setError('Song not found');
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateSong(song.id, {
        title: title.trim(),
        key,
        tempo,
        timeSignature,
        chords,
        structure,
        lyrics,
        notes,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No data received from server');
      }

      dispatch(setCurrentSong(response.data));
      router.push('/songs');
    } catch (error) {
      console.error('Failed to update song:', error);
      alert(error instanceof Error ? error.message : 'Failed to update song. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-red-100">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-xl font-semibold text-gray-900">Error</h1>
            </div>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-4">
              <Link
                href="/songs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Songs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 dark:from-dark-bg dark:to-dark-card">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-800 dark:to-indigo-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                href="/songs"
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-white">Edit Song</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-dark-card dark:text-dark-text dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Input */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-indigo-100">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
            Song Title
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full pl-4 pr-4 py-3 border border-indigo-200 dark:border-dark-border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50 dark:bg-dark-bg text-lg font-medium placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-dark-text"
              placeholder="Enter your song title..."
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-indigo-400 dark:text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Song Settings */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-indigo-100 dark:border-dark-border">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Song Settings</h2>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <KeySelector value={key} onChange={setKey} />
                  <TimeSignatureSelector value={timeSignature} onChange={setTimeSignature} />
                </div>
                <TempoControl value={tempo} onChange={setTempo} />
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-indigo-100 dark:border-dark-border">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Chord Progression</h2>
              </div>
              <ChordProgression value={chords} onChange={setChords} currentKey={key} />
            </div>
          </div>

          {/* Right Column - Structure and Lyrics */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-indigo-100 dark:border-dark-border">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Song Structure</h2>
              </div>
              <SongStructure value={structure} onChange={setStructure} />
            </div>

            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-indigo-100 dark:border-dark-border">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Lyrics</h2>
              </div>
              <LyricsEditor value={lyrics} onChange={setLyrics} />
            </div>

            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-indigo-100 dark:border-dark-border">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Additional Notes</h2>
              </div>
              <div className="relative">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="block w-full pl-4 pr-4 py-3 border border-indigo-200 dark:border-dark-border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50 dark:bg-dark-bg text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-dark-text resize-none"
                  placeholder="Add any additional notes about your song..."
                />
                <div className="absolute top-3 right-3">
                  <svg className="h-5 w-5 text-indigo-400 dark:text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 