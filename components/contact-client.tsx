"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Mail, MapPin, MessageSquare, Send, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react"

export function ContactClient() {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' })

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setStatus({ type: null, message: '' })

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Bir hata oluştu')
            }

            setStatus({ type: 'success', message: 'Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.' })
            setFormData({ name: '', surname: '', email: '', subject: '', message: '' }) // Reset form
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Gönderim başarısız oldu.' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
            <Header />

            <main className="flex-grow pt-8 pb-16 md:pt-12 md:pb-24">
                {/* Hero Section */}
                <section className="relative mb-16 md:mb-24 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="container mx-auto px-4 max-w-5xl text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-6">
                            <MessageSquare className="h-3 w-3" />
                            İletişim
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 tracking-tight">
                            Bize Ulaşın
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Sorularınız, önerileriniz veya işbirliği teklifleriniz için sizi dinlemeye hazırız.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

                        {/* Contact Info & Socials */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-2xl font-bold font-serif mb-6">İletişim Kanalları</h2>
                                <p className="text-muted-foreground mb-8 leading-relaxed">
                                    D4ily hakkında merak ettikleriniz veya paylaşmak istedikleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz. En kısa sürede dönüş yapacağız.
                                </p>

                                <div className="space-y-6">
                                    <a
                                        href="mailto:info@d4ily.com"
                                        className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">E-posta</div>
                                            <div className="text-muted-foreground">info@d4ily.com</div>
                                            <div className="text-xs text-primary mt-2 flex items-center gap-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                Mail Gönder <ArrowRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </a>

                                    <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg mb-1">Konum</div>
                                            <div className="text-muted-foreground">İstanbul, Türkiye</div>
                                            <div className="text-xs text-muted-foreground mt-1">Dijital bir girişim olarak <br />dünyanın her yerindeyiz.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold font-serif mb-6">Sosyal Medya</h2>
                                <div className="flex gap-4">
                                    <a
                                        href="https://twitter.com/d4ilytr"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-black hover:text-white hover:border-black transition-all hover:-translate-y-1 shadow-sm"
                                        aria-label="Twitter (X)"
                                    >
                                        <Twitter className="h-6 w-6" />
                                    </a>
                                    <a
                                        href="https://instagram.com/d4ilytr"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all hover:-translate-y-1 shadow-sm"
                                        aria-label="Instagram"
                                    >
                                        <Instagram className="h-6 w-6" />
                                    </a>
                                    <a
                                        href="https://linkedin.com/company/d4ily"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all hover:-translate-y-1 shadow-sm"
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin className="h-6 w-6" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold font-serif mb-2">Bize Yazın</h2>
                            <p className="text-muted-foreground mb-8 text-sm">
                                Aşağıdaki formu doldurarak bize doğrudan mesaj gönderebilirsiniz.
                            </p>

                            {status.message && (
                                <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium ml-1">İsim</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            minLength={2}
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Adınız"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="surname" className="text-sm font-medium ml-1">Soyisim</label>
                                        <input
                                            type="text"
                                            id="surname"
                                            value={formData.surname}
                                            onChange={handleChange}
                                            required
                                            minLength={2}
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Soyadınız"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium ml-1">E-posta</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="ornek@domain.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium ml-1">Konu</label>
                                    <select
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="" disabled>Seçiniz</option>
                                        <option value="Genel Soru">Genel Soru</option>
                                        <option value="Geri Bildirim">Geri Bildirim</option>
                                        <option value="Basın & Medya">Basın & Medya</option>
                                        <option value="İşbirliği">İşbirliği</option>
                                        <option value="Hata Bildirimi">Hata Bildirimi</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium ml-1">Mesajınız</label>
                                    <textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        minLength={10}
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        placeholder="Mesajınızı buraya yazabilirsiniz..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span>Gönderiliyor...</span>
                                    ) : (
                                        <>
                                            <span>Gönder</span>
                                            <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    Göndererek KVKK aydınlatma metnini okuduğunuzu kabul edersiniz.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
