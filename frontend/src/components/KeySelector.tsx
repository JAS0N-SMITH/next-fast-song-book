import React from 'react';
import CustomDropdown from './CustomDropdown';

interface KeySelectorProps {
  value?: string;
  onChange: (key: string) => void;
}

const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function KeySelector({ value = 'C', onChange }: KeySelectorProps) {
  return (
    <CustomDropdown
      value={value}
      onChange={onChange}
      options={keys}
      placeholder="Select a key"
      label="Key"
      width="half"
    />
  );
} 