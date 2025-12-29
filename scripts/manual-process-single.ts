import * as dotenv from "dotenv";
// CRITICAL: Load env BEFORE any other imports
const result = dotenv.config({ path: ".env.local" });
console.log("Dotenv loaded:", result.parsed ? "YES" : "NO");
console.log("GEMINI_API_KEY present:", process.env.GEMINI_API_KEY ? "YES" : "NO");

// NOW import modules that depend on env vars
import { db } from "../lib/db";
import { newsRaw, processedArticles } from "../lib/db/schema";
import { summarizeArticle } from "../lib/ai";
import { desc } from "drizzle-orm";

async function manualProcess() {
    console.log("\n=== MANUEL HABER İŞLEME ===\n");

    // 1. Ham haberden birini al
    const news = await db.select().from(newsRaw).orderBy(desc(newsRaw.fetched_at)).limit(1);

    if (news.length === 0) {
        console.log("❌ Ham haber bulunamadı!");
        return;
    }

    const article = news[0];
    console.log("📰 İşlenecek Haber:");
    console.log(`  Başlık: ${article.title}`);
    console.log(`  Kaynak: ${article.source_name}\n`);

    // 2. AI ile özetle
    console.log("🤖 AI ile özetleniyor...");
    const textToProcess = article.summary_raw || article.title || "No Content";
    const result = await summarizeArticle(article.title || "Untitled", textToProcess, article.source_name || "Unknown");

    console.log("✓ AI Özeti:");
    console.log(`  Başlık: ${result.title}`);
    console.log(`  Kategori: ${result.category}\n`);

    // 3. Görsel çıkar
    console.log("🖼️  Görsel çıkarılıyor...");
    const payload = article.raw_payload as any;
    let imageUrl: string | null = null;

    if (payload?.image?.url) {
        imageUrl = payload.image.url;
        console.log(`  ✓ RSS image.url: ${imageUrl}`);
    } else if (payload?.enclosure?.url) {
        imageUrl = payload.enclosure.url;
        console.log(`  ✓ RSS enclosure: ${imageUrl}`);
    } else {
        console.log("  ℹ️  RSS'de görsel yok");
    }

    console.log();

    // 4. Veritabanına yaz
    console.log("💾 Veritabanına yazılıyor...");
    const inserted = await db.insert(processedArticles).values({
        original_news_id: article.id,
        title: result.title,
        summary: result.summary,
        category: result.category,
        image_url: imageUrl,
        source_name: article.source_name || "Unknown",
        published_at: article.published_at || new Date().toISOString(),
        is_published: true
    }).returning();

    console.log("✅ BAŞARILI!");
    console.log(`  ID: ${inserted[0].id}`);
    console.log(`  Görsel: ${inserted[0].image_url || 'YOK'}\n`);

    // 5. Doğrula
    console.log("🔍 Doğrulanıyor...");
    const check = await db.select().from(processedArticles).limit(10);
    console.log(`  Toplam kayıt: ${check.length}`);
}

manualProcess().catch(console.error);
