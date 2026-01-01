import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { contactMessages } from "@/lib/db/schema"
import { z } from "zod"

// Validation schema
const contactFormSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
    surname: z.string().min(2, "Soyisim en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    subject: z.string().min(1, "Lütfen bir konu seçiniz"),
    message: z.string().min(10, "Mesajınız en az 10 karakter olmalıdır"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Validate input
        const validatedData = contactFormSchema.safeParse(body)

        if (!validatedData.success) {
            return NextResponse.json(
                { error: "Geçersiz form verileri", details: validatedData.error.flatten() },
                { status: 400 }
            )
        }

        const { name, surname, email, subject, message } = validatedData.data

        // Save to database
        await db.insert(contactMessages).values({
            name,
            surname,
            email,
            subject,
            message,
        })

        return NextResponse.json(
            { success: true, message: "Mesajınız başarıyla iletildi." },
            { status: 200 }
        )
    } catch (error) {
        console.error("Contact form error:", error)
        return NextResponse.json(
            { error: "Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz." },
            { status: 500 }
        )
    }
}
