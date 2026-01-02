
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import * as schema from './schema';

// Use fallback to local.db if TURSO_DATABASE_URL is missing
// This prevents build failures, but we log critical warnings in production
const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!process.env.TURSO_DATABASE_URL) {
    if (process.env.NODE_ENV === 'production') {
        console.error('⚠️ CRITICAL: TURSO_DATABASE_URL not set in production! Using ephemeral local.db (Data will be lost).');
        console.error('Please set TURSO_DATABASE_URL in Vercel environment variables.');
    } else {
        console.warn('⚠️ using local.db (Development mode)');
    }
}

const client = createClient({
    url,
    authToken,
});

export const db = drizzle(client, { schema });
