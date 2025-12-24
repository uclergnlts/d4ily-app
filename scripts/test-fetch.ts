
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function test() {
    // Dynamic import to handle env loading first
    const { fetchUserTweets } = await import('../lib/twitter');

    const username = "pusholder"; // Active news account
    console.log(`Testing fetch for ${username}...`);

    try {
        const tweets = await fetchUserTweets(username);
        console.log(`✅ Success! Found ${tweets.length} tweets.`);
        if (tweets.length > 0) {
            console.log("Sample Tweet 1:", tweets[0].text?.substring(0, 50));
            console.log("Date:", tweets[0].createdAt);
        }
    } catch (e: any) {
        console.error("❌ Failed:", e.message);
    }
}

test();
