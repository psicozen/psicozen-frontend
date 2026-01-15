/**
 * MagicLinkForm Component Tests
 * Unit tests for Magic Link authentication form
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { MagicLinkForm } from './magic-link-form';
import { useAuth } from '../hooks/use-auth';
import { ApiError } from '@/lib/errors/api-error';

// Mock dependencies
jest.mock('sonner');
jest.mock('../hooks/use-auth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('MagicLinkForm Component', () => {
  const mockSendMagicLink = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      sendMagicLink: mockSendMagicLink,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      verifyMagicLink: jest.fn(),
      tokens: null,
      refreshProfile: jest.fn(),
      updateProfile: jest.fn(),
    });

    mockToast.success = jest.fn();
    mockToast.error = jest.fn();
  });

  describe('Initial Render', () => {
    it('should render the form', () => {
      render(<MagicLinkForm />);
      expect(screen.getByText('Sign in with Magic Link')).toBeInTheDocument();
    });

    it('should render email input field', () => {
      render(<MagicLinkForm />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<MagicLinkForm />);
      expect(screen.getByRole('button', { name: /send magic link/i })).toBeInTheDocument();
    });

    it('should have email input with correct attributes', () => {
      render(<MagicLinkForm />);
      const emailInput = screen.getByLabelText(/email/i);

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'you@example.com');
      expect(emailInput).toBeRequired();
    });

    it('should render helper text', () => {
      render(<MagicLinkForm />);
      expect(
        screen.getByText("We'll send you a secure link to sign in without a password"),
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send magic link/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      });

      expect(mockSendMagicLink).not.toHaveBeenCalled();
    });

    it('should not submit empty email', async () => {
      const user = userEvent.setup();
      render(<MagicLinkForm />);

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSendMagicLink).not.toHaveBeenCalled();
      });
    });

    it('should accept valid email format', async () => {
      const user = userEvent.setup();
      mockSendMagicLink.mockResolvedValue(undefined);

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send magic link/i });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSendMagicLink).toHaveBeenCalledWith({ email: 'test@example.com' });
      });
    });
  });

  describe('Form Submission', () => {
    it('should call sendMagicLink with email on submit', async () => {
      const user = userEvent.setup();
      mockSendMagicLink.mockResolvedValue(undefined);

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'user@example.com');

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSendMagicLink).toHaveBeenCalledWith({ email: 'user@example.com' });
      });
    });

    it('should show loading state while submitting', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      mockSendMagicLink.mockReturnValue(
        new Promise((resolve) => {
          resolveSubmit = resolve as () => void;
        }),
      );

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      resolveSubmit!();
    });

    it('should disable button while submitting', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      mockSendMagicLink.mockReturnValue(
        new Promise((resolve) => {
          resolveSubmit = resolve as () => void;
        }),
      );

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      resolveSubmit!();
    });
  });

  describe('Success State', () => {
    it('should show success message after successful submission', async () => {
      const user = userEvent.setup();
      mockSendMagicLink.mockResolvedValue(undefined);

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Magic link sent!', {
          description: 'Check your email for the login link',
        });
      });
    });

    it('should show email sent confirmation screen', async () => {
      const user = userEvent.setup();
      mockSendMagicLink.mockResolvedValue(undefined);

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Check your email')).toBeInTheDocument();
        expect(
          screen.getByText(/We've sent you a magic link to sign in/i),
        ).toBeInTheDocument();
      });
    });

    it('should show "Send another link" button after success', async () => {
      const user = userEvent.setup();
      mockSendMagicLink.mockResolvedValue(undefined);

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /send another link/i })).toBeInTheDocument();
      });
    });

    it('should return to form when clicking "Send another link"', async () => {
      const user = userEvent.setup();
      mockSendMagicLink.mockResolvedValue(undefined);

      render(<MagicLinkForm />);

      // Submit form
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      // Wait for success screen
      await waitFor(() => {
        expect(screen.getByText('Check your email')).toBeInTheDocument();
      });

      // Click "Send another link"
      const anotherLinkButton = screen.getByRole('button', { name: /send another link/i });
      await user.click(anotherLinkButton);

      // Should return to form
      await waitFor(() => {
        expect(screen.getByText('Sign in with Magic Link')).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error toast for ApiError', async () => {
      const user = userEvent.setup();
      const apiError = new ApiError('Invalid email', 400);
      mockSendMagicLink.mockRejectedValue(apiError);

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to send magic link', {
          description: 'Invalid email',
        });
      });
    });

    it('should show generic error toast for unknown errors', async () => {
      const user = userEvent.setup();
      mockSendMagicLink.mockRejectedValue(new Error('Unknown error'));

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Something went wrong', {
          description: 'Please try again later',
        });
      });
    });

    it('should not show success screen on error', async () => {
      const user = userEvent.setup();
      mockSendMagicLink.mockRejectedValue(new Error('Network error'));

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalled();
      });

      expect(screen.queryByText('Check your email')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<MagicLinkForm />);
      const form = screen.getByRole('button', { name: /send magic link/i }).closest('form');
      expect(form).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      mockSendMagicLink.mockResolvedValue(undefined);

      render(<MagicLinkForm />);

      const emailInput = screen.getByLabelText(/email/i);

      // Tab to input and type
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.keyboard('test@example.com');

      // Tab to button and press Enter
      await user.tab();
      const submitButton = screen.getByRole('button', { name: /send magic link/i });
      expect(submitButton).toHaveFocus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockSendMagicLink).toHaveBeenCalledWith({ email: 'test@example.com' });
      });
    });
  });
});
