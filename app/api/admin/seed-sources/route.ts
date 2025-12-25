import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { twitterAccounts, rssSources } from "@/lib/db/schema";
import { TWITTER_USERS, RSS_FEEDS } from "@/lib/config/sources";

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        console.log("Starting source seeding...");
        console.log("TWITTER_USERS length:", TWITTER_USERS.length);
        console.log("RSS_FEEDS length:", RSS_FEEDS.length);

        // Twitter kategorileri
        const twitterCategories: Record<string, string> = {
            "RTErdogan": "siyaset", "dbdevletbahceli": "siyaset", "HakanFidan": "siyaset",
            "kilicdarogluk": "siyaset", "ekrem_imamoglu": "siyaset", "mansuryavas06": "siyaset",
            "meral_aksener": "siyaset", "umitozdag": "siyaset", "MuharremInce": "siyaset",
            "mahfiegilmez": "ekonomi", "OzgrDemirtas": "ekonomi", "emrealkin1969": "ekonomi",
            "iriscibre": "ekonomi", "mustafasonmez": "ekonomi", "ugurses": "ekonomi",
            "Fenerbahce": "spor", "GalatasaraySK": "spor", "Besiktas": "spor", "Trabzonspor": "spor",
            "pusholder": "medya", "t24comtr": "medya", "gazeteduvar": "medya", "medyascope": "medya",
            "hakki_alkan": "teknoloji", "BarisOzcan": "teknoloji", "Webtekno": "teknoloji",
            "evrimagaci": "bilim",
        };

        let twitterInserted = 0;
        let twitterErrors: string[] = [];

        for (const username of TWITTER_USERS) {
            try {
                const result = await db.insert(twitterAccounts).values({
                    username,
                    category: twitterCategories[username] || "genel",
                    priority: 5,
                    is_active: true,
                    added_by: "seed_api",
                }).onConflictDoUpdate({
                    target: [twitterAccounts.username],
                    set: { updated_at: new Date().toISOString() }
                }).returning();

                if (result && result.length > 0) {
                    twitterInserted++;
                }
            } catch (error: any) {
                twitterErrors.push(`${username}: ${error.message}`);
                console.error(`Failed to insert ${username}:`, error.message);
            }
        }

        // RSS kaynakları
        const rssData = [
            { url: "https://www.birgun.net/rss/kategori/siyaset-8", name: "BirGün - Siyaset", category: "siyaset" },
            { url: "http://rss.dw-world.de/rdf/rss-tur-all", name: "DW Türkçe", category: "gundem" },
            { url: "https://www.aa.com.tr/tr/rss/default?cat=guncel", name: "Anadolu Ajansı", category: "gundem" },
            { url: "https://tr.sputniknews.com/export/rss2/archive/index.xml", name: "Sputnik", category: "dunya" },
            { url: "http://feeds.bbci.co.uk/turkce/rss.xml", name: "BBC Türkçe", category: "gundem" },
            { url: "https://bianet.org/rss/bianet", name: "BiaNet", category: "gundem" },
            { url: "https://www.ntv.com.tr/gundem.rss", name: "NTV Gündem", category: "gundem" },
        ];

        let rssInserted = 0;
        let rssErrors: string[] = [];

        for (const source of rssData) {
            try {
                const result = await db.insert(rssSources).values({
                    ...source,
                    is_active: true,
                    fetch_interval: 240,
                    added_by: "seed_api",
                }).onConflictDoUpdate({
                    target: [rssSources.url],
                    set: { updated_at: new Date().toISOString() }
                }).returning();

                if (result && result.length > 0) {
                    rssInserted++;
                }
            } catch (error: any) {
                rssErrors.push(`${source.name}: ${error.message}`);
                console.error(`Failed to insert ${source.name}:`, error.message);
            }
        }

        console.log(`✓ Twitter: ${twitterInserted}/${TWITTER_USERS.length}`);
        console.log(`✓ RSS: ${rssInserted}/${rssData.length}`);

        return NextResponse.json({
            success: true,
            message: "Kaynaklar işlendi!",
            twitter: twitterInserted,
            twitterTotal: TWITTER_USERS.length,
            twitterErrors: twitterErrors.length > 0 ? twitterErrors.slice(0, 5) : undefined,
            rss: rssInserted,
            rssTotal: rssData.length,
            rssErrors: rssErrors.length > 0 ? rssErrors : undefined,
            total: twitterInserted + rssInserted
        });

    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
