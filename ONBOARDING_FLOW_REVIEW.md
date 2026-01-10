# Onboarding Flow Review

## Current Flow vs Desired Flow

### Current Implementation:
1. ✅ Landing page - user requests invitation
2. ✅ Admin creates invitation via dashboard
3. ✅ User clicks invitation link → Auth page
4. ✅ User signs up → redirects to onboarding
5. ✅ Onboarding completes → sets `onboarding_completed = true` → redirects to /discover
6. ✅ User can access app

### Desired Flow:
1. ✅ Male candidate receives landing page link
2. ✅ Male candidate requests personal invitation link via landing page
3. ✅ Admin creates and sends personal invitation link via admin dashboard
4. ✅ Male candidate clicks on personal invitation link → light onboarding → creates basic profile
5. ✅ Male candidate can access app content (see other male candidates) **with just basic profile**
6. ⚠️ Male candidate completes profile **later** (full profile completion)

## Key Issues Identified:

### Issue 1: No distinction between basic and full profile
- Currently: `onboarding_completed = true` means full access
- Needed: Basic onboarding allows app access, full profile completion is separate

### Issue 2: Profile completion tracking
- Currently: No way to track if full profile is completed
- Needed: Track profile completion separately from onboarding

## Proposed Changes:

### 1. Database Schema
Add `profile_completed` field to `profiles` table:
- `onboarding_completed` = basic profile created (name, bio, photo) → allows app access
- `profile_completed` = full profile completed (all ProfileEdit fields) → better matching

### 2. Onboarding Flow
- Keep it light: just name, bio, photo
- Set `onboarding_completed = true` (not `profile_completed`)
- Allow access to /discover after basic onboarding

### 3. Profile Completion
- Track completion in ProfileEdit page
- Set `profile_completed = true` when user fills out all important fields
- Show completion percentage/progress

### 4. Access Control
- Basic onboarding (`onboarding_completed = true`) → can see candidates, browse app
- Full profile (`profile_completed = true`) → better matching, full features

## Implementation Plan:

1. Add `profile_completed` field to database
2. Update onboarding to only set `onboarding_completed`
3. Update ProfileEdit to track and set `profile_completed`
4. Add profile completion indicators in UI
5. Ensure app access works with just basic onboarding


