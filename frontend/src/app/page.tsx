'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApi } from '../hooks/useApi';

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
  createdAt: string;
}

export default function Home() {
  const { apiCall } = useApi();
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentSongs = async () => {
      try {
        const response = await apiCall<Song[]>('/api/songs');
        if (response.error) {
          console.error('Failed to load recent songs:', response.error);
          return;
        }
        // The API now returns songs sorted by creation date
        setRecentSongs(response.data?.slice(0, 3) || []);
      } catch (err) {
        console.error('Failed to load recent songs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecentSongs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-600">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-indigo-600 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-90" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Songwriting Companion
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
            Create, manage, and organize your songs with ease. Track chord progressions, lyrics, and song structure all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/songs/new"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
            >
              Start Writing
            </Link>
            <Link
              href="/songs"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 md:py-4 md:text-lg md:px-10"
            >
              View My Songs
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to write great songs
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Chord Progression */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Chord Progressions</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Track and experiment with different chord progressions in any key.
                  </p>
                </div>
              </div>

              {/* Song Structure */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Song Structure</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Organize your song sections with a flexible structure builder.
                  </p>
                </div>
              </div>

              {/* Lyrics Editor */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Lyrics Editor</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Write and edit lyrics with a clean, distraction-free interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Songs Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Recent Songs</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your Latest Work
            </p>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4 flex-1">
                        <div className="h-6 w-48 bg-gray-200 rounded"></div>
                        <div className="h-4 w-64 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentSongs.length > 0 ? (
              <div className="grid gap-6">
                {recentSongs.map((song) => (
                  <Link
                    key={song.id}
                    href={`/songs/${song.id}`}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900">{song.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            {song.key}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            {song.tempo} BPM
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {new Date(song.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No songs yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new song.</p>
                <div className="mt-6">
                  <Link
                    href="/songs/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start writing?</span>
            <span className="block text-indigo-200">Start your next song today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/songs/new"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 