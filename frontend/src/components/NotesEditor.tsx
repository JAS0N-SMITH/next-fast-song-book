import React from 'react';

interface NotesEditorProps {
  value?: string;
  onChange: (notes: string) => void;
}

export default function NotesEditor({ value = '', onChange }: NotesEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={5}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      placeholder="Enter your notes here..."
    />
  );
} 