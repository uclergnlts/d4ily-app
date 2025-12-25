import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { twitterAccounts } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Running migration: add show_in_live_feed column");

        // Add column using raw SQL
        // Note: If column exists, this will fail - that's OK
        try {
            await db.run(sql.raw('ALTER TABLE twitter_accounts ADD COLUMN show_in_live_feed INTEGER DEFAULT 0 NOT NULL'));
            console.log("Column added successfully");
        } catch (e: any) {
            console.log("Column might already exist:", e.message);
        }

        // Update personal accounts
        const personalAccounts = [
            'RTErdogan', 'dbdevletbahceli', 'eczozgurozel', 'nevsinmengu', 'HakanFidan',
            'erkbas', 'cuneytozdemir', 'haskologlu', 'sakinan1968', 'eafyoncu',
            'm_cemilkilic', 'merdanyanardag', 'MTanal', 'Selcuk', 'E_SemihYalcin',
            'buyukataman', 'celal_adan', 'YildizFeti', 'candundaradasi', 'kilicdarogluk',
            'ekrem_imamoglu', 'mansuryavas06', 'meral_aksener', 'alibabacan', 'MDervisogluTR',
            'erbakanfatih', 'eceuner12', 'emrahgulsunar', 'ismailari_', 'ismailsaymaz',
            'kucukkayaismail', 'muratagirel', 'baristerkoglu', 'barispehlivan', 'mahfiegilmez',
            'OzgrDemirtas', 'emrealkin1969', 'iriscibre', 'mustafasonmez', 'ugurses',
            'senolguldur', 'umitozdag', 'MuharremInce', 'Ahmet_Davutoglu', 'Temel_Karamollaoglu',
            'fahrettinaltun', 'yagosabuncuoglu', 'ertemsener', 'ugur_dundar', 'fatihportakal',
            'yilmazozdil', 'sedat_peker', 'memetsimsek', 'barisyarkadas', 'saygi_ozturk',
            'muratyetkin2', 'fehimtastekin', 'abdulkadir_selvi', 'metinfeyzioglu', 'gonencgurkaynak'
        ];

        let updated = 0;
        for (const username of personalAccounts) {
            try {
                const result = await db.update(twitterAccounts)
                    .set({ show_in_live_feed: true })
                    .where(eq(twitterAccounts.username, username));
                updated++;
            } catch (e) {
                console.error(`Failed to update ${username}:`, e);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Migration completed",
            updated,
            total: personalAccounts.length
        });
    } catch (error: any) {
        console.error("Migration failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
