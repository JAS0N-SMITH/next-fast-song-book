import React, { useState, useEffect } from 'react';

interface SongStructureProps {
  value?: string[];
  onChange: (structure: string[]) => void;
}

const commonSections = ['Verse', 'Chorus', 'Bridge', 'Intro', 'Outro', 'Pre-Chorus', 'Solo'];

export default function SongStructure({ value = [], onChange }: SongStructureProps) {
  const [localStructure, setLocalStructure] = useState<string[]>(value);

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(localStructure)) {
      setLocalStructure(value);
    }
  }, [value]);

  const addSection = () => {
    const newStructure = [...localStructure, ''];
    setLocalStructure(newStructure);
    onChange(newStructure);
  };

  const updateSection = (index: number, section: string) => {
    const newStructure = [...localStructure];
    newStructure[index] = section;
    setLocalStructure(newStructure);
    onChange(newStructure);
  };

  const removeSection = (index: number) => {
    const newStructure = localStructure.filter((_, i) => i !== index);
    setLocalStructure(newStructure);
    onChange(newStructure);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {localStructure.map((section, index) => (
          <div key={index} className="flex items-center gap-1">
            <select
              value={section}
              onChange={(e) => updateSection(index, e.target.value)}
              className="rounded-md border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select section</option>
              {commonSections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={() => removeSection(index)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addSection}
        className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        + Add Section
      </button>
    </div>
  );
} 