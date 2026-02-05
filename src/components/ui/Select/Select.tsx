import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import './Select.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`select-wrapper ${error ? 'has-error' : ''} ${className}`}>
        {label && <label htmlFor={selectId} className="select-label">{label}</label>}
        <div className="select-container">
          <select
            ref={ref}
            id={selectId}
            className="select-field"
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <span className="select-error">{error}</span>}
        {hint && !error && <span className="select-hint">{hint}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
