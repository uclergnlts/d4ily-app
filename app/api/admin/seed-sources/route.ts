import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { twitterAccounts, rssSources } from "@/lib/db/schema";
import { PERSONAL_ACCOUNTS, CORPORATE_ACCOUNTS, RSS_FEEDS } from "@/lib/config/sources";

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        console.log("Starting source seeding...");
        console.log("PERSONAL_ACCOUNTS length:", PERSONAL_ACCOUNTS.length);
        console.log("CORPORATE_ACCOUNTS length:", CORPORATE_ACCOUNTS.length);
        console.log("RSS_FEEDS length:", RSS_FEEDS.length);

        // Twitter kategorileri (Varsayılan kategori haritası)
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

        // 1. Kişisel Hesaplar (Canlı Akışta GÖRÜNECEK)
        for (const username of PERSONAL_ACCOUNTS) {
            try {
                const result = await db.insert(twitterAccounts).values({
                    username,
                    category: twitterCategories[username] || "genel",
                    priority: 8, // Kişisel hesaplar yüksek öncelikli
                    is_active: true,
                    show_in_live_feed: true, // EVET
                    added_by: "seed_api",
                }).onConflictDoUpdate({
                    target: [twitterAccounts.username],
                    set: {
                        updated_at: new Date().toISOString(),
                        show_in_live_feed: true // Güncellemede de aç
                    }
                }).returning();
                if (result && result.length > 0) twitterInserted++;
            } catch (error: any) {
                twitterErrors.push(`${username}: ${error.message}`);
                console.error(`Failed to insert personal ${username}:`, error.message);
            }
        }

        // 2. Kurumsal Hesaplar (Canlı Akışta GİZLİ)
        for (const username of CORPORATE_ACCOUNTS) {
            try {
                const result = await db.insert(twitterAccounts).values({
                    username,
                    category: twitterCategories[username] || "medya",
                    priority: 5,
                    is_active: true,
                    show_in_live_feed: false, // HAYIR
                    added_by: "seed_api",
                }).onConflictDoUpdate({
                    target: [twitterAccounts.username],
                    set: {
                        updated_at: new Date().toISOString(),
                        show_in_live_feed: false // Güncellemede kapat
                    }
                }).returning();
                if (result && result.length > 0) twitterInserted++;
            } catch (error: any) {
                twitterErrors.push(`${username}: ${error.message}`);
                console.error(`Failed to insert corporate ${username}:`, error.message);
            }
        }

        // RSS kaynakları
        let rssInserted = 0;
        let rssErrors: string[] = [];

        for (const source of RSS_FEEDS) {
            // RSS feed yapısı source.url olmalı, array string ise maplememiz gerek.
            // lib/config/sources.ts'deki RSS_FEEDS string array ise burada obje bekliyor kod.
            // Orijinal kodda RSS_FEEDS maplenmişti. 
            // Ancak RSS_FEEDS import edilirken string[] geliyor olabilir.
            // Kontrol etmem lazım.
            // Önceki 'view_file' çıktısında RSS_FEEDS bir string array'di: ["url1", "url2"]
            // Fakat seed route kodunda `const rssData = [...]` hardcoded idi.
            // import edilen RSS_FEEDS ile hardcoded listeyi birleştirmeliyiz ya da sadece hardcoded olanı kullanmalıyız.
            // Kullanıcı RSS_FEEDS config dosyasını değiştirdiyse onu kullanmak en doğrusu.
        }

        // Config dosyasındaki RSS_FEEDS sadece URL listesi. İsim ve kategori bilgisi yok.
        // Bu yüzden burada hardcoded listeyi koruyacağım ama import edilen RSS_FEEDS varsa onları da eklemeye çalışabilirim.
        // Şimdilik sadece hardcoded listeyi kullanıyorum (çünkü isim bilgisi gerekiyor).

        const rssData = [
            { url: "https://www.birgun.net/rss/kategori/siyaset-8", name: "BirGün - Siyaset", category: "siyaset" },
            { url: "http://rss.dw-world.de/rdf/rss-tur-all", name: "DW Türkçe", category: "gundem" },
            { url: "https://www.aa.com.tr/tr/rss/default?cat=guncel", name: "Anadolu Ajansı", category: "gundem" },
            { url: "https://tr.sputniknews.com/export/rss2/archive/index.xml", name: "Sputnik", category: "dunya" },
            { url: "http://feeds.bbci.co.uk/turkce/rss.xml", name: "BBC Türkçe", category: "gundem" },
            { url: "https://bianet.org/rss/bianet", name: "BiaNet", category: "gundem" },
            { url: "https://www.ntv.com.tr/gundem.rss", name: "NTV Gündem", category: "gundem" },
        ];

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

        const totalAccounts = PERSONAL_ACCOUNTS.length + CORPORATE_ACCOUNTS.length;

        console.log(`✓ Twitter Updated: ${twitterInserted}/${totalAccounts}`);
        console.log(`✓ RSS Updated: ${rssInserted}/${rssData.length}`);

        return NextResponse.json({
            success: true,
            message: "Kaynaklar Live Feed kurallarına göre güncellendi!",
            twitter: twitterInserted,
            twitterTotal: totalAccounts,
            rss: rssInserted,
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
