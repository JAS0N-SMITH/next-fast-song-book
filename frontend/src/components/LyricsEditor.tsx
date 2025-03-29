import React from 'react';

interface LyricsEditorProps {
  value?: string;
  onChange: (lyrics: string) => void;
}

export default function LyricsEditor({ value = '', onChange }: LyricsEditorProps) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        className="block w-full pl-4 pr-4 py-3 border border-indigo-200 dark:border-dark-border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50 dark:bg-dark-bg text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-dark-text resize-none"
        placeholder="Enter your lyrics here..."
      />
      <div className="absolute top-3 right-3">
        <svg className="h-5 w-5 text-indigo-400 dark:text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
} 