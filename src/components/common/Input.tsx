import React from 'react';
import './common.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`input-field ${error ? 'input-field-error' : ''} ${className}`.trim()}
          {...props}
        />
        {error && <span className="form-error">{error}</span>}
        {helperText && !error && <span className="text-caption">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
