# CLAUDE.md

> **🤖 AI SYSTEM INSTRUCTION**: 
> **ALWAYS** read this file (`CLAUDE.md`) at the start of every chat session. It contains the mandatory project context, architectural guidelines, testing rules, and coding standards that must be followed strictly.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PsicoZen Frontend - A production-ready Next.js 16.1.1 application implementing Clean Architecture principles with SOLID design patterns. Features include passwordless authentication (Magic Link), comprehensive state management, type-safe HTTP client, and modular feature organization.

## Development Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3001)
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint

# Testing
npm run test            # Run Jest tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

## **CRITICAL: Testing Requirements**

**MANDATORY RULE**: Every feature or functionality added to this codebase MUST include its corresponding unit test. No exceptions.

- ❌ **NEVER** add a feature without unit tests
- ✅ **ALWAYS** create unit tests alongside new functionality (`.test.ts` or `.test.tsx`)
- 🔴 **BLOCKING**: Features without tests will not be accepted
- 📊 **Coverage**: Maintain minimum 70% coverage (branches, functions, lines, statements)

This is a non-negotiable requirement for code quality and maintainability.

## Technology Stack

### Core Framework
- **Next.js**: 16.1.1 (App Router, React Server Components)
- **React**: 19.2.3
- **TypeScript**: 5.x (strict mode)
- **Node.js**: ≥20.0.0

### State Management & Data Fetching
- **Zustand**: 5.x - Lightweight state management with persistence
- **Axios**: 1.13.x - HTTP client with interceptors and retry logic
- **React Hook Form**: 7.x - Form state management with minimal re-renders
- **Zod**: 4.x - Runtime type validation

### UI & Styling
- **Tailwind CSS**: v4 - Utility-first CSS with inline theme
- **Sonner**: 2.x - Toast notifications
- **Geist Fonts**: Next.js font optimization

### Testing
- **Jest**: 30.x - Unit testing framework
- **React Testing Library**: 16.x - Component testing utilities
- **Axios Mock Adapter**: 2.x - HTTP mocking for tests

## Architecture Overview

This project follows **Clean Architecture** adapted for frontend development with **Feature-Based Organization** for optimal scalability and maintainability.

### Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│   (React Components, Pages, UI)         │
├─────────────────────────────────────────┤
│         Application Layer               │
│   (Hooks, State Management, DTOs)       │
├─────────────────────────────────────────┤
│          Domain Layer                   │
│   (Types, Business Logic, Interfaces)   │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│   (HTTP Client, External Services)      │
└─────────────────────────────────────────┘
```

### Folder Structure

```
frontend/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Homepage
│   ├── login/                        # Public routes
│   └── dashboard/                    # Protected routes
│
├── src/
│   ├── features/                     # Feature modules (vertical slices)
│   │   └── auth/                     # Authentication feature
│   │       ├── components/           # Feature-specific components
│   │       │   └── magic-link-form.tsx
│   │       ├── hooks/                # Feature-specific hooks
│   │       │   ├── use-auth.ts
│   │       │   └── use-auth.test.tsx
│   │       └── services/             # API communication layer
│   │           ├── auth.service.ts
│   │           └── auth.service.test.ts
│   │
│   ├── shared/                       # Shared across features
│   │   ├── components/               # Shared providers
│   │   │   └── toast-provider.tsx
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── spinner.tsx
│   │   ├── hooks/                    # Shared custom hooks
│   │   └── lib/                      # Shared utilities
│   │
│   ├── stores/                       # Zustand global stores
│   │   ├── auth.store.ts
│   │   └── auth.store.test.ts
│   │
│   ├── lib/                          # Core infrastructure
│   │   ├── http/                     # HTTP client layer
│   │   │   ├── client.ts             # Axios instance with interceptors
│   │   │   └── client.test.ts
│   │   ├── errors/                   # Error handling
│   │   │   └── api-error.ts          # Custom error classes
│   │   └── config/                   # Configuration
│   │       └── env.ts                # Environment variables
│   │
│   └── types/                        # Global TypeScript types
│       ├── api.types.ts              # API response types
│       └── auth.types.ts             # Authentication types
│
├── middleware.ts                     # Next.js middleware (route protection)
├── jest.config.ts                    # Jest configuration
├── jest.setup.ts                     # Jest setup file
├── tsconfig.json                     # TypeScript configuration
└── .env.local.example                # Environment variables template
```

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)
- **Components**: Only handle UI rendering
- **Hooks**: Encapsulate business logic and state
- **Services**: Handle API communication
- **Stores**: Manage global state

Example:
```typescript
// ❌ BAD: Component with mixed concerns
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);

  return <div>{user?.name}</div>;
}

// ✅ GOOD: Separated concerns
function UserProfile() {
  const { user } = useUser(); // Hook handles data fetching
  return <div>{user?.name}</div>; // Component only renders
}
```

### Open/Closed Principle (OCP)
- **Components**: Extend via props, not modification
- **Services**: New features via new methods, not changing existing

Example:
```typescript
// ✅ Component open for extension via props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  // Implementation
}
```

### Liskov Substitution Principle (LSP)
- All components accept base HTML props
- Derived components honor parent contracts

### Interface Segregation Principle (ISP)
- Small, focused interfaces
- Components receive only needed props

### Dependency Inversion Principle (DIP)
- Depend on abstractions (hooks, services) not implementations
- Inject dependencies via props/context

## Core Infrastructure

### HTTP Client (`src/lib/http/client.ts`)

**Features**:
- Axios-based with retry logic (exponential backoff)
- Automatic auth token injection
- Request/response interceptors
- Type-safe API response handling
- Error transformation to custom classes

**Usage**:
```typescript
import { httpClient } from '@/lib/http/client';

// GET request
const response = await httpClient.get<User[]>('/users');
if (response.success) {
  console.log(response.data); // Type-safe User[]
}

// POST with data
const result = await httpClient.post<User>('/users', { name: 'John' });
```

**Backend Integration**:
- Matches backend `ApiResponseDto<T>` structure
- Automatically handles pagination metadata
- Retry on 5xx errors and network failures

### Error Handling (`src/lib/errors/api-error.ts`)

**Error Classes**:
- `ApiError` - API response errors (4xx, 5xx)
- `NetworkError` - Network connectivity issues
- `TimeoutError` - Request timeouts

**Error Methods**:
```typescript
try {
  await httpClient.post('/endpoint');
} catch (error) {
  if (error instanceof ApiError) {
    error.isClientError();      // 400-499
    error.isServerError();       // 500-599
    error.isAuthError();         // 401, 403
    error.isValidationError();   // 400 with errors object
  }
}
```

### State Management (Zustand)

**Auth Store** (`src/stores/auth.store.ts`):
```typescript
import { useAuthStore } from '@/stores/auth.store';

function Component() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  // Selectors for performance
  const user = useAuthStore(selectUser);
}
```

**Features**:
- LocalStorage persistence (auto-hydration)
- Optimized selectors
- Full TypeScript support

### Environment Configuration (`src/lib/config/env.ts`)

```typescript
import { env } from '@/lib/config/env';

