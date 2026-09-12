import React from 'react';

interface ThreadKnotProps {
  color?: 'brown' | 'burgundy' | 'sage' | 'blush';
  label?: string;
  className?: string;
}

export const ThreadKnot: React.FC<ThreadKnotProps> = ({
  color = 'brown',
  label,
  className = '',
}) => {
  const colorMap = {
    brown: 'text-brown-700 bg-cream-100 border-brown-500',
    burgundy: 'text-burgundy-500 bg-blush-50 border-burgundy-500',
    sage: 'text-sage-600 bg-cream-50 border-sage-500',
    blush: 'text-brown-700 bg-blush-100 border-blush-300',
  }[color];

  const strokeColor = {
    brown: '#4A382F',
    burgundy: '#610C25',
    sage: '#7A8060',
    blush: '#BE7D7B',
  }[color];

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      {/* Thread line lead-in */}
      <div
        className="w-[1.5px] h-8 transition-colors duration-500"
        style={{ backgroundColor: strokeColor, opacity: 0.5 }}
      />

      {/* Tactile loop knot icon */}
      <div className={`relative flex items-center justify-center px-3 py-1 rounded-full border text-xs font-medium tracking-wider shadow-warm-sm transition-all duration-300 ${colorMap}`}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-1.5 flex-shrink-0"
        >
          <path
            d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeDasharray="3 3"
          />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
        <span>{label}</span>
      </div>

      {/* Thread continuation line */}
      <div
        className="w-[1.5px] h-6 transition-colors duration-500"
        style={{ backgroundColor: strokeColor, opacity: 0.3 }}
      />
    </div>
  );
};
