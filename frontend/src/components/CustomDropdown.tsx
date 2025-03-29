'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  width?: 'full' | 'half';
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  label,
  width = 'full'
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${width === 'half' ? 'w-1/2' : 'w-full'}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-gray-900 dark:text-dark-text">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="appearance-none block w-full px-4 py-2.5 border border-indigo-200 dark:border-dark-border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text text-sm transition-colors duration-200 relative"
        >
          <div className="flex items-center justify-center">
            <span className={`truncate ${value ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {value || placeholder}
            </span>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg 
              className={`h-4 w-4 text-indigo-400 dark:text-indigo-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-dark-bg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <ul className="max-h-60 overflow-auto py-1 text-base sm:text-sm">
              {options.map((option) => (
                <li
                  key={option}
                  className={`cursor-pointer select-none py-2 pl-3 pr-9 ${
                    value === option
                      ? 'bg-indigo-100 dark:bg-dark-border text-indigo-900 dark:text-indigo-100'
                      : 'text-gray-900 dark:text-dark-text hover:bg-indigo-50 dark:hover:bg-dark-border'
                  }`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 