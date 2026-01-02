import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Simple DB query to test connection
        const result = await db.run(sql`SELECT 1 as test`);

        const dbType = process.env.TURSO_DATABASE_URL ? 'turso' : 'local.db';
        const isProduction = process.env.NODE_ENV === 'production';

        return NextResponse.json({
            status: 'ok',
            database: dbType,
            connected: true,
            environment: process.env.NODE_ENV || 'development',
            warning: (!process.env.TURSO_DATABASE_URL && isProduction)
                ? 'CRITICAL: Using local.db in production! Data will not persist.'
                : undefined,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            database: process.env.TURSO_DATABASE_URL ? 'turso' : 'local.db',
            connected: false,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
