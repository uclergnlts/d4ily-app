import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email || !EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Geçersiz e-posta adresi.' },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const existingSubscriber = await db
            .select()
            .from(subscribers)
            .where(eq(subscribers.email, email))
            .limit(1);

        if (existingSubscriber.length > 0) {
            // If inactive, reactivate
            if (!existingSubscriber[0].is_active) {
                await db
                    .update(subscribers)
                    .set({ is_active: true, unsubscribed_at: null })
                    .where(eq(subscribers.email, email));

                return NextResponse.json({
                    success: true,
                    message: 'Aboneliğiniz tekrar aktif edildi! 🎉'
                });
            }

            return NextResponse.json({
                success: true,
                message: 'Zaten bültenimize abonesiniz! 🚀'
            });
        }

        // Add new subscriber
        await db.insert(subscribers).values({
            email,
            is_active: true,
            source: 'website',
        });

        return NextResponse.json({
            success: true,
            message: 'Abonelik başarılı! Hoşgeldiniz 🎉'
        });

    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { success: false, message: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
            { status: 500 }
        );
    }
}
