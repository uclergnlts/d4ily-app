import { db } from "@/lib/db";
import { twitterAccounts, rssSources } from "@/lib/db/schema";
import { TWITTER_USERS, RSS_FEEDS } from "@/lib/config/sources";

/**
 * Seed script to migrate existing hardcoded sources to database
 */
async function seedSources() {
    console.log("Starting source migration...");

    // Seed Twitter Accounts
    console.log(`\nMigrating ${TWITTER_USERS.length} Twitter accounts...`);

    const twitterCategories: Record<string, string> = {
        // Politicians & Government
        "RTErdogan": "siyaset",
        "dbdevletbahceli": "siyaset",
        "HakanFidan": "siyaset",
        "kilicdarogluk": "siyaset",
        "ekrem_imamoglu": "siyaset",
        "mansuryavas06": "siyaset",
        "meral_aksener": "siyaset",
        "umitozdag": "siyaset",
        "MuharremInce": "siyaset",
        "Ahmet_Davutoglu": "siyaset",
        "Temel_Karamollaoglu": "siyaset",
        // Economy
        "mahfiegilmez": "ekonomi",
        "OzgrDemirtas": "ekonomi",
        "emrealkin1969": "ekonomi",
        "iriscibre": "ekonomi",
        "mustafasonmez": "ekonomi",
        "ugurses": "ekonomi",
        "memetsimsek": "ekonomi",
        // Sports
        "Fenerbahce": "spor",
        "GalatasaraySK": "spor",
        "Besiktas": "spor",
        "Trabzonspor": "spor",
        "TFF_Org": "spor",
        "yagosabuncuoglu": "spor",
        "ertemsener": "spor",
        // Media & News
        "pusholder": "medya",
        "t24comtr": "medya",
        "gazeteduvar": "medya",
        "medyascope": "medya",
        "bbcturkce": "medya",
        "anadoluajansi": "medya",
        "trthaber": "medya",
        // Tech & Science
        "hakki_alkan": "teknoloji",
        "BarisOzcan": "teknoloji",
        "evrimagaci": "bilim",
        "Webtekno": "teknoloji",
        "teyitorg": "medya",
    };

    let twitterInserted = 0;
    for (const username of TWITTER_USERS) {
        try {
            await db.insert(twitterAccounts).values({
                username,
                category: twitterCategories[username] || "genel",
                priority: 5, // Default priority
                is_active: true,
                added_by: "seed_script",
            }).onConflictDoNothing();
            twitterInserted++;
        } catch (error: any) {
            console.error(`Failed to insert ${username}:`, error.message);
        }
    }

    console.log(`✓ Inserted ${twitterInserted} Twitter accounts`);

    // Seed RSS Sources
    console.log(`\nMigrating ${RSS_FEEDS.length} RSS sources...`);

    const rssData = [
        { url: RSS_FEEDS[0], name: "BirGün - Siyaset", category: "siyaset" },
        { url: RSS_FEEDS[1], name: "DW Türkçe", category: "gundem" },
        { url: RSS_FEEDS[2], name: "Anadolu Ajansı - Güncel", category: "gundem" },
        { url: RSS_FEEDS[3], name: "Sputnik Türkiye", category: "dunya" },
        { url: RSS_FEEDS[4], name: "BBC Türkçe", category: "gundem" },
        { url: RSS_FEEDS[5], name: "BiaNet", category: "gundem" },
        { url: RSS_FEEDS[6], name: "NTV Gündem", category: "gundem" },
    ];

    let rssInserted = 0;
    for (const source of rssData) {
        try {
            await db.insert(rssSources).values({
                ...source,
                is_active: true,
                fetch_interval: 240, // 4 hours
                added_by: "seed_script",
            }).onConflictDoNothing();
            rssInserted++;
        } catch (error: any) {
            console.error(`Failed to insert ${source.name}:`, error.message);
        }
    }

    console.log(`✓ Inserted ${rssInserted} RSS sources`);

    console.log("\n✅ Migration completed!");
    console.log(`Total: ${twitterInserted} Twitter + ${rssInserted} RSS = ${twitterInserted + rssInserted} sources`);
}

// Run if called directly
if (require.main === module) {
    seedSources()
        .then(() => {
            console.log("\nAll done!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Seed failed:", error);
            process.exit(1);
        });
}

export { seedSources };
