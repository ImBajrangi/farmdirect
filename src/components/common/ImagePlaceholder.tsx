import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export interface ImagePlaceholderProps {
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9' | '3:2' | 'auto';
  height?: string | number;
  width?: string | number;
  label?: string;
  sublabel?: string;
  iconSize?: number;
  borderRadius?: string;
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  aspectRatio = '16:9',
  height,
  width = '100%',
  label,
  sublabel,
  iconSize = 24,
  borderRadius = '16px',
  src,
  alt = '',
  className = '',
  style = {},
}) => {
  const getAspectRatioPadding = () => {
    switch (aspectRatio) {
      case '16:9':
        return '56.25%';
      case '4:3':
        return '75%';
      case '1:1':
        return '100%';
      case '21:9':
        return '42.85%';
      case '3:2':
        return '66.66%';
      default:
        return undefined;
    }
  };

  const isAspectMode = aspectRatio !== 'auto' && !height;

  if (src) {
    return (
      <div
        className={`fd-image-container ${className}`}
        style={{
          position: 'relative',
          width,
          height: height || (isAspectMode ? undefined : '100%'),
          paddingTop: isAspectMode ? getAspectRatioPadding() : undefined,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
          border: '1px solid rgba(15, 46, 34, 0.08)',
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <img
          src={src}
          alt={alt || label || 'Image'}
          loading="lazy"
          style={{
            position: isAspectMode ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`fd-image-placeholder ${className}`}
      style={{
        position: 'relative',
        width,
        height: height || (isAspectMode ? undefined : '100%'),
        paddingTop: isAspectMode ? getAspectRatioPadding() : undefined,
        backgroundColor: '#f8fafc',
        border: '1px solid rgba(15, 46, 34, 0.08)',
        borderRadius,
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
      role="img"
      aria-label={label || 'Visual preview area'}
    >
      <div
        style={{
          position: isAspectMode ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          textAlign: 'center',
          color: '#64748b',
          gap: '6px',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            width: iconSize + 14,
            height: iconSize + 14,
            borderRadius: '10px',
            backgroundColor: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            flexShrink: 0,
          }}
        >
          <ImageIcon size={iconSize} />
        </div>
        {label && (
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 550,
              color: '#334155',
              marginTop: '4px',
              letterSpacing: '0.01em',
            }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
            }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
