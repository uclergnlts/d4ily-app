"use server";

import { db } from "@/lib/db";
import { processedArticles } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

const ITEMS_PER_PAGE = 12;

export async function getMoreNews(page: number) {
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const news = await db
        .select()
        .from(processedArticles)
        .where(eq(processedArticles.is_published, true))
        .orderBy(desc(processedArticles.processed_at))
        .limit(ITEMS_PER_PAGE)
        .offset(offset);

    return news;
}
