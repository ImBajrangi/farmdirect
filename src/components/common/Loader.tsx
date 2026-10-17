import React from 'react';
import './common.css';

interface LoaderProps {
  size?: number | 'sm' | 'md' | 'lg';
  message?: string;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', message, text }) => {
  let pixelSize = 32;
  if (typeof size === 'number') {
    pixelSize = size;
  } else if (size === 'sm') {
    pixelSize = 20;
  } else if (size === 'lg') {
    pixelSize = 48;
  }

  const displayText = text || message;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: 12 }}>
      <span className="loader-spinner" style={{ width: pixelSize, height: pixelSize }} />
      {displayText && <span className="text-subtle">{displayText}</span>}
    </div>
  );
};
