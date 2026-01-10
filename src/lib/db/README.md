# Database Integration

This directory contains all database-related functions and utilities for interacting with Supabase.

## Structure

- `profiles.ts` - Profile management functions
- `invitations.ts` - Invitation management functions
- `userRoles.ts` - User role management functions
- `connection.ts` - Database connection utilities
- `index.ts` - Central export file

## Usage

### Profiles

```typescript
import { getCurrentUserProfile, updateCurrentUserProfile } from '@/lib/db';

// Get current user's profile
const profile = await getCurrentUserProfile();

// Update profile
await updateCurrentUserProfile({
  display_name: 'New Name',
  bio: 'Updated bio',
});
```

### Using React Query Hooks

```typescript
import { useCurrentUserProfile, useUpdateProfile } from '@/hooks/useProfile';

function MyComponent() {
  const { data: profile, isLoading } = useCurrentUserProfile();
  const updateProfile = useUpdateProfile();

  const handleUpdate = async () => {
    await updateProfile.mutateAsync({
      display_name: 'New Name',
    });
  };

  // ...
}
```

### Invitations

```typescript
import { 
  createInvitation, 
  validateInvitationCode,
  generateInvitationCode 
} from '@/lib/db';

// Create invitation
const code = generateInvitationCode();
await createInvitation({
  code,
  email: 'user@example.com',
  name: 'User Name',
});

// Validate invitation
const isValid = await validateInvitationCode(code);
```

### User Roles

```typescript
import { hasRole, isCurrentUserAdmin } from '@/lib/db';

// Check if user is admin
const isAdmin = await isCurrentUserAdmin();

// Check specific role
const hasAdminRole = await hasRole(userId, 'admin');
```

## Database Schema

The database includes the following tables:

- `profiles` - User profiles with display information
- `invitations` - Invitation codes for access control
- `user_roles` - User role assignments (admin/user)

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

These are configured in `.env` file.


