import React from 'react';
import { ThinkingOrb, OrbState, OrbSize } from 'thinking-orbs';
import './common.css';

export interface LoaderProps {
  size?: number | 'sm' | 'md' | 'lg' | OrbSize;
  message?: string;
  text?: string;
  state?: OrbState;
  speed?: number;
  dark?: boolean;
  paused?: boolean;
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  message,
  text,
  state = 'searching',
  speed = 1,
  dark,
  paused = false,
  color = '#15803D',
}) => {
  let orbSize: OrbSize = 32;
  if (typeof size === 'number') {
    orbSize = size <= 24 ? 20 : size <= 48 ? 32 : 64;
  } else if (size === 'sm') {
    orbSize = 20;
  } else if (size === 'md') {
    orbSize = 32;
  } else if (size === 'lg') {
    orbSize = 64;
  }

  const displayText = text || message;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: 12 }}>
      <ThinkingOrb
        state={state}
        size={orbSize}
        speed={speed}
        theme={dark ? 'dark' : 'light'}
        paused={paused}
        color={color}
      />
      {displayText && (
        <span className="text-subtle" style={{ fontSize: 13, fontWeight: 500, color: '#4B5563' }}>
          {displayText}
        </span>
      )}
    </div>
  );
};

