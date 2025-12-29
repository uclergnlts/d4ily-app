
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "@/lib/db";
import { dailyDigests, blogGenerationLogs, blogPosts } from "@/lib/db/schema";
import { desc, eq, and, gt } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateBlogPostFromTopic } from "@/lib/services/blog-generator";
import path from "path";
import fs from "fs/promises";

// Mocking the route logic
async function loadPrompt(role: string): Promise<string> {
    try {
        const filePath = path.join(process.cwd(), "lib", "ai", "subagents", `${role}.md`);
        return await fs.readFile(filePath, "utf-8");
    } catch (error) {
        console.error(`Error loading prompt for ${role}:`, error);
        throw new Error(`Subagent prompt not found: ${role}`);
    }
}

async function main() {
    console.log("🚀 Starting Manual Auto-Blog Trigger...");

    try {
        // 1. Fetch Agenda Data (Last 7 days)
        console.log("📊 Fetching recent digests...");
        const recentDigests = await db.select()
            .from(dailyDigests)
            .orderBy(desc(dailyDigests.digest_date))
            .limit(7);

        let effectiveDigests = recentDigests;
        if (recentDigests.length === 0) {
            console.log("⚠️ No digests found in DB. Using MOCK data for testing...");
            effectiveDigests = [
                {
                    digest_date: new Date().toISOString(),
                    title: "Mock Digest: Economy & Tech",
                    intro: "Today's summary covers inflation rates and new AI models.",
                    content: "Inflation is rising in Turkey. Meanwhile, Google released Gemini 2.5 which is faster. Tech stocks are up. Minimum wage discussions are heating up."
                } as any
            ];
        } else {
            console.log(`✅ Found ${recentDigests.length} digests.`);
        }

        const digestText = effectiveDigests.map(d =>
            `Date: ${d.digest_date}\nTitle: ${d.title}\nIntro: ${d.intro}\nTopics: ${d.content.slice(0, 500)}...`
        ).join("\n\n---\n\n");

        // 2. Fetch Recent Blog Titles
        console.log("📚 Fetching recent blog titles...");
        const recentBlogs = await db.select({ title: blogPosts.title })
            .from(blogPosts)
            .orderBy(desc(blogPosts.created_at))
            .limit(30);

        const recentBlogTitles = recentBlogs.map(b => b.title).join(", ");
        console.log(`✅ Found ${recentBlogs.length} recent blogs.`);

        // 3. Run Topic Extractor (AI)
        console.log("🤖 Running Topic Extractor (Gemini)...");
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY Missing");

        const genAI = new GoogleGenerativeAI(apiKey.trim());
        // Using the verified model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const promptTemplate = await loadPrompt("topic-extractor");
        const finalPrompt = promptTemplate
            .replace("{daily_digest_text}", digestText.slice(0, 10000))
            .replace("{trending_topics}", "Check DB trends if available")
            .replace("{recent_blog_titles}", recentBlogTitles)
            .replace("{banned_topics}", "None");

        const aiResult = await model.generateContent(finalPrompt);
        const textResponse = aiResult.response.text();
        const jsonString = textResponse.replace(/^```json\s*|\s*```$/g, "").trim();
        const analysis = JSON.parse(jsonString);

        const candidate = analysis.best_pick;
        console.log("✨ Best Pick:", candidate);

        if (!candidate) {
            console.log("⚠️ No candidate found.");
            return;
        }

        // 4. Verification Check
        // Skipping strictly for manual test to allow re-runs or just log warning
        console.log("🔍 Checking for duplicates (Warning only for this script)...");
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const duplicateCheck = await db.select()
            .from(blogGenerationLogs)
            .where(and(
                eq(blogGenerationLogs.selected_topic, candidate.topic_title),
                gt(blogGenerationLogs.run_date, thirtyDaysAgo.toISOString())
            ))
            .limit(1);

        if (duplicateCheck.length > 0) {
            console.warn("⚠️ Duplicate topic detected in last 30 days. Continuing anyway for TEST.");
        }

        // 5. Generate Blog Post
        console.log("📝 Generating Blog Post...");
        const generatedPost = await generateBlogPostFromTopic(candidate.topic_title);

        console.log("🎉 SUCCESS! Created Post:", generatedPost.slug);

    } catch (error: any) {
        console.error("❌ Error:", error);
    }
}

main();
