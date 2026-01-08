/**
 * Utils Tests
 * Unit tests for utility functions
 */

import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base-class', true && 'conditional-class')).toBe(
      'base-class conditional-class',
    );
    expect(cn('base-class', false && 'conditional-class')).toBe('base-class');
  });

  it('should resolve Tailwind conflicts with last value winning', () => {
    expect(cn('px-4 px-8')).toBe('px-8');
    expect(cn('text-sm text-lg')).toBe('text-lg');
  });

  it('should handle arrays of classes', () => {
    expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2');
  });

  it('should handle objects with boolean values', () => {
    expect(
      cn({
        'px-4': true,
        'py-2': false,
        'text-sm': true,
      }),
    ).toBe('px-4 text-sm');
  });

  it('should handle undefined and null values', () => {
    expect(cn('px-4', undefined, null, 'py-2')).toBe('px-4 py-2');
  });

  it('should handle complex shadcn/ui use cases', () => {
    const baseStyles = 'rounded-lg border';
    const variant = 'primary';
    const variants = {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white',
    };

    expect(cn(baseStyles, variants[variant])).toBe(
      'rounded-lg border bg-blue-500 text-white',
    );
  });

  it('should deduplicate identical classes', () => {
    expect(cn('px-4', 'px-4', 'py-2')).toBe('px-4 py-2');
  });
});
