import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const task = process.argv[2];

if (!task) {
  console.error("Usage: node scripts/run-cron-task.mjs <fetch-news|fetch-tweets|process-news>");
  process.exit(1);
}

const tasks = {
  "fetch-news": async () => {
    const { runFetchNews } = await import("../lib/crons.ts");
    return runFetchNews();
  },
  "fetch-tweets": async () => {
    const { runFetchTweets } = await import("../lib/crons.ts");
    return runFetchTweets();
  },
  "process-news": async () => {
    const { processLatestNews } = await import("../lib/services/news-processor.ts");
    await processLatestNews(10);
    return { success: true };
  },
};

const handler = tasks[task];
if (!handler) {
  console.error(`Unknown task: ${task}`);
  process.exit(1);
}

const result = await handler();
console.log(JSON.stringify(result, null, 2));
