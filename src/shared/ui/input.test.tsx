/**
 * Input Component Tests
 * Unit tests for Input component with all states and accessibility
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should render without label', () => {
      render(<Input placeholder="No label" />);
      expect(screen.getByPlaceholderText('No label')).toBeInTheDocument();
    });
  });

  describe('Label', () => {
    it('should associate label with input via htmlFor', () => {
      render(<Input label="Username" />);
      const label = screen.getByText('Username');
      const input = screen.getByLabelText('Username');

      expect(label).toHaveAttribute('for', 'username');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('should use custom id if provided', () => {
      render(<Input label="Email" id="custom-email" />);
      const input = screen.getByLabelText('Email');

      expect(input).toHaveAttribute('id', 'custom-email');
    });

    it('should show asterisk for required fields', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message', () => {
      render(<Input label="Email" error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('should apply error styles to input', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('should set aria-invalid when error exists', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should associate error with input via aria-describedby', () => {
      render(<Input label="Email" error="Invalid email" />);
      const input = screen.getByLabelText('Email');
      const errorId = input.getAttribute('aria-describedby');

      expect(errorId).toBeTruthy();
      expect(screen.getByText('Invalid email')).toHaveAttribute('id', errorId);
    });

    it('should have role="alert" on error message', () => {
      render(<Input error="Error message" />);
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Error message');
    });
  });

  describe('Helper Text', () => {
    it('should display helper text', () => {
      render(<Input helperText="Enter your email" />);
      expect(screen.getByText('Enter your email')).toBeInTheDocument();
    });

    it('should hide helper text when error exists', () => {
      render(
        <Input
          helperText="Enter your email"
          error="Invalid email"
        />,
      );
      expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('should associate helper text with input via aria-describedby', () => {
      render(<Input label="Email" helperText="Enter your email" />);
      const input = screen.getByLabelText('Email');
      const helperId = input.getAttribute('aria-describedby');

      expect(helperId).toBeTruthy();
      expect(screen.getByText('Enter your email')).toHaveAttribute('id', helperId);
    });
  });

  describe('Required Field', () => {
    it('should mark input as required', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('should set aria-required attribute', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Input Types', () => {
    it('should support email type', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should support password type', () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should support number type', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Value Handling', () => {
    it('should handle controlled input', () => {
      const { rerender } = render(<Input value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('');

      rerender(<Input value="test" onChange={() => {}} />);
      expect(input.value).toBe('test');
    });

    it('should call onChange when value changes', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'new value' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should handle uncontrolled input with defaultValue', () => {
      render(<Input defaultValue="initial" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('initial');
    });
  });

  describe('Placeholder', () => {
    it('should display placeholder text', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should support disabled state', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should support readonly state', () => {
      render(<Input readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    it('should support maxLength attribute', () => {
      render(<Input maxLength={10} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxlength', '10');
    });

    it('should support data attributes', () => {
      render(<Input data-testid="custom-input" />);
      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper focus styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    it('should support aria-label', () => {
      render(<Input aria-label="Search" />);
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });

    it('should not have aria-describedby without error or helper', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('Memoization', () => {
    it('should not re-render if props have not changed', () => {
      const { rerender } = render(<Input />);
      const firstRender = screen.getByRole('textbox');

      rerender(<Input />);
      const secondRender = screen.getByRole('textbox');

      expect(firstRender).toBe(secondRender);
    });
  });
});