const apiUrl = env.api.url;           // http://localhost:3000
const appName = env.app.name;         // PsicoZen
const isDev = env.isDevelopment;      // true/false
```

## Authentication Flow

### Magic Link Authentication

1. **User enters email** → `MagicLinkForm` component
2. **Frontend calls** → `authService.sendMagicLink({ email })`
3. **Backend sends** → Magic link email via Supabase Auth
4. **User clicks link** → Redirects to verify callback
5. **Frontend verifies** → `authService.verifyMagicLink({ token, email })`
6. **Backend returns** → User + JWT tokens
7. **Frontend stores** → Zustand store + localStorage
8. **HTTP client configured** → Auto-inject token in requests

### Protected Routes

**Middleware** (`middleware.ts`):
- Public routes: `/login`, `/register`
- Protected routes: `/dashboard/*`, `/profile/*`, `/settings/*`
- Automatic redirects based on auth state

**Implementation**:
```typescript
// Protected page component
'use client';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <Spinner />;

  return <div>Welcome {user?.email}</div>;
}
```

## Adding New Features

### Feature Module Pattern

Each feature follows this structure:

```
features/
└── [feature-name]/
    ├── components/           # Feature UI components
    │   ├── component.tsx
    │   └── component.test.tsx
    ├── hooks/                # Feature-specific hooks
    │   ├── use-feature.ts
    │   └── use-feature.test.tsx
    ├── services/             # API layer
    │   ├── feature.service.ts
    │   └── feature.service.test.ts
    ├── types/                # Feature-specific types
    │   └── feature.types.ts
    └── utils/                # Feature utilities
        └── helpers.ts
```

### Step-by-Step Guide

1. **Create feature directory**: `src/features/your-feature/`
2. **Define types**: `types/your-feature.types.ts`
3. **Create service**: `services/your-feature.service.ts` + tests
4. **Build hook**: `hooks/use-your-feature.ts` + tests
5. **Create components**: `components/` + tests
6. **Add route**: `app/your-feature/page.tsx`

### Example: Adding a "Notes" Feature

```typescript
// 1. Types
// src/features/notes/types/note.types.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

// 2. Service
// src/features/notes/services/notes.service.ts
import { httpClient } from '@/lib/http/client';

export class NotesService {
  async getNotes(): Promise<Note[]> {
    const response = await httpClient.get<Note[]>('/notes');
    return response.success ? response.data : [];
  }
}

export const notesService = new NotesService();

// 3. Hook
// src/features/notes/hooks/use-notes.ts
import { useState, useEffect } from 'react';
import { notesService } from '../services/notes.service';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchNotes() {
      setIsLoading(true);
      try {
        const data = await notesService.getNotes();
        setNotes(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotes();
  }, []);

  return { notes, isLoading };
}

// 4. Component
// src/features/notes/components/notes-list.tsx
import { useNotes } from '../hooks/use-notes';

export function NotesList() {
  const { notes, isLoading } = useNotes();

  if (isLoading) return <Spinner />;

  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>
  );
}

// 5. Page
// app/notes/page.tsx
import { NotesList } from '@/features/notes/components/notes-list';

export default function NotesPage() {
  return <NotesList />;
}
```

## Form Validation Pattern

Use React Hook Form + Zod for type-safe forms:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // data is type-safe and validated
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Button type="submit" isLoading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
```

## Testing Best Practices

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './use-auth';

describe('useAuth', () => {
  it('should login user', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: '123' });
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### Service Testing (with Mock Adapter)
```typescript
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { authService } from './auth.service';

describe('AuthService', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should send magic link', async () => {
    mock.onPost('/auth/magic-link/send').reply(200, {
      success: true,
      data: { message: 'Sent', email: 'test@example.com' },
    });

    const result = await authService.sendMagicLink({ email: 'test@example.com' });
    expect(result.email).toBe('test@example.com');
  });
});
```

## Code Style & Conventions

### File Naming
- **Components**: `PascalCase` (e.g., `MagicLinkForm.tsx`)
- **Utilities**: `kebab-case` (e.g., `api-error.ts`)
- **Hooks**: `use-` prefix (e.g., `use-auth.ts`)
- **Tests**: Same name + `.test.ts(x)` (e.g., `use-auth.test.tsx`)

### Import Order
```typescript
// 1. External libraries
import { useState } from 'react';
import { z } from 'zod';

// 2. Internal absolute imports
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/features/auth/hooks/use-auth';

// 3. Relative imports
import { validateInput } from './utils';

// 4. Types
import type { User } from '@/types/auth.types';
```

### Component Structure
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component definition
// 4. Export
```

## Performance Optimization

- **Code Splitting**: Use dynamic imports for heavy components
- **Image Optimization**: Use Next.js `<Image>` component
- **Font Optimization**: Pre-configured with next/font
- **State Optimization**: Zustand selectors prevent unnecessary re-renders
- **Memoization**: React 19 compiler handles automatically (no manual useMemo needed)

## Environment Variables

Required variables (add to `.env.local`):

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Application
NEXT_PUBLIC_APP_NAME=PsicoZen
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Troubleshooting

### Common Issues

**1. Module not found errors**
- Verify `tsconfig.json` paths configuration
- Restart dev server after adding new files

**2. Zustand state not persisting**
- Check localStorage in browser
- Verify store name in persist config

**3. Tests failing with module errors**
- Check `jest.config.ts` moduleNameMapper
- Verify mocks in `jest.setup.ts`

**4. Type errors with API responses**
- Ensure backend response matches `ApiResponseDto<T>` structure
- Check type definitions in `src/types/`

## Next Steps

Ready-to-implement features:
- [ ] Email/password registration
- [ ] Password reset flow
- [ ] User profile management
- [ ] Role-based access control (RBAC)
- [ ] Multi-language support (i18n)
- [ ] Analytics integration
- [ ] Error boundary implementation
- [ ] Offline support (PWA)
