/**
 * Input Component
 * Reusable input field with error states
 * Memoized for performance optimization
 */

import { InputHTMLAttributes, forwardRef, memo } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, className = '', id, required, ...props },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const baseStyles =
      'block w-full rounded-lg border bg-background px-4 py-2.5 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';

    const stateStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-zinc-300 focus:border-foreground focus:ring-foreground dark:border-zinc-700';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={`${baseStyles} ${stateStyles} ${className}`}
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

InputComponent.displayName = 'Input';

// Memoize to prevent unnecessary re-renders
export const Input = memo(InputComponent);
