
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import * as schema from './schema';

const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// Production'da local.db kullanılmasını engelle
if (process.env.NODE_ENV === 'production' && !process.env.TURSO_DATABASE_URL) {
    console.error('⚠️ CRITICAL: TURSO_DATABASE_URL not set in production! Data will not persist.');
    console.error('Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel environment variables.');
}

export const db = drizzle(client, { schema });
