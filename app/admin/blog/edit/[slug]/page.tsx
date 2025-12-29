
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
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
        // Fetch topics
        fetch("/api/blog/topics")
            .then(res => res.json())
            .then(data => setTopics(data))
            .catch(err => console.error(err));

        // Fetch post data
        if (slug) {
            fetch(`/api/blog/posts/${slug}`)
                .then(res => {
                    if (!res.ok) throw new Error("Post not found");
                    return res.json();
                })
                .then(data => {
                    setFormData({
                        title: data.title || "",
                        slug: data.slug || "",
                        excerpt: data.excerpt || "",
                        content: data.content || "",
                        cover_image_url: data.cover_image_url || "",
                        topic_id: data.topic_id || "",
                        published: data.published === 1 || data.published === true
                    });
                    setFetching(false);
                })
                .catch(err => {
                    console.error(err);
                    alert("Yazı bulunamadı.");
                    router.push("/admin/blog");
                });
        }
    }, [slug, router]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/blog/posts/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    topic_id: formData.topic_id ? Number(formData.topic_id) : null,
                    published: formData.published ? true : false
                })
            });

            if (res.ok) {
                alert("Başarıyla güncellendi.");
                // If slug changed, redirect to new edit url
                if (formData.slug !== slug) {
                    router.push(`/admin/blog/edit/${formData.slug}`);
                }
            } else {
                const err = await res.json();
                alert("Hata: " + (err.error || "Bilinmeyen hata"));
            }
        } catch (error) {
            console.error(error);
            alert("Kaydetme başarısız.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/blog/posts/${slug}`, {
                method: "DELETE"
            });

            if (res.ok) {
                router.push("/admin/blog");
            } else {
                alert("Silme başarısız.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (fetching) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold">Yazıyı Düzenle</h1>

                    {/* View Live Button */}
                    <a
                        href={`/blog/${formData.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Görüntüle
                    </a>
                </div>

                <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
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
                        <p className="text-xs text-amber-600">Dikkat: URL&apos;i değiştirmek SEO kaybına yol açabilir.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Konu</label>
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
                        rows={20}
                        className="w-full border border-gray-200 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.content}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-center gap-3 py-4 border-t border-gray-100 sticky bottom-0 bg-white/90 backdrop-blur-sm z-10 shadow-lg -mx-6 px-6 -mb-6 pb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="published"
                            checked={formData.published}
                            onChange={handleChange}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-base font-semibold text-gray-900">Yazıyı Yayınla</span>
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
                        className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </button>
                </div>
            </form>
        </div>
    );
}
