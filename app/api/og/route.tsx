import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Dynamic params
        const title = searchParams.get('title') || 'Türkiye Gündem Özeti';
        const date = searchParams.get('date');

        // Format date if provided, otherwise use current date explanation or generic text
        const dateDisplay = date
            ? new Date(date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Günlük Haber Özeti';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        backgroundColor: '#0f172a', // Slate-900
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #334155 2%, transparent 0%), radial-gradient(circle at 75px 75px, #334155 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        padding: '40px 60px',
                        color: 'white',
                        fontFamily: '"Inter", sans-serif',
                    }}
                >
                    {/* Header with Logo/Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            backgroundColor: '#2563eb', // Blue-600
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold'
                        }}>
                            D4
                        </div>
                        <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#e2e8f0' }}>D4ily</span>
                    </div>

                    {/* Main Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
                        {date && (
                            <div style={{
                                fontSize: '24px',
                                color: '#60a5fa', // Blue-400
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                padding: '8px 20px',
                                borderRadius: '100px',
                                alignSelf: 'flex-start'
                            }}>
                                {dateDisplay}
                            </div>
                        )}
                        <div style={{
                            fontSize: '60px',
                            fontWeight: 900,
                            lineHeight: 1.1,
                            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}>
                            {title}
                        </div>
                        <div style={{ fontSize: '28px', color: '#94a3b8', maxWidth: '800px', lineHeight: 1.4 }}>
                            5 dakikada Türkiye gündemine hakim olun. Siyaset, Ekonomi, Spor ve daha fazlası.
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '2px solid #334155',
                        paddingTop: '30px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '24px', color: '#cbd5e1' }}>d4ily.com</span>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '24px', color: '#64748b' }}>
                            <span>@d4ilytr</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
