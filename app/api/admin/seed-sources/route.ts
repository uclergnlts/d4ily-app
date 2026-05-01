import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { twitterAccounts } from "@/lib/db/schema";
import { CORPORATE_ACCOUNTS, PERSONAL_ACCOUNTS } from "@/lib/config/sources";

export const dynamic = "force-dynamic";

type TwitterSeed = {
    username: string;
    category: string;
    priority: number;
    trust_score: number;
    is_official: boolean;
    fetch_interval: number;
    show_in_live_feed: boolean;
};

const VERIFIED_CORE_TWITTER: TwitterSeed[] = [
    { username: "Merkez_Bankasi", category: "ekonomi", priority: 5, trust_score: 5, is_official: true, fetch_interval: 5, show_in_live_feed: false },
    { username: "CentralBank_TR", category: "ekonomi", priority: 3, trust_score: 5, is_official: true, fetch_interval: 30, show_in_live_feed: false },
    { username: "TCMBBlog", category: "ekonomi", priority: 2, trust_score: 5, is_official: true, fetch_interval: 60, show_in_live_feed: false },
    { username: "TCMB_Arastirma", category: "ekonomi", priority: 3, trust_score: 5, is_official: true, fetch_interval: 30, show_in_live_feed: false },
    { username: "AFADBaskanlik", category: "afet", priority: 5, trust_score: 5, is_official: true, fetch_interval: 5, show_in_live_feed: false },
    { username: "adalet_bakanlik", category: "hukuk", priority: 4, trust_score: 5, is_official: true, fetch_interval: 10, show_in_live_feed: false },
    { username: "AliYerlikaya", category: "guvenlik", priority: 5, trust_score: 5, is_official: true, fetch_interval: 5, show_in_live_feed: true },
];

const categoryByUsername: Record<string, string> = {
    RTErdogan: "siyasi_lider",
    dbdevletbahceli: "siyasi_lider",
    HakanFidan: "diplomasi",
    kilicdarogluk: "siyasi_lider",
    eczozgurozel: "siyasi_lider",
    ekrem_imamoglu: "belediye",
    mansuryavas06: "belediye",
    meral_aksener: "siyasi_lider",
    alibabacan: "siyasi_lider",
    AliYerlikaya: "guvenlik",
    memetsimsek: "ekonomi",
    mahfiegilmez: "ekonomi",
    OzgrDemirtas: "ekonomi",
    ugurses: "ekonomi",
    cigdemtoker: "ekonomi",
    ismailsaymaz: "gazeteci",
    nevsinmengu: "gazeteci",
    muratyetkin2: "gazeteci",
    fatihaltayli: "gazeteci",
    t24comtr: "medya",
    gazeteduvar: "medya",
    medyascope: "medya",
    trthaber: "ajans",
    anadoluajansi: "ajans",
    AFADBaskanlik: "afet",
    TC_Icisleri: "guvenlik",
};

function buildFallbackTwitterSeed(username: string, showInLiveFeed: boolean): TwitterSeed {
    const category = categoryByUsername[username] || (showInLiveFeed ? "gazeteci" : "medya");
    const isOfficial = ["AFADBaskanlik", "TC_Icisleri", "adalet_bakanlik", "Merkez_Bankasi"].includes(username);
    const isAgency = ["trthaber", "anadoluajansi"].includes(username);
    const isHighSignalPerson = ["RTErdogan", "AliYerlikaya", "memetsimsek", "HakanFidan"].includes(username);

    return {
        username,
        category,
        priority: isOfficial || isHighSignalPerson ? 5 : isAgency ? 4 : showInLiveFeed ? 3 : 2,
        trust_score: isOfficial ? 5 : isAgency ? 4 : showInLiveFeed ? 3 : 2,
        is_official: isOfficial,
        fetch_interval: isOfficial || isHighSignalPerson ? 5 : isAgency ? 10 : showInLiveFeed ? 20 : 60,
        show_in_live_feed: showInLiveFeed,
    };
}

export async function POST() {
    try {
        const twitterSeeds = new Map<string, TwitterSeed>();
        for (const source of VERIFIED_CORE_TWITTER) {
            twitterSeeds.set(source.username, source);
        }
        for (const username of PERSONAL_ACCOUNTS) {
            if (!twitterSeeds.has(username)) {
                twitterSeeds.set(username, buildFallbackTwitterSeed(username, true));
            }
        }
        for (const username of CORPORATE_ACCOUNTS) {
            if (!twitterSeeds.has(username)) {
                twitterSeeds.set(username, buildFallbackTwitterSeed(username, false));
            }
        }

        let twitterInserted = 0;
        const twitterErrors: string[] = [];

        for (const source of twitterSeeds.values()) {
            try {
                const result = await db.insert(twitterAccounts).values({
                    username: source.username,
                    category: source.category,
                    priority: source.priority,
                    trust_score: source.trust_score,
                    is_official: source.is_official,
                    fetch_interval: source.fetch_interval,
                    is_active: true,
                    show_in_live_feed: source.show_in_live_feed,
                    added_by: "seed_api",
                }).onConflictDoUpdate({
                    target: [twitterAccounts.username],
                    set: {
                        updated_at: new Date().toISOString(),
                        category: source.category,
                        priority: source.priority,
                        trust_score: source.trust_score,
                        is_official: source.is_official,
                        fetch_interval: source.fetch_interval,
                        show_in_live_feed: source.show_in_live_feed,
                    },
                }).returning();

                if (result.length > 0) twitterInserted++;
            } catch (error: any) {
                twitterErrors.push(`${source.username}: ${error.message}`);
            }
        }

        return NextResponse.json({
            success: twitterErrors.length === 0,
            message: "X kaynakları priority/trustScore modeline göre güncellendi. RSS seed şimdilik kapalı.",
            twitter: twitterInserted,
            twitterTotal: twitterSeeds.size,
            rss: 0,
            rssTotal: 0,
            total: twitterInserted,
            errors: {
                twitter: twitterErrors,
                rss: [],
            },
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}
