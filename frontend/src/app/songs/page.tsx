'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCurrentSong } from '../../features/songs/songSlice';
import { useApi } from '../../hooks/useApi';
import { ThemeToggle } from '../../components/ThemeToggle';

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

export default function SongsList() {
  const dispatch = useDispatch();
  const { apiCall } = useApi();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'key' | 'tempo'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const response = await apiCall<Song[]>('/api/songs');
        if (response.error) {
          setError(response.error);
          return;
        }
        setSongs(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load songs');
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  const filteredAndSortedSongs = React.useMemo(() => {
    return songs
      .filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.key.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        switch (sortBy) {
          case 'title':
            return multiplier * a.title.localeCompare(b.title);
          case 'key':
            return multiplier * a.key.localeCompare(b.key);
          case 'tempo':
            return multiplier * (a.tempo - b.tempo);
          default:
            return 0;
        }
      });
  }, [songs, searchQuery, sortBy, sortOrder]);

  const handleDelete = async (songId: string) => {
    try {
      const response = await apiCall<void>(`/api/songs/${songId}`, {
        method: 'DELETE',
      });
      if (response.error) {
        setError(response.error);
        return;
      }
      setSongs(songs.filter(s => s.id !== songId));
      setDeleteConfirmId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete song');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-dark-border rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-dark-border rounded animate-pulse"></div>
          </div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-4 flex-1">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-dark-border rounded"></div>
                    <div className="h-4 w-64 bg-gray-200 dark:bg-dark-border rounded"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-8 w-16 bg-gray-200 dark:bg-dark-border rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4 text-center">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
          >
            Try Again
          </button>
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
                href="/"
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-white">My Songs</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/songs/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-dark-card dark:text-dark-text dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Song
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 mb-6 border border-indigo-100 dark:border-dark-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search songs by title or key..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-indigo-200 dark:border-dark-border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400 dark:text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'title' | 'key' | 'tempo')}
                className="border border-indigo-200 dark:border-dark-border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              >
                <option value="title">Title</option>
                <option value="key">Key</option>
                <option value="tempo">Tempo</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="border border-indigo-200 dark:border-dark-border rounded-md px-4 py-2 hover:bg-indigo-50 dark:hover:bg-dark-border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Songs List */}
        {filteredAndSortedSongs.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-8 text-center border border-indigo-100 dark:border-dark-border">
            <div className="relative">
              <svg
                className="mx-auto h-16 w-16 text-indigo-400 dark:text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-dark-text">No songs found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-dark-text-secondary">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Get started by creating a new song'}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <Link
                  href="/songs/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-md"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Song
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAndSortedSongs.map((song) => (
              <div
                key={song.id}
                className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-indigo-100 dark:border-dark-border hover:border-indigo-200 dark:hover:border-indigo-500"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">{song.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-dark-text-secondary">
                      <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">
                        <svg className="h-4 w-4 text-indigo-500 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        {song.key}
                      </span>
                      <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">
                        <svg className="h-4 w-4 text-indigo-500 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        {song.tempo} BPM
                      </span>
                      <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">
                        <svg className="h-4 w-4 text-indigo-500 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        {song.timeSignature}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {song.chords.slice(0, 4).map((chord, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300"
                        >
                          {chord}
                        </span>
                      ))}
                      {song.chords.length > 4 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-border text-gray-800 dark:text-dark-text-secondary">
                          +{song.chords.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/songs/${song.id}`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full"
                    >
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => setDeleteConfirmId(song.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                    >
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-card rounded-lg p-6 max-w-md w-full shadow-xl border border-red-100 dark:border-red-900/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text">Delete Song</h3>
              <p className="text-sm text-gray-500 dark:text-dark-text-secondary mb-6">
                Are you sure you want to delete this song? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-text bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 