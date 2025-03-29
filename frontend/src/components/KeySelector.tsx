'use client';

import React from 'react';
import CustomDropdown from './CustomDropdown';

interface KeySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export default function KeySelector({ value, onChange }: KeySelectorProps) {
  return (
    <CustomDropdown
      value={value}
      onChange={onChange}
      options={KEYS}
      placeholder="Select key"
      label="Key"
      width="half"
    />
  );
} 