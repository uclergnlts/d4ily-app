"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        cover_image_url: "",
        topic_id: "",
        published: false
    });

    useEffect(() => {
        fetch("/api/blog/topics")
            .then(res => res.json())
            .then(data => setTopics(data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        // Auto-generate slug from title
        if (name === "title") {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9ğüşıöç]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/blog/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    topic_id: formData.topic_id ? Number(formData.topic_id) : null
                })
            });

            if (res.ok) {
                router.push("/admin/blog");
            } else {
                alert("Hata oluştu.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-bold">Yeni Yazı Oluştur</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Başlık</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">URL (Slug)</label>
                        <input
                            type="text"
                            name="slug"
                            required
                            className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.slug}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Konu</label>
                        <div className="flex gap-2">
                            <select
                                name="topic_id"
                                className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.topic_id}
                                onChange={handleChange}
                            >
                                <option value="">Seçiniz...</option>
                                {topics.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={async () => {
                                    const topicName = prompt("Hangi konu hakkında yazı oluşturulsun?");
                                    if (!topicName) return;

                                    setLoading(true);
                                    try {
                                        const res = await fetch("/api/blog/generate", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                topic: topicName,
                                                topic_id: formData.topic_id ? Number(formData.topic_id) : undefined
                                            })
                                        });
                                        const data = await res.json();

                                        if (res.ok) {
                                            alert("Yazı başarıyla oluşturuldu! Düzenleme sayfasına yönlendiriliyorsunuz.");
                                            // The service saves to DB, so we redirect to edit page of the new post
                                            router.push(`/admin/blog/edit/${data.data.slug}`);
                                        } else {
                                            alert("Hata: " + data.error);
                                        }
                                    } catch (e) {
                                        alert("Bir hata oluştu.");
                                        console.error(e);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="whitespace-nowrap bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm flex items-center gap-2"
                            >
                                ✨ AI ile Üret
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Kapak Görsel URL</label>
                        <input
                            type="url"
                            name="cover_image_url"
                            className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.cover_image_url}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Özet (Meta Description)</label>
                    <textarea
                        name="excerpt"
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.excerpt}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">İçerik (Markdown)</label>
                    <textarea
                        name="content"
                        required
                        rows={15}
                        className="w-full border border-gray-200 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.content}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-center gap-3 py-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="published"
                            checked={formData.published}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Yazıyı Yayınla</span>
                    </label>

                    <div className="flex-1" />

                    <Link
                        href="/admin/blog"
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        İptal
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>
            </form>
        </div>
    );
}
