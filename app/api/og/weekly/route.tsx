
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Dynamic params
        const title = searchParams.get('title') || 'Haftalık Özet';
        const week = searchParams.get('week') || '';
        const date = searchParams.get('date') || '';

        // Font loading
        const fontData = await fetch(
            new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff', import.meta.url)
        ).then((res) => res.arrayBuffer());

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        backgroundColor: '#18181b', // zinc-900
                        padding: '80px',
                        fontFamily: '"Inter"', // Must match the name in fonts config
                        position: 'relative',
                    }}
                >
                    {/* Background Gradients */}
                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-20%',
                        width: '800px',
                        height: '800px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)', // red-600 with opacity
                    }} />

                    <div style={{
                        position: 'absolute',
                        bottom: '-20%',
                        left: '-20%',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', // blue-500
                    }} />

                    {/* Logo / Brand */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '40px',
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#dc2626', // red-600
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            fontWeight: 900,
                            borderRadius: '8px',
                        }}>
                            D
                        </div>
                        <span style={{ fontSize: '32px', fontWeight: 700, color: '#f4f4f5' }}>D4ily</span>
                    </div>

                    {/* Tag */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        padding: '8px 24px',
                        borderRadius: '100px',
                        marginBottom: '32px',
                    }}>
                        <span style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#a1a1aa',
                            marginRight: '12px',
                        }}>Haftalık Bülten</span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#52525b', marginRight: '12px' }} />
                        <span style={{
                            fontSize: '20px',
                            color: '#d4d4d8',
                        }}>{week ? `Hafta ${week}` : 'Gündem Analizi'}</span>
                    </div>

                    {/* Title */}
                    <div style={{
                        fontSize: '64px',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        color: 'white',
                        marginBottom: '40px',
                        maxWidth: '900px',
                        textWrap: 'balance',
                    }}>
                        {title}
                    </div>

                    {/* Date Range */}
                    {date && (
                        <div style={{
                            fontSize: '28px',
                            color: '#a1a1aa',
                            fontWeight: 500,
                        }}>
                            {date}
                        </div>
                    )}

                    {/* Footer Hashtags */}
                    <div style={{
                        position: 'absolute',
                        bottom: '60px',
                        left: '80px',
                        display: 'flex',
                        gap: '24px',
                        fontSize: '20px',
                        color: '#52525b',
                        fontWeight: 600,
                    }}>
                        <span>#D4ily</span>
                        <span>#GündemOkumaları</span>
                        <span>#HaftalıkÖzet</span>
                    </div>

                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'Inter',
                        data: fontData,
                        style: 'normal',
                        weight: 700,
                    },
                ],
            },
        );
    } catch (e: any) {
        console.error(e.message);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
