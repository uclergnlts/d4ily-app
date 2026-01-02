
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import * as schema from './schema';

// Require TURSO_DATABASE_URL to prevent using ephemeral local.db
if (!process.env.TURSO_DATABASE_URL) {
    throw new Error('TURSO_DATABASE_URL environment variable is required. Please set it in Vercel environment variables.');
}

if (!process.env.TURSO_AUTH_TOKEN) {
    console.warn('⚠️ WARNING: TURSO_AUTH_TOKEN not set. Connection may fail.');
}

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
