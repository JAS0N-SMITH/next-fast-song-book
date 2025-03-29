import React, { useState, useEffect } from 'react';

interface ChordProgressionProps {
  value?: string[];
  onChange: (chords: string[]) => void;
  currentKey?: string;
}

const commonChords = ['C', 'G', 'Am', 'Em', 'F', 'Dm', 'E', 'Bm', 'A', 'D'];

export default function ChordProgression({ value = [], onChange, currentKey }: ChordProgressionProps) {
  const [localChords, setLocalChords] = useState<string[]>(value);

  // Only update local state when value prop changes and is different
  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(localChords)) {
      setLocalChords(value);
    }
  }, [value]);

  const addChord = () => {
    const newChords = [...localChords, ''];
    setLocalChords(newChords);
    onChange(newChords);
  };

  const updateChord = (index: number, chord: string) => {
    const newChords = [...localChords];
    newChords[index] = chord;
    setLocalChords(newChords);
    onChange(newChords);
  };

  const removeChord = (index: number) => {
    const newChords = localChords.filter((_, i) => i !== index);
    setLocalChords(newChords);
    onChange(newChords);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {localChords.map((chord, index) => (
          <div key={index} className="flex items-center gap-1">
            <select
              value={chord}
              onChange={(e) => updateChord(index, e.target.value)}
              className="rounded-md border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select chord</option>
              {commonChords.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={() => removeChord(index)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addChord}
        className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        + Add Chord
      </button>
    </div>
  );
} 