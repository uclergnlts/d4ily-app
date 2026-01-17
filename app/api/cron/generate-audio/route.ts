import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dailyDigests } from '@/lib/db/schema';
import { eq, desc, and, or, isNull } from 'drizzle-orm';
import { generateDigestAudio, TTSVoice } from '@/lib/tts';
import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Allow up to 2 minutes for audio generation

export async function GET(request: Request) {
    const stepLogs: string[] = [];

    try {
        // Auth check
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        stepLogs.push("Step 1: Finding digest that needs audio generation");

        // Find the most recent digest that has audio_status='pending' or null
        const pendingDigest = await db
            .select()
            .from(dailyDigests)
            .where(
                or(
                    eq(dailyDigests.audio_status, 'pending'),
                    isNull(dailyDigests.audio_status)
                )
            )
            .orderBy(desc(dailyDigests.digest_date))
            .limit(1)
            .get();

        if (!pendingDigest) {
            return NextResponse.json({
                success: true,
                message: "No pending digests for audio generation",
                skipped: true
            });
        }

        stepLogs.push(`Step 1 complete: Found digest for ${pendingDigest.digest_date}`);

        // Check if digest has content
        if (!pendingDigest.content || !pendingDigest.intro) {
            stepLogs.push("Skipping: Digest has no content or intro");
            return NextResponse.json({
                success: true,
                message: "Digest has no content",
                skipped: true,
                logs: stepLogs
            });
        }

        // Mark as processing
        stepLogs.push("Step 2: Marking digest as processing");
        await db.update(dailyDigests)
            .set({ audio_status: 'processing' })
            .where(eq(dailyDigests.id, pendingDigest.id));

        // Generate audio
        stepLogs.push("Step 3: Generating audio with OpenAI TTS");
        const voice: TTSVoice = (pendingDigest.audio_voice as TTSVoice) || 'nova';

        const { audioBuffer, durationSeconds } = await generateDigestAudio(
            pendingDigest.intro,
            pendingDigest.content,
            voice
        );
        stepLogs.push(`Step 3 complete: Generated ${durationSeconds}s of audio`);

        // Upload to Vercel Blob
        stepLogs.push("Step 4: Uploading to Vercel Blob");
        const filename = `audio/digest-${pendingDigest.digest_date}.mp3`;

        const blob = await put(filename, audioBuffer, {
            access: 'public',
            contentType: 'audio/mpeg',
        });
        stepLogs.push(`Step 4 complete: Uploaded to ${blob.url}`);

        // Update database with audio URL
        stepLogs.push("Step 5: Updating database");
        await db.update(dailyDigests)
            .set({
                audio_url: blob.url,
                audio_status: 'ready',
                audio_duration: durationSeconds,
                audio_voice: voice,
            })
            .where(eq(dailyDigests.id, pendingDigest.id));
        stepLogs.push("Step 5 complete: Database updated");

        console.log(`Audio generated for ${pendingDigest.digest_date}: ${blob.url}`);

        return NextResponse.json({
            success: true,
            date: pendingDigest.digest_date,
            audioUrl: blob.url,
            durationSeconds,
            logs: stepLogs
        });

    } catch (error: any) {
        console.error("Audio generation failed:", error);

        // Try to mark as failed if we have a digest ID
        try {
            const lastLog = stepLogs[stepLogs.length - 1] || '';
            if (lastLog.includes('digest for')) {
                // Extract date and update status
                // This is best-effort cleanup
            }
        } catch { }

        return NextResponse.json({
            success: false,
            error: error.message,
            logs: stepLogs
        }, { status: 500 });
    }
}
