# Database Integration Setup

This document describes the Supabase database integration that has been set up for the Kindly application.

## Overview

The application now has a comprehensive database integration layer built on top of Supabase, providing:

- **Type-safe database operations** with TypeScript
- **React Query hooks** for efficient data fetching and caching
- **Centralized database service functions** for all database operations
- **Proper error handling** and loading states

## Architecture

### Database Service Layer (`src/lib/db/`)

The database service layer provides pure functions for database operations:

- **`profiles.ts`** - Profile management (get, update, search)
- **`invitations.ts`** - Invitation management (create, validate, accept)
- **`userRoles.ts`** - Role management (check roles, assign roles)
- **`connection.ts`** - Database connection utilities and health checks

### React Query Hooks (`src/hooks/`)

Custom hooks that wrap the database functions with React Query:

- **`useProfile.ts`** - Profile data fetching and mutations
- **`useInvitations.ts`** - Invitation management hooks
- **`useUserRoles.ts`** - User role checking hooks

## Database Schema

The database includes three main tables:

### `profiles`
- User profile information
- Fields: `id`, `user_id`, `email`, `full_name`, `display_name`, `photo_url`, `bio`, `onboarding_completed`, `created_at`, `updated_at`

### `invitations`
- Invitation codes for access control
- Fields: `id`, `code`, `email`, `name`, `status`, `created_by`, `accepted_by`, `expires_at`, `created_at`, `accepted_at`

### `user_roles`
- User role assignments
- Fields: `id`, `user_id`, `role` (admin/user), `created_at`

## Usage Examples

### Using Profile Hooks

```typescript
import { useCurrentUserProfile, useUpdateProfile } from '@/hooks/useProfile';

function MyComponent() {
  const { data: profile, isLoading, error } = useCurrentUserProfile();
  const updateProfile = useUpdateProfile();

  const handleUpdate = async () => {
    try {
      await updateProfile.mutateAsync({
        display_name: 'New Name',
        bio: 'Updated bio',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div>
      <h1>{profile?.display_name}</h1>
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
}
```

### Using Invitation Hooks

```typescript
import { useInvitations, useCreateInvitation, generateInvitationCode } from '@/hooks/useInvitations';

function AdminPanel() {
  const { data: invitations } = useInvitations();
  const createInvitation = useCreateInvitation();

  const handleCreate = async () => {
    const code = generateInvitationCode();
    await createInvitation.mutateAsync({
      code,
      email: 'user@example.com',
      name: 'User Name',
    });
  };

  return (
    <div>
      {invitations?.map(inv => (
        <div key={inv.id}>{inv.code}</div>
      ))}
      <button onClick={handleCreate}>Create Invitation</button>
    </div>
  );
}
```

### Using Role Hooks

```typescript
import { useIsAdmin } from '@/hooks/useUserRoles';

function AdminOnlyComponent() {
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (isLoading) return <div>Checking permissions...</div>;
  if (!isAdmin) return <div>Access denied</div>;

  return <div>Admin content</div>;
}
```

## Environment Variables

The following environment variables are required (already configured in `.env`):

```env
VITE_SUPABASE_URL=https://jhcjxkswnyrkhmfrdomj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database Migrations

Database migrations are located in `supabase/migrations/`:

- `20260102164153_432b30f4-af7e-4320-829c-32b5fc03ea91.sql` - Initial schema setup
- `20260102164225_a1527de8-4013-46ca-8b07-b07413916fb2.sql` - Function fixes

These migrations create:
- Tables with proper relationships
- Row Level Security (RLS) policies
- Database functions for role checking
- Triggers for automatic profile creation on signup

## Security

- **Row Level Security (RLS)** is enabled on all tables
- Users can only access their own data
- Admins have elevated permissions via RLS policies
- All database functions use `SECURITY DEFINER` where appropriate

## Testing the Connection

You can test the database connection using:

```typescript
import { testConnection, getDatabaseHealth } from '@/lib/db';

// Test connection
const isConnected = await testConnection();

// Get health status
const health = await getDatabaseHealth();
console.log(health);
```

## Next Steps

1. **Update existing pages** to use the new hooks instead of direct Supabase calls
2. **Add error boundaries** for better error handling
3. **Implement optimistic updates** where appropriate
4. **Add database indexes** for frequently queried fields
5. **Set up database backups** via Supabase dashboard

## Files Created/Modified

### New Files
- `src/lib/db/profiles.ts`
- `src/lib/db/invitations.ts`
- `src/lib/db/userRoles.ts`
- `src/lib/db/connection.ts`
- `src/lib/db/index.ts`
- `src/lib/db/README.md`
- `src/hooks/useProfile.ts`
- `src/hooks/useInvitations.ts`
- `src/hooks/useUserRoles.ts`

### Modified Files
- `src/App.tsx` - Updated QueryClient configuration
- `src/pages/Profile.tsx` - Updated to use new hooks

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript with Supabase](https://supabase.com/docs/guides/api/generating-types)


