# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

### Development

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database

```bash
npx drizzle-kit generate  # Generate migrations from schema changes
npx drizzle-kit migrate   # Run pending migrations
```

### Common Tasks

- **Run dev server:** `npm run dev`
- **Check for linting issues:** `npm run lint`
- **Build before deployment:** `npm run build`

## Project Architecture

This is a full-stack authentication and blogging starter template using Next.js App Router with Better Auth and Drizzle ORM. The architecture separates concerns across frontend, authentication, and database layers.

### Core Directory Structure

- **`src/app/`** - Next.js App Router pages and layouts

  - `(protected)/` - Route group with auth middleware for protected pages
  - `api/auth/[...all]/` - Better Auth API handler (all auth logic routes through here)
  - `components/` - React components (UI, forms, navigation)
  - `auth/`, `signup/`, `request-password-reset/`, `reset-password/` - Auth-related pages

- **`src/lib/`** - Core business logic and configuration

  - `auth.ts` - Better Auth server configuration with email verification, password reset, Google OAuth, session settings, rate limiting
  - `auth-client.ts` - Client-side auth hooks wrapper around Better Auth React hooks
  - `email/sendEmail.ts` - Email service using Nodemailer

- **`src/drizzle/`** - Database layer
  - `schema.ts` - Drizzle ORM schema (user, session, account, verification, posts, comments, reactions tables)
  - `db.ts` - Database connection instance

### High-Level Flow

1. **Authentication Flow:**

   - Public routes (`/`, `/signup`, `/request-password-reset`) handle auth
   - Protected layout at `src/app/(protected)/layout.tsx` checks `authClient.useSession()` and redirects unauthenticated users
   - Sessions stored in database with 10-minute expiry
   - Email verification required on signup; password reset via email token

2. **Protected Routes:**

   - Wrapped in `(protected)` route group with session verification
   - Role-based access via `user.role` field ("user" or "admin")
   - `admin-dashboard/`, `change-password/`, `post-list/` are protected pages

3. **Database:**

   - PostgreSQL via Neon serverless
   - Tables: `user`, `session`, `account` (OAuth), `verification` (email tokens), `posts`, `comments`, `reactions`
   - Better Auth manages user, session, account, verification tables automatically via drizzleAdapter
   - Post/comment/reaction tables are custom for blog functionality

4. **Email Notifications:**
   - Sent via Nodemailer on email verification and password reset
   - Email templates contain verification/reset links with tokens
   - Currently configured with Ethereal test service (not production-ready)

### Key Technologies

- **Next.js 16.1** - App Router with React 19 compiler enabled
- **Better Auth 1.4** - Authentication library (email/password, OAuth, sessions)
- **Drizzle ORM 0.45** - Type-safe SQL queries with migrations
- **PostgreSQL** - Via Neon serverless driver
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Customizable component library
- **TypeScript 5** - Full type coverage

## Important Implementation Details

### Environment Variables

Required in `.env`:

- `DATABASE_URL` - PostgreSQL connection string (Neon format with SSL)
- `BETTER_AUTH_SECRET` - Random secret for session signing
- `BETTER_AUTH_URL` - Base URL (http://localhost:3000 for dev)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials

### Authentication Configuration (src/lib/auth.ts)

- Email verification required on signup; auto sign-in after verification enabled
- Password reset emails sent via Nodemailer
- Google OAuth with "select_account" prompt
- Session expiry: 10 minutes, update age: 7 minutes, cookie cache: 3 minutes
- Rate limiting: 100 req/60s global, 3 req/10s for signup
- User model has optional `role` field (defaults to "user")

### Client-Side Session Hooks (src/lib/auth-client.ts)

- `authClient.useSession()` - Check session state and user data
- `authClient.signIn.email()` - Email/password login
- `authClient.signUp.email()` - Email/password signup
- `authClient.changePassword()` - Change password for logged-in user
- Returns loading state during verification

### Database Schema Notes

- All user-related records cascade delete
- Email unique constraint on user table
- Session tracks IP and user agent
- OAuth accounts support multiple providers per user
- Posts use slug for URL-friendly access
- Reactions are unique per user-post pair (one reaction per user per post)

## Common Patterns and Conventions

### Form Handling

Forms use server actions or direct API calls via auth-client. Examples:

- `LoginForm` → `authClient.signIn.email()` → creates session
- `ChangePasswordForm` → `authClient.changePassword()` → updates account
- Forms handle loading states and display errors via Sonner toast notifications

### Protected Components

Components in `(protected)` pages should check session in layout, not individual components. The layout handles routing based on session state.

### UI Components

shadcn/ui components imported as needed from `src/app/components/ui/`. Tailwind utility classes for custom styling.

### Type Safety

- Database queries via Drizzle are type-safe
- Session data strongly typed via Better Auth
- All API endpoints return typed responses

## Database Schema Reference

| Table          | Purpose                   | Notable Fields                                              |
| -------------- | ------------------------- | ----------------------------------------------------------- |
| `user`         | User accounts             | id, email (unique), name, emailVerified, role, image        |
| `session`      | Active sessions           | id, token (unique), userId, expiresAt, ipAddress, userAgent |
| `account`      | OAuth/password            | userId, providerId, accessToken, refreshToken               |
| `verification` | Email verification tokens | identifier (email), value (token), expiresAt                |
| `posts`        | Blog posts                | id, title, slug, content, authorId                          |
| `comments`     | Post comments             | id, postId, userId, content                                 |
| `reactions`    | Post likes/dislikes       | id, postId, userId, value (+1/-1)                           |

## File Structure for New Features

When adding new features:

- **Pages:** Add to `src/app/` following App Router conventions
- **Protected pages:** Add to `src/app/(protected)/`
- **Components:** Add reusable components to `src/app/components/`
- **Database tables:** Add to `src/drizzle/schema.ts`, then run `npx drizzle-kit generate` to create migrations
- **Email templates:** Add email sending logic to `src/lib/email/` following sendEmail pattern
- **Auth logic:** Modify `src/lib/auth.ts` for new auth features (new providers, custom callbacks, etc.)

## Debugging Tips

- Check Better Auth logs in server console for auth-related issues
- Database issues: Verify `DATABASE_URL` and PostgreSQL connection via `psql` or Neon dashboard
- Protected routes redirect: Check session state with browser DevTools → Application → Cookies
- Email not sending: Verify Nodemailer SMTP config and check server logs for email errors
- OAuth issues: Verify Google Client ID/Secret match authorized redirect URIs in Google Console

My Coding Preferences

- Always use TypeScript strict mode
- Prefer functional programming patterns over classes
- Use descriptive variable names, no single-letter variables except in Loops
- Add JDoc comments for public functions only
  #\*Testing
- Write tests for all new features
- Use Jest for unit tests
- Aim for 80%+ coverage on critical paths

# React/Frontend

- Use functional components with hooks only
- Extract components when they exceed 180 Lines
- Keep props interfaces in the same file as the component
- Use
  CSS modules for styling

# Git Commits

- Use conventional commits format (feat:, fix:, refactort, etc.)
- Keep commit messages under 72 characters
- Always reference ticket numbers when applicable
