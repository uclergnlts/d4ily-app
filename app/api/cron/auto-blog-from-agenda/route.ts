
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyDigests, blogGenerationLogs, blogPosts } from "@/lib/db/schema";
import { desc, eq, and, gt } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateBlogPostFromTopic } from "@/lib/services/blog-generator";
import path from "path";
import fs from "fs/promises";

export const maxDuration = 300; // 5 minutes timeout
export const dynamic = 'force-dynamic';

// Helper to load prompt
async function loadPrompt(role: string): Promise<string> {
    try {
        const filePath = path.join(process.cwd(), "lib", "ai", "subagents", `${role}.md`);
        return await fs.readFile(filePath, "utf-8");
    } catch (error) {
        console.error(`Error loading prompt for ${role}:`, error);
        throw new Error(`Subagent prompt not found: ${role}`);
    }
}

function formatDateForSqlite(date: Date): string {
    // Align with SQLite CURRENT_TIMESTAMP format (YYYY-MM-DD HH:MM:SS)
    return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function POST(request: Request) {
    try {
        // Auth Check
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (authHeader !== `Bearer ${cronSecret}`) {
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        // 1. Fetch Agenda Data (Last 7 days)
        const recentDigests = await db.select()
            .from(dailyDigests)
            .orderBy(desc(dailyDigests.digest_date))
            .limit(7);

        if (recentDigests.length === 0) {
            return NextResponse.json({ message: "No digests found to analyze." });
        }

        const digestText = recentDigests.map(d =>
            `Date: ${d.digest_date}\nTitle: ${d.title}\nIntro: ${d.intro}\nTopics: ${d.content.slice(0, 500)}...`
        ).join("\n\n---\n\n");

        // 2. Fetch Recent Blog Titles
        const recentBlogs = await db.select({ title: blogPosts.title })
            .from(blogPosts)
            .orderBy(desc(blogPosts.created_at))
            .limit(30);

        const recentBlogTitles = recentBlogs.map(b => b.title).join(", ");

        // 3. Run Topic Extractor (AI)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY Missing");

        const genAI = new GoogleGenerativeAI(apiKey.trim());
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

        let analysis: any;
        try {
            analysis = JSON.parse(jsonString);
        } catch (e) {
            console.error("JSON Parse Error in Auto-Blog Route:", e);
            console.error("Raw AI Response:", textResponse);
            throw new Error("Failed to parse AI response for topic extraction.");
        }

        const candidate = analysis.best_pick;

        if (!candidate) {
            await db.insert(blogGenerationLogs).values({
                selected_topic: "None",
                result: "skipped",
                reason: "no_candidate_found"
            });
            return NextResponse.json({ message: "No valid candidate found by AI." });
        }

        // 4. Verification Check
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoSql = formatDateForSqlite(thirtyDaysAgo);

        const duplicateCheck = await db.select()
            .from(blogGenerationLogs)
            .where(and(
                eq(blogGenerationLogs.selected_topic, candidate.topic_title),
                gt(blogGenerationLogs.run_date, thirtyDaysAgoSql)
            ))
            .limit(1)
            .catch((err) => {
                console.error("Duplicate check failed, continuing without blocking:", err);
                return [] as typeof duplicateCheck;
            });

        if (duplicateCheck.length > 0) {
            await db.insert(blogGenerationLogs).values({
                selected_topic: candidate.topic_title,
                evergreen_score: candidate.scores.evergreen_score,
                result: "skipped",
                reason: "duplicate_log_30_days"
            });
            return NextResponse.json({ message: "Skipped: Duplicate topic in last 30 days." });
        }

        // 5. Generate Blog Post
        const generatedPost = await generateBlogPostFromTopic(candidate.topic_title);

        // 6. Log Success
        await db.insert(blogGenerationLogs).values({
            selected_topic: candidate.topic_title,
            cluster: candidate.primary_keyword,
            evergreen_score: candidate.scores.evergreen_score,
            result: "success",
            generated_post_id: generatedPost.post_id
        });

        return NextResponse.json({
            success: true,
            post_id: generatedPost.post_id,
            title: generatedPost.title,
            slug: generatedPost.slug
        });

    } catch (error: any) {
        console.error("Auto-Blog Cron Error:", error);

        // DIAGNOSTICS: Check DB connection details
        let dbDiagnostics = {};
        try {
            const tables = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table';`);
            dbDiagnostics = {
                connected_db_url: process.env.TURSO_DATABASE_URL ? "Defined (starts with " + process.env.TURSO_DATABASE_URL.substring(0, 10) + ")" : "UNDEFINED (Using local.db?)",
                visible_tables: tables.rows.map((r: any) => r.name)
            };
        } catch (diagError: any) {
            dbDiagnostics = { error: diagError.message };
        }

        // FORCE 200 OK to see error in GitHub Actions (curl --fail suppresses 500 body)
        return NextResponse.json({
            success: false,
            error: error.message || "Unknown error",
            stack: error.stack,
            diagnostics: dbDiagnostics
        }, { status: 200 });
    }
}
