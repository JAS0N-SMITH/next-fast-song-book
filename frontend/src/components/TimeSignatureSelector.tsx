import React from 'react';
import CustomDropdown from './CustomDropdown';

interface TimeSignatureSelectorProps {
  value?: string;
  onChange: (timeSignature: string) => void;
}

const timeSignatures = ['4/4', '3/4', '6/8', '2/4', '3/8'];

export default function TimeSignatureSelector({ value = '4/4', onChange }: TimeSignatureSelectorProps) {
  return (
    <CustomDropdown
      value={value}
      onChange={onChange}
      options={timeSignatures}
      placeholder="Select a time signature"
      label="Time Signature"
      width="half"
    />
  );
} 