#!/bin/bash

# Setup script for new Supabase project
# Usage: ./scripts/setup-supabase.sh

echo "=== Supabase Project Setup ==="
echo ""
echo "Please provide your new Supabase project details:"
echo ""

read -p "Project URL (e.g., https://xxxxx.supabase.co): " SUPABASE_URL
read -p "Anon/Public Key: " SUPABASE_ANON_KEY
read -p "Service Role Key (for migrations): " SUPABASE_SERVICE_KEY

# Extract project ID from URL
PROJECT_ID=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|.supabase.co||')

echo ""
echo "Setting up configuration files..."

# Create .env.local
cat > .env.local << EOF
VITE_SUPABASE_URL="${SUPABASE_URL}"
VITE_SUPABASE_PUBLISHABLE_KEY="${SUPABASE_ANON_KEY}"
VITE_SUPABASE_PROJECT_ID="${PROJECT_ID}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_KEY}"
EOF

# Update .env (for Vite)
cat > .env << EOF
VITE_SUPABASE_URL="${SUPABASE_URL}"
VITE_SUPABASE_PUBLISHABLE_KEY="${SUPABASE_ANON_KEY}"
VITE_SUPABASE_PROJECT_ID="${PROJECT_ID}"
EOF

# Update supabase/config.toml
sed -i '' "s/project_id = \".*\"/project_id = \"${PROJECT_ID}\"/" supabase/config.toml

echo ""
echo "✓ Configuration files updated!"
echo ""
echo "Next steps:"
echo "1. Run database migrations: supabase db push"
echo "2. Migrate candidates: SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY} npx tsx scripts/migrate-candidates.ts"
echo ""


