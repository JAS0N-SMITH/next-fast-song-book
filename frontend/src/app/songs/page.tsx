'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCurrentSong } from '../../features/songs/songSlice';
import { useApi } from '../../hooks/useApi';
import { ThemeToggle } from '../../components/ThemeToggle';
import CustomDropdown from '../../components/CustomDropdown';

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
              <CustomDropdown
                value={sortBy}
                onChange={(value) => setSortBy(value as 'title' | 'key' | 'tempo')}
                options={['title', 'key', 'tempo']}
                placeholder="Sort by..."
                width="half"
              />
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="inline-flex items-center justify-center px-4 py-2 border border-indigo-200 dark:border-dark-border rounded-md hover:bg-indigo-50 dark:hover:bg-dark-border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-colors"
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
                className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-indigo-100 dark:border-dark-border hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">{song.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            {song.key}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {song.tempo} BPM
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            {song.timeSignature}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/songs/${song.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    {deleteConfirmId === song.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(song.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border text-sm font-medium rounded-md text-gray-700 dark:text-dark-text bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(song.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 