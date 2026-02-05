import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`input-wrapper ${error ? 'has-error' : ''} ${className}`}>
        {label && <label htmlFor={inputId} className="input-label">{label}</label>}
        <div className="input-container">
          {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`input-field ${leftIcon ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''}`}
            {...props}
          />
          {rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}
        </div>
        {error && <span className="input-error">{error}</span>}
        {hint && !error && <span className="input-hint">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
