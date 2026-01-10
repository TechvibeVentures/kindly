import { supabase } from '@/integrations/supabase/client';

/**
 * Test the database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

/**
 * Get database health status
 */
export async function getDatabaseHealth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const health = {
      connected: false,
      authenticated: !!session,
      userId: session?.user?.id || null,
      timestamp: new Date().toISOString(),
    };

    const connected = await testConnection();
    health.connected = connected;

    return health;
  } catch (error) {
    return {
      connected: false,
      authenticated: false,
      userId: null,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


