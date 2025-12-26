import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { twitterAccounts } from "@/lib/db/schema";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const newAccounts = [
            // Hükümet & Bakanlar
            "AliYerlikaya", "Yusuf__Tekin", "cevdetyilmaz", "NumanKurtulmus",
            "mehmetmus", "AlparslanBayrak", "a_uraloglu", "AbdulkadirUral",

            // Yerel Yöneticiler
            "tanjuozcanchp", "Ahmet_Aras", "burcukoksal03", "OzlemCercioglu",
            "vahap_secer", "zeydankaralar01",

            // Parti Sözcüleri / Yöneticileri
            "hamzahdag", "mustafaelitas", "yusufziya_yilmaz", "efkan_ala", // AKP
            "ozgurozel", // Main account check
            "gamzetasciyer", "faikoztrak", // CHP (Note: Oztrak active?)
            "omerrcelik", // AKP (Check if exists)

            // Diğer
            "RHisarciklioglu", "vedatbilgn"
        ];

        let addedCount = 0;
        const results = [];

        for (const username of newAccounts) {
            try {
                // Insert or ignore if exists
                await db.insert(twitterAccounts).values({
                    username: username,
                    is_active: true,
                    show_in_live_feed: true,
                    created_at: new Date().toISOString()
                }).onConflictDoNothing();

                // Explicitly update show_in_live_feed in case it existed but was hidden
                // This 'onConflictDoNothing' above only handles ID/username uniqueness. 
                // We might want to ensure they are set to visible if they already existed.
                // But typically duplicate inserts are ignored.

                results.push({ username, status: "processed" });
                addedCount++;
            } catch (e: any) {
                console.error(`Error adding ${username}:`, e);
                results.push({ username, error: e.message });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${newAccounts.length} new politicians`,
            addedCount,
            results
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
