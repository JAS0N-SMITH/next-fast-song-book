'use client';

import React from 'react';
import CustomDropdown from './CustomDropdown';

interface TimeSignatureSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TIME_SIGNATURES = [
  '4/4', '3/4', '6/8', '2/4', '3/8', '9/8', '12/8'
];

export default function TimeSignatureSelector({ value, onChange }: TimeSignatureSelectorProps) {
  return (
    <CustomDropdown
      value={value}
      onChange={onChange}
      options={TIME_SIGNATURES}
      placeholder="Select time signature"
      label="Time Signature"
      width="half"
    />
  );
} 