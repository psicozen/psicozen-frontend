/**
 * Spinner Component Tests
 * Unit tests for Spinner loading component
 */

import { render, screen } from '@testing-library/react';
import { Spinner } from './spinner';

describe('Spinner Component', () => {
  describe('Rendering', () => {
    it('should render spinner element', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('should render as SVG element', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should apply medium size by default', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-8', 'w-8');
    });

    it('should apply small size', () => {
      const { container } = render(<Spinner size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-4', 'w-4');
    });

    it('should apply large size', () => {
      const { container } = render(<Spinner size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-12', 'w-12');
    });
  });

  describe('Animation', () => {
    it('should have spin animation class', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('animate-spin');
    });
  });

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      const { container } = render(<Spinner className="custom-spinner" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-spinner');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(<Spinner className="text-red-500" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('animate-spin', 'text-red-500');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('should have aria-label="Loading"', () => {
      render(<Spinner />);
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toBeInTheDocument();
    });

    it('should be accessible for screen readers', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'status');
      expect(svg).toHaveAttribute('aria-label', 'Loading');
    });
  });

  describe('SVG Structure', () => {
    it('should have correct viewBox', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should have fill="none"', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('should have circle element', () => {
      const { container } = render(<Spinner />);
      const circle = container.querySelector('circle');
      expect(circle).toBeInTheDocument();
      expect(circle).toHaveAttribute('cx', '12');
      expect(circle).toHaveAttribute('cy', '12');
      expect(circle).toHaveAttribute('r', '10');
    });

    it('should have path element', () => {
      const { container } = render(<Spinner />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
    });

    it('should have opacity classes for visual effect', () => {
      const { container } = render(<Spinner />);
      const circle = container.querySelector('circle');
      const path = container.querySelector('path');

      expect(circle).toHaveClass('opacity-25');
      expect(path).toHaveClass('opacity-75');
    });
  });

  describe('Memoization', () => {
    it('should not re-render if props have not changed', () => {
      const { container, rerender } = render(<Spinner />);
      const firstRender = container.querySelector('svg');

      rerender(<Spinner />);
      const secondRender = container.querySelector('svg');

      expect(firstRender).toBe(secondRender);
    });

    it('should re-render when size prop changes', () => {
      const { container, rerender } = render(<Spinner size="sm" />);
      let svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-4', 'w-4');

      rerender(<Spinner size="lg" />);
      svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-12', 'w-12');
    });
  });

  describe('Use Cases', () => {
    it('should work as loading indicator in buttons', () => {
      const { container } = render(
        <button>
          <Spinner size="sm" className="mr-2" />
          Loading...
        </button>,
      );

      const spinner = container.querySelector('svg');
      expect(spinner).toHaveClass('h-4', 'w-4', 'mr-2');
    });

    it('should work as page loader', () => {
      const { container } = render(
        <div className="flex items-center justify-center">
          <Spinner size="lg" />
        </div>,
      );

      const spinner = container.querySelector('svg');
      expect(spinner).toHaveClass('h-12', 'w-12');
    });
  });
});
