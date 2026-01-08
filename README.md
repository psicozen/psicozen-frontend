# PsicoZen Frontend

A production-ready Next.js 16.1.1 boilerplate implementing Clean Architecture principles with SOLID design patterns, featuring passwordless authentication, comprehensive testing infrastructure, and modular feature organization.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: ≥20.0.0
- **npm**: ≥10.0.0
- **Backend API**: Running at `http://localhost:3000` (see `../backend`)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your configuration
nano .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) to see your application.

## 📁 Project Structure

```
frontend/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Homepage
│   ├── login/                        # Authentication pages
│   └── dashboard/                    # Protected application pages
│
├── src/
│   ├── features/                     # Feature modules (Clean Architecture)
│   │   └── auth/                     # Authentication feature
│   │       ├── components/           # Feature UI components
│   │       ├── hooks/                # Feature business logic
│   │       └── services/             # API communication layer
│   │
│   ├── shared/                       # Reusable across features
│   │   ├── components/               # Shared providers
│   │   └── ui/                       # UI component library
│   │
│   ├── stores/                       # Global state (Zustand)
│   ├── lib/                          # Core infrastructure
│   │   ├── http/                     # HTTP client with interceptors
│   │   ├── errors/                   # Error handling
│   │   └── config/                   # Configuration
│   │
│   └── types/                        # Global TypeScript types
│
├── middleware.ts                     # Route protection
├── jest.config.ts                    # Testing configuration
└── CLAUDE.md                         # Detailed architecture documentation
```

## ✨ Key Features

### Architecture & Design
- ✅ **Clean Architecture** - Separation of concerns across layers
- ✅ **SOLID Principles** - Maintainable and extensible codebase
- ✅ **Feature-Based Organization** - Modular and scalable structure
- ✅ **TypeScript** - End-to-end type safety

### Authentication
- ✅ **Magic Link** - Passwordless authentication via email
- ✅ **JWT Tokens** - Secure token-based authentication
- ✅ **Route Protection** - Middleware-based access control
- ✅ **Persistent Sessions** - LocalStorage with Zustand

### State Management
- ✅ **Zustand** - Lightweight global state with persistence
- ✅ **Optimized Selectors** - Prevent unnecessary re-renders
- ✅ **Type-Safe Stores** - Full TypeScript integration

### HTTP Client
- ✅ **Axios-Based** - Robust HTTP client with interceptors
- ✅ **Automatic Retry** - Exponential backoff on failures
- ✅ **Token Injection** - Auto-inject auth tokens in requests
- ✅ **Type-Safe Responses** - Backend ApiResponseDto matching

### Forms & Validation
- ✅ **React Hook Form** - Performant form state management
- ✅ **Zod Validation** - Runtime type validation with schemas
- ✅ **Type Inference** - Automatic TypeScript types from schemas

### Testing
- ✅ **Jest** - Unit testing framework
- ✅ **React Testing Library** - Component testing
- ✅ **Mock Adapters** - HTTP request mocking
- ✅ **70% Coverage** - Enforced coverage thresholds

### UI Components
- ✅ **Tailwind CSS v4** - Modern utility-first styling
- ✅ **Component Library** - Reusable UI components (Button, Input, Spinner)
- ✅ **Toast Notifications** - Sonner integration
- ✅ **Dark Mode** - System preference support

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server (http://localhost:3001)
npm run build           # Production build with optimizations
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Testing
npm run test            # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

### Environment Variables

Create `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Application Configuration
NEXT_PUBLIC_APP_NAME=PsicoZen
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (runs tests on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

```
src/
└── features/
    └── auth/
        ├── services/
        │   ├── auth.service.ts
        │   └── auth.service.test.ts       # Service tests
        ├── hooks/
        │   ├── use-auth.ts
        │   └── use-auth.test.tsx          # Hook tests
        └── components/
            ├── magic-link-form.tsx
            └── magic-link-form.test.tsx   # Component tests
```

### Writing Tests

**Unit Test Example**:
```typescript
import { authService } from './auth.service';

describe('AuthService', () => {
  it('should send magic link', async () => {
    const result = await authService.sendMagicLink({
      email: 'test@example.com'
    });
    expect(result.email).toBe('test@example.com');
  });
});
```

**Component Test Example**:
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## 📚 Adding New Features

### Step-by-Step Guide

1. **Create Feature Directory**
   ```bash
   mkdir -p src/features/your-feature/{components,hooks,services,types}
   ```

2. **Define Types**
   ```typescript
   // src/features/your-feature/types/your-feature.types.ts
   export interface YourFeature {
     id: string;
     name: string;
   }
   ```

3. **Create Service** (+ tests)
   ```typescript
   // src/features/your-feature/services/your-feature.service.ts
   import { httpClient } from '@/lib/http/client';

   export class YourFeatureService {
     async getItems() {
       const response = await httpClient.get('/your-feature');
       return response.success ? response.data : [];
     }
   }

   export const yourFeatureService = new YourFeatureService();
   ```

4. **Build Custom Hook** (+ tests)
   ```typescript
   // src/features/your-feature/hooks/use-your-feature.ts
   import { useState, useEffect } from 'react';
   import { yourFeatureService } from '../services/your-feature.service';

   export function useYourFeature() {
     const [data, setData] = useState([]);
     const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
       async function fetchData() {
         setIsLoading(true);
         try {
           const items = await yourFeatureService.getItems();
           setData(items);
         } finally {
           setIsLoading(false);
         }
       }
       fetchData();
     }, []);

     return { data, isLoading };
   }
   ```

5. **Create Components** (+ tests)
   ```typescript
   // src/features/your-feature/components/your-feature-list.tsx
   import { useYourFeature } from '../hooks/use-your-feature';

   export function YourFeatureList() {
     const { data, isLoading } = useYourFeature();

     if (isLoading) return <Spinner />;

     return (
       <ul>
         {data.map(item => (
           <li key={item.id}>{item.name}</li>
         ))}
       </ul>
     );
   }
   ```

6. **Add Route**
   ```typescript
   // app/your-feature/page.tsx
   import { YourFeatureList } from '@/features/your-feature/components/your-feature-list';

   export default function YourFeaturePage() {
     return <YourFeatureList />;
   }
   ```

See `CLAUDE.md` for complete examples and patterns.

## 🔐 Authentication Flow

### Magic Link Authentication

1. User enters email in `MagicLinkForm`
2. Frontend calls `authService.sendMagicLink({ email })`
3. Backend sends magic link email via Supabase
4. User clicks link → redirects to verify callback
5. Frontend verifies token with `authService.verifyMagicLink({ token, email })`
6. Backend returns user data + JWT tokens
7. Frontend stores in Zustand store (persisted to localStorage)
8. HTTP client auto-injects token in all requests

### Protected Routes

Routes are protected via `middleware.ts`:

- **Public**: `/login`, `/register`
- **Protected**: `/dashboard`, `/profile`, `/settings`

Unauthenticated users are redirected to `/login?redirect=/requested-path`.

## 🏗️ Architecture Principles

### Clean Architecture Layers

```
┌──────────────────────────────────┐
│     Presentation Layer           │  ← React Components, Pages
├──────────────────────────────────┤
│     Application Layer            │  ← Hooks, State Management
├──────────────────────────────────┤
│     Domain Layer                 │  ← Types, Business Logic
├──────────────────────────────────┤
│     Infrastructure Layer         │  ← HTTP Client, Services
└──────────────────────────────────┘
```

### SOLID Principles

- **S**ingle Responsibility: Components render, hooks manage logic
- **O**pen/Closed: Extend via props, not modification
- **L**iskov Substitution: Components accept base HTML props
- **I**nterface Segregation: Small, focused interfaces
- **D**ependency Inversion: Depend on abstractions (hooks, services)

### Key Design Patterns

- **Service Layer**: API communication abstraction
- **Custom Hooks**: Business logic encapsulation
- **Repository Pattern**: Data access abstraction
- **Strategy Pattern**: Configurable components via props
- **Observer Pattern**: Zustand state subscriptions

## 📖 Documentation

- **`CLAUDE.md`**: Complete architecture documentation, code examples, and patterns
- **`README.md`**: This file - setup and development guide
- **`.env.local.example`**: Environment variable template

## 🤝 Contributing

### Code Quality Requirements

1. **Tests Required**: Every feature MUST have unit tests (70% coverage minimum)
2. **Type Safety**: Strict TypeScript mode enforced
3. **Code Style**: ESLint rules must pass
4. **Clean Architecture**: Follow layer separation

### Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement feature with tests
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Build check: `npm run build`
6. Commit and push
7. Create pull request

## 🔗 Related Projects

- **Backend**: `../backend` - NestJS API with Supabase integration
- **Documentation**: See `claudedocs/` for research and planning documents

## 📝 License

This project is part of PsicoZen mental health platform.

## 🆘 Support

For architecture questions and implementation guidance, refer to:

1. **`CLAUDE.md`** - Comprehensive architecture guide
2. **Code Examples** - In-code comments and test files
3. **Backend Documentation** - `../backend/CLAUDE.md`

---

Built with ❤️ using Next.js 16, React 19, TypeScript, and Clean Architecture principles.
