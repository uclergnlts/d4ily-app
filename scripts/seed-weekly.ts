
import { db } from "../lib/db";
import { weeklyDigests } from "../lib/db/schema";
import { getCurrentWeekInfo } from "../lib/digest-data";

async function seedWeekly() {
    const { weekId, year, weekNumber, startDate, endDate } = getCurrentWeekInfo();
    console.log(`Seeding weekly digest for ${weekId}...`);

    try {
        await db.insert(weeklyDigests).values({
            week_id: weekId,
            year,
            week_number: weekNumber,
            start_date: startDate,
            end_date: endDate,
            title: "Haftalık Özet Test Başlığı",
            intro: "Bu bir test özetidir. Sistem kontrolü için oluşturulmuştur.",
            content: "Test içeriği burada yer almaktadır. Gündem maddeleri ve analizler...",
            highlights: JSON.stringify([{ category: "Genel", items: ["Test maddesi 1", "Test maddesi 2"] }]),
            trends: JSON.stringify(["Test", "Debug"]),
            digests_count: 5,
            tweets_count: 100,
            news_count: 50,
            model_name: "test-script",
            status: "generated"
        }).onConflictDoUpdate({
            target: [weeklyDigests.week_id],
            set: {
                title: "Haftalık Özet Test Başlığı (Güncellendi)",
                updated_at: new Date().toISOString()
            }
        });
        console.log("✅ Weekly digest seeded successfully.");
    } catch (error: any) {
        console.error("❌ Failed to seed weekly digest:", error.message);
    }
}

seedWeekly().catch(console.error);
