import OpenAI from 'openai';

// Lazy initialization
let _openai: OpenAI | null = null;

function getOpenAI() {
    if (!_openai) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY is not defined in environment variables");
        }
        _openai = new OpenAI({ apiKey });
    }
    return _openai;
}

// Available voices: alloy, echo, fable, onyx, nova, shimmer
// For Turkish: 'nova' or 'shimmer' sound more natural
export type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface TTSResult {
    audioBuffer: Buffer;
    durationSeconds: number;
}

/**
 * Clean markdown text for TTS - remove formatting that doesn't translate well to speech
 */
export function cleanTextForTTS(markdown: string): string {
    let text = markdown;

    // Remove markdown headers (##, ###, etc.)
    text = text.replace(/^#{1,6}\s+/gm, '');

    // Remove bold/italic markers
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    text = text.replace(/\*([^*]+)\*/g, '$1');
    text = text.replace(/__([^_]+)__/g, '$1');
    text = text.replace(/_([^_]+)_/g, '$1');

    // Remove markdown links, keep text: [text](url) -> text
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Remove horizontal rules
    text = text.replace(/^---+$/gm, '');
    text = text.replace(/^\*\*\*+$/gm, '');

    // Remove bullet points but keep the text
    text = text.replace(/^[\s]*[-*+]\s+/gm, '');

    // Remove emojis (they don't read well)
    text = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');

    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`[^`]+`/g, '');

    // Clean up multiple newlines
    text = text.replace(/\n{3,}/g, '\n\n');

    // Trim whitespace
    text = text.trim();

    return text;
}

/**
 * Generate audio from text using OpenAI TTS API
 * @param text - The text to convert to speech
 * @param voice - The voice to use (default: nova)
 * @returns Buffer containing MP3 audio data
 */
export async function generateAudio(
    text: string,
    voice: TTSVoice = 'nova'
): Promise<TTSResult> {
    const openai = getOpenAI();

    // OpenAI TTS has a 4096 character limit per request
    // For longer texts, we need to split and concatenate
    const maxChars = 4000;

    if (text.length <= maxChars) {
        // Single request
        const response = await openai.audio.speech.create({
            model: 'tts-1',
            voice: voice,
            input: text,
            response_format: 'mp3',
        });

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Estimate duration: ~150 words per minute, ~5 chars per word
        const estimatedWords = text.length / 5;
        const durationSeconds = Math.round((estimatedWords / 150) * 60);

        return { audioBuffer: buffer, durationSeconds };
    }

    // For longer texts, split into chunks
    const chunks = splitTextIntoChunks(text, maxChars);
    const audioBuffers: Buffer[] = [];
    let totalDuration = 0;

    for (const chunk of chunks) {
        const response = await openai.audio.speech.create({
            model: 'tts-1',
            voice: voice,
            input: chunk,
            response_format: 'mp3',
        });

        const arrayBuffer = await response.arrayBuffer();
        audioBuffers.push(Buffer.from(arrayBuffer));

        // Estimate duration for this chunk
        const estimatedWords = chunk.length / 5;
        totalDuration += Math.round((estimatedWords / 150) * 60);
    }

    // Concatenate MP3 buffers (simple concatenation works for MP3)
    const combinedBuffer = Buffer.concat(audioBuffers);

    return { audioBuffer: combinedBuffer, durationSeconds: totalDuration };
}

/**
 * Split text into chunks at sentence boundaries
 */
function splitTextIntoChunks(text: string, maxLength: number): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= maxLength) {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
        } else {
            if (currentChunk) {
                chunks.push(currentChunk);
            }
            // If a single sentence is too long, just add it as is
            currentChunk = sentence;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}

/**
 * Generate a complete digest audio from intro and content
 */
export async function generateDigestAudio(
    intro: string,
    content: string,
    voice: TTSVoice = 'nova'
): Promise<TTSResult> {
    // Combine intro and content
    const fullText = `${intro}\n\n${content}`;

    // Clean for TTS
    const cleanedText = cleanTextForTTS(fullText);

    console.log(`Generating TTS for ${cleanedText.length} characters...`);

    return generateAudio(cleanedText, voice);
}
