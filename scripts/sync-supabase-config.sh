#!/bin/bash

# Sync Supabase configuration from .env.local to other config files

if [ ! -f .env.local ]; then
  echo "Error: .env.local not found!"
  echo "Please create .env.local with your Supabase credentials first."
  exit 1
fi

# Source .env.local to get variables
source .env.local

# Extract project ID from URL if PROJECT_ID not set
if [ -z "$VITE_SUPABASE_PROJECT_ID" ] && [ -n "$VITE_SUPABASE_URL" ]; then
  PROJECT_ID=$(echo $VITE_SUPABASE_URL | sed 's|https://||' | sed 's|.supabase.co||')
else
  PROJECT_ID="$VITE_SUPABASE_PROJECT_ID"
fi

if [ -z "$PROJECT_ID" ]; then
  echo "Error: Could not determine project ID from .env.local"
  exit 1
fi

echo "Updating configuration with project ID: $PROJECT_ID"

# Update supabase/config.toml
if [ -f supabase/config.toml ]; then
  # macOS sed syntax
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/project_id = \".*\"/project_id = \"${PROJECT_ID}\"/" supabase/config.toml
  else
    sed -i "s/project_id = \".*\"/project_id = \"${PROJECT_ID}\"/" supabase/config.toml
  fi
  echo "✓ Updated supabase/config.toml"
else
  echo "Warning: supabase/config.toml not found"
fi

# Update .env (for Vite, in case .env.local isn't loaded)
if [ -f .env ]; then
  # Backup original
  cp .env .env.backup
  
  # Update .env with values from .env.local
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=\"${VITE_SUPABASE_URL}\"|" .env
    sed -i '' "s|VITE_SUPABASE_PUBLISHABLE_KEY=.*|VITE_SUPABASE_PUBLISHABLE_KEY=\"${VITE_SUPABASE_PUBLISHABLE_KEY}\"|" .env
    sed -i '' "s|VITE_SUPABASE_PROJECT_ID=.*|VITE_SUPABASE_PROJECT_ID=\"${PROJECT_ID}\"|" .env
  else
    sed -i "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=\"${VITE_SUPABASE_URL}\"|" .env
    sed -i "s|VITE_SUPABASE_PUBLISHABLE_KEY=.*|VITE_SUPABASE_PUBLISHABLE_KEY=\"${VITE_SUPABASE_PUBLISHABLE_KEY}\"|" .env
    sed -i "s|VITE_SUPABASE_PROJECT_ID=.*|VITE_SUPABASE_PROJECT_ID=\"${PROJECT_ID}\"|" .env
  fi
  echo "✓ Updated .env"
fi

echo ""
echo "Configuration synced successfully!"
echo ""
echo "Next steps:"
echo "1. Run database migrations (see SETUP_NEW_SUPABASE.md)"
echo "2. Migrate candidates: SUPABASE_SERVICE_ROLE_KEY=\$SUPABASE_SERVICE_ROLE_KEY npx tsx scripts/migrate-candidates.ts"


