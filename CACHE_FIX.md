# Fixing Cache Issues

If you're still seeing the old 3-step onboarding or mock data, follow these steps:

## Step 1: Restart Dev Server

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it:
npm run dev
```

## Step 2: Clear Browser Cache

### Chrome/Edge:
1. Open DevTools (F12 or Cmd+Option+I)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Or manually:
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage" in the left sidebar
4. Check "Cache storage" and "Local storage"
5. Click "Clear site data"
6. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Firefox:
1. Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
2. Select "Cache" and "Cookies"
3. Click "Clear Now"
4. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Safari:
1. Cmd+Option+E (clear cache)
2. Cmd+Shift+R (hard refresh)

## Step 3: Use Incognito/Private Mode

Open the app in an incognito/private window to bypass cache completely.

## Step 4: Verify the Fix

After clearing cache:
1. You should see **7 steps** in onboarding (not 3)
2. ProfileEdit should show **loading spinner** initially
3. ProfileEdit should show **your real data** after loading (not mock data)

## If Still Not Working

Check the browser console (F12) for any errors. The new code should:
- Show 7 steps: Basic Info, Work & Languages, Background, Lifestyle, About You, Values & Custody, Photo
- ProfileEdit should show "Loading your profile..." before showing data


