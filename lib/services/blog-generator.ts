
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { blogPosts, topics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Initialize Gemini lazily
function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY missing");
    return new GoogleGenerativeAI(apiKey.trim());
}

function getJsonModel() {
    return getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });
}

function getTextModel() {
    return getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });
}

async function loadPrompt(role: string): Promise<string> {
    try {
        const filePath = path.join(process.cwd(), "lib", "ai", "subagents", `${role}.md`);
        return await fs.readFile(filePath, "utf-8");
    } catch (error) {
        console.error(`Error loading prompt for ${role}:`, error);
        throw new Error(`Subagent prompt not found: ${role}`);
    }
}

interface BlogPostGenerationResult {
    post_id: number;
    title: string;
    slug: string;
    seo_score: number;
}

// Helper to clean JSON
function cleanJson(text: string): string {
    return text.replace(/^```json\s*|\s*```$/g, "").trim();
}

function safeJsonParse(text: string, context: string): any {
    try {
        const cleaned = cleanJson(text);
        return JSON.parse(cleaned);
    } catch (e) {
        console.error(`JSON Parse Error in ${context}:`, e);
        console.error(`Raw AI Response (${context}):`, text);
        throw new Error(`Failed to parse AI response for ${context}`);
    }
}

export async function generateBlogPostFromTopic(topicName: string, topicId?: number): Promise<BlogPostGenerationResult> {
    console.log(`🚀 Starting Blog Generation Pipeline for: "${topicName}"`);

    // 1. SEO STRATEGIST
    console.log("🤖 1. SEO Strategist is thinking...");
    const strategistPrompt = await loadPrompt("seo-strategist");
    const strategyResult = await getJsonModel().generateContent(
        strategistPrompt
            .replace("{topic}", topicName)
            .replace("{trends_context}", "Current high inflation in Turkey, Minimum wage discussions, Election aftermath") // Context can be dynamic later
    );
    const strategy = safeJsonParse(strategyResult.response.text(), "SEO Strategist");
    console.log("✅ Strategy defined:", strategy.content_angle);

    // 2. KEYWORD RESEARCHER
    console.log("🤖 2. Keyword Researcher is digging...");
    const researcherPrompt = await loadPrompt("keyword-researcher");
    const researchResult = await getJsonModel().generateContent(
        researcherPrompt
            .replace("{primary_keyword}", strategy.primary_keyword)
            .replace("{content_angle}", strategy.content_angle)
    );
    const keywords = safeJsonParse(researchResult.response.text(), "Keyword Researcher");
    console.log("✅ Keywords found:", keywords.clustered_keywords.length, "clusters");

    // 3. CONTENT BRIEF CREATOR
    console.log("🤖 3. Creating Content Brief...");
    const briefPrompt = await loadPrompt("content-brief-creator");
    const briefResult = await getTextModel().generateContent(
        briefPrompt
            .replace("{strategy_json}", JSON.stringify(strategy))
            .replace("{keywords_json}", JSON.stringify(keywords))
    );
    const brief = briefResult.response.text();
    console.log("✅ Brief created.");

    // 4. CONTENT WRITER
    console.log("🤖 4. Writing Content (This may take a while)...");
    const writerPrompt = await loadPrompt("content-writer");
    const draftResult = await getTextModel().generateContent(
        writerPrompt.replace("{content_brief}", brief)
    );
    const draftContent = draftResult.response.text();
    console.log("✅ Draft written (Length: " + draftContent.length + " chars)");

    // 5. EDITORIAL CHECKER
    console.log("🤖 5. Editorial Check...");
    const editorPrompt = await loadPrompt("editorial-quality-checker");
    const editResult = await getJsonModel().generateContent(
        editorPrompt.replace("{draft_content}", draftContent)
    );
    const critique = safeJsonParse(editResult.response.text(), "Editorial Checker");
    console.log(`✅ Editorial Score: ${critique.score}/100`);

    // 6. SCHEMA ARCHITECT
    console.log("🤖 6. Generating Schema...");
    const schemaPrompt = await loadPrompt("schema-architect");
    const schemaResult = await getJsonModel().generateContent(
        schemaPrompt
            .replace("{content_markdown}", draftContent.substring(0, 10000)) // Truncate to save tokens if huge
            .replace("{title}", strategy.title || topicName) // Fallback if title not explicitly separate
            .replace("{description}", strategy.target_persona)
            .replace("{author}", "D4ily AI")
    );
    const schemaJson = schemaResult.response.text();


    // 7. SAVE TO DB
    console.log("💾 Saving to Database...");

    // Generate slug
    const slug = strategy.primary_keyword
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Insert
    const newPost = await db.insert(blogPosts).values({
        title: topicName + ": " + strategy.content_angle, // Temporary title construction
        slug: slug + "-" + Date.now().toString().substring(0, 4), // Ensure uniqueness
        content: draftContent,
        excerpt: `Targeting: ${strategy.target_persona}. Intent: ${strategy.user_intent}.`,
        seo_score: critique.score,
        published: false, // Draft mode
        topic_id: topicId,
        tags: JSON.stringify(strategy.secondary_keywords),
        meta_title: strategy.primary_keyword,
        meta_description: "Generated by D4ily AI Agent",
    }).returning();

    console.log("🎉 Post Generated Successfully!", newPost[0].slug);

    return {
        post_id: newPost[0].id,
        title: newPost[0].title,
        slug: newPost[0].slug,
        seo_score: newPost[0].seo_score || 0
    };
}
