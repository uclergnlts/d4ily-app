import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF'
            }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({
                success: false,
                error: 'File too large. Max size: 5MB'
            }, { status: 400 });
        }

        // Convert to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const ext = file.name.split('.').pop();
        const filename = `cover-${timestamp}.${ext}`;

        // Save to public/uploads directory
        const fs = require('fs');
        const path = require('path');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);

        // Return the public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            url,
            filename
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
