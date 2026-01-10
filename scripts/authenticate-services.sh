#!/bin/bash

# Script to authenticate Supabase and Vercel CLIs
# Run this script to set up authentication tokens

echo "=== Authenticating Services ==="
echo ""

# Check if Supabase is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first."
    exit 1
fi

# Check if Vercel is installed (local or global)
if ! command -v vercel &> /dev/null && [ ! -f "./node_modules/.bin/vercel" ]; then
    echo "❌ Vercel CLI not found. Installing locally..."
    npm install --save-dev vercel
fi

echo "📋 To authenticate, you'll need to:"
echo ""
echo "1. SUPABASE:"
echo "   - Go to: https://supabase.com/dashboard/account/tokens"
echo "   - Create a new access token"
echo "   - Run: export SUPABASE_ACCESS_TOKEN=your_token_here"
echo "   - Or add to .env: SUPABASE_ACCESS_TOKEN=your_token_here"
echo ""
echo "2. VERCEL:"
echo "   - Go to: https://vercel.com/account/tokens"
echo "   - Create a new token"
echo "   - Run: export VERCEL_TOKEN=your_token_here"
echo "   - Or add to .env: VERCEL_TOKEN=your_token_here"
echo ""
echo "After setting tokens, run:"
echo "  supabase link --project-ref tihsuwdvmwmgzjrelepr"
echo "  npx vercel link"
echo ""

# Check if tokens are already set
if [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "✓ SUPABASE_ACCESS_TOKEN is set"
    supabase link --project-ref tihsuwdvmwmgzjrelepr --non-interactive || echo "⚠ Could not link project"
else
    echo "⚠ SUPABASE_ACCESS_TOKEN not set"
fi

if [ -n "$VERCEL_TOKEN" ]; then
    echo "✓ VERCEL_TOKEN is set"
else
    echo "⚠ VERCEL_TOKEN not set"
fi

