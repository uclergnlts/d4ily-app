import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { generateBlogPostFromTopic } from "@/lib/services/blog-generator";

async function main() {
    const topic = process.argv[2];

    if (!topic) {
        console.error("Please provide a topic name as an argument.");
        console.log("Usage: npx tsx scripts/generate-blog-post.ts \"Topic Name\"");
        process.exit(1);
    }

    try {
        console.log(`Starting generation for: ${topic}`);
        const result = await generateBlogPostFromTopic(topic);
        console.log("-----------------------------------");
        console.log("SUCCESS:");
        console.log(`ID: ${result.post_id}`);
        console.log(`Title: ${result.title}`);
        console.log(`Slug: ${result.slug}`);
        console.log(`Score: ${result.seo_score}`);
        console.log("-----------------------------------");
    } catch (error) {
        console.error("Failed to generate blog post:", error);
    }
}

main();
