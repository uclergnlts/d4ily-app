import { GOOGLE_IMG_SCRAP } from 'google-img-scrap';

// Blocked domains that usually have text-heavy or logo-heavy images
const BLOCKED_DOMAINS = [
    'ahaber.com.tr',
    'sabah.com.tr',
    'takvim.com.tr',
    'yeniakit.com.tr',
    'fotomac.com.tr',
    'fanatik.com.tr',
    'youtube.com',
    'facebook.com',
    'dailymotion.com'
];

export async function fetchGoogleImage(query: string): Promise<string | null> {
    try {
        // Add negative keywords to avoid text/logos
        const refinedQuery = `${query} -logo -text`;
        console.log(`Fetching image for: ${refinedQuery}`);

        const result = await GOOGLE_IMG_SCRAP({
            search: refinedQuery,
            limit: 15, // Fetch more to allow filtering
            safeSearch: true,
        });

        if (result && result.result && result.result.length > 0) {
            // Filter results
            const validImage = result.result.find((item: any) => {
                const url = item.url;
                if (!url) return false;

                // Check extension
                if (!url.match(/\.(jpeg|jpg|png|webp)$/i)) return false;

                // Check blocked domains
                if (BLOCKED_DOMAINS.some(domain => url.includes(domain))) return false;

                return true;
            });

            if (validImage) {
                console.log('Image found:', validImage.url);
                return validImage.url;
            }

            // Fallback: try first result if nothing passes strict filter, but still avoid youtube
            const fallback = result.result.find((item: any) => item.url && !item.url.includes('youtube') && !item.url.includes('ahaber'));
            if (fallback) {
                console.log('Fallback image:', fallback.url);
                return fallback.url;
            }
        }

        console.log('No image found for query.');
        return null;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}
