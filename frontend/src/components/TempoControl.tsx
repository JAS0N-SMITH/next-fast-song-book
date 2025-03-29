import React, { useRef, useState } from 'react';

interface TempoControlProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export default function TempoControl({ value, onChange, label = 'Tempo' }: TempoControlProps) {
  const sliderRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= 40 && newValue <= 208) {
      onChange(newValue);
    }
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newValue = Math.round(40 + (208 - 40) * percentage);
    
    if (newValue >= 40 && newValue <= 208) {
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleIncrement = () => {
    if (value < 208) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 40) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-900 dark:text-dark-text">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= 40}
          className="p-2 rounded-md border border-indigo-200 dark:border-dark-border hover:bg-indigo-50 dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Decrease tempo"
        >
          <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex-1">
          <div className="relative">
            <input
              ref={sliderRef}
              type="range"
              min="40"
              max="208"
              value={value}
              onChange={handleChange}
              className="w-full h-2 bg-indigo-100 dark:bg-dark-border rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:h-0"
            />
            <div 
              className={`absolute top-1/2 w-6 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-sm cursor-pointer transition-all duration-200 ${
                isDragging 
                  ? 'scale-150 shadow-lg shadow-indigo-500/50 dark:shadow-indigo-400/30 ring-2 ring-indigo-300 dark:ring-indigo-500' 
                  : 'hover:scale-125 hover:shadow-md hover:shadow-indigo-500/30 dark:hover:shadow-indigo-400/20 hover:ring-2 hover:ring-indigo-300 dark:hover:ring-indigo-500'
              }`}
              style={{ 
                left: `calc(${((value - 40) / (208 - 40)) * 100}% - 12px)`,
                transform: 'translateY(-50%)'
              }}
              onMouseDown={handleThumbMouseDown}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>40</span>
            <span>120</span>
            <span>208</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= 208}
          className="p-2 rounded-md border border-indigo-200 dark:border-dark-border hover:bg-indigo-50 dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Increase tempo"
        >
          <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="w-24 text-center">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
              {value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              BPM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 