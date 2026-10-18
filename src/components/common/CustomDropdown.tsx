import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './common.css';

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  labelPrefix?: string;
  placeholder?: string;
  align?: 'left' | 'right';
  className?: string;
  ariaLabel?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  onChange,
  icon,
  labelPrefix,
  placeholder = 'Select option',
  align = 'left',
  className = '',
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`custom-dropdown-container ${className} ${isOpen ? 'is-open' : ''}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`custom-dropdown-trigger ${value !== 'all' && value !== 'newest' ? 'has-active-value' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || selectedOption?.label || placeholder}
      >
        {icon && <span className="custom-dropdown-trigger-icon">{icon}</span>}
        <span className="custom-dropdown-trigger-text">
          {labelPrefix && <span className="custom-dropdown-prefix">{labelPrefix} </span>}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={13}
          className={`custom-dropdown-chevron ${isOpen ? 'rotated' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className={`custom-dropdown-menu align-${align}`}
          role="listbox"
          aria-label={ariaLabel || placeholder}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`custom-dropdown-item ${isSelected ? 'is-selected' : ''}`}
              >
                <div className="dropdown-item-left">
                  {opt.icon && <span className="dropdown-item-icon">{opt.icon}</span>}
                  <div className="dropdown-item-text">
                    <span className="dropdown-item-label">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="dropdown-item-sublabel">{opt.sublabel}</span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <Check size={14} className="dropdown-check-icon" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
