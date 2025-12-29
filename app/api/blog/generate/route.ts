
import { NextResponse } from "next/server";
import { generateBlogPostFromTopic } from "@/lib/services/blog-generator";

export const maxDuration = 300; // Allow 5 minutes for generation

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { topic, topicId } = body;

        if (!topic) {
            return NextResponse.json(
                { error: "Topic is required" },
                { status: 400 }
            );
        }

        console.log(`API: Starting generation for topic: ${topic}`);

        // Call the service
        // Note: The service currently saves to DB immediately. 
        // For better UX in "New Post" page, we might ideally want it to return the data WITHOUT saving, 
        // so the user can review in the form. 
        // However, `generateBlogPostFromTopic` saves it. 
        // Let's use the service as is for now, it returns the created post ID.
        // We can then return the full post data to the frontend to redirect or fill.

        const result = await generateBlogPostFromTopic(topic, topicId);

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error: any) {
        console.error("API Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate post" },
            { status: 500 }
        );
    }
}
