import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function testTwitterAPI() {
    const { fetchUserTweets } = await import("@/lib/twitter");

    console.log("Testing Twitter API with single user...");
    console.log("API Key exists:", !!process.env.TWITTER_API_KEY);

    try {
        const username = "eczozgurozel"; // Known working account
        console.log(`Fetching tweets for: ${username}`);

        const tweets = await fetchUserTweets(username);
        console.log(`✅ Success! Fetched ${tweets.length} tweets`);

        if (tweets.length > 0) {
            console.log("\nFirst tweet:");
            console.log("- ID:", tweets[0].id);
            console.log("- Text:", tweets[0].text?.substring(0, 100));
            console.log("- Author:", tweets[0].author?.name);
        }
    } catch (error: any) {
        console.error("❌ Error:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
    }
}

testTwitterAPI();
