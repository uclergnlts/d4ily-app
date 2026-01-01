"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import NextImage from "next/image";
import {
    ArrowLeft, Save, Loader2, Upload, Link as LinkIcon,
    Image as ImageIcon, AlertCircle, CheckCircle
} from "lucide-react";

interface Digest {
    id: number;
    digest_date: string;
    title: string;
    intro: string;
    content: string;
    cover_image_url: string | null;
    category: string;
    greeting_text: string | null;
    published: boolean;
}

export default function EditDigestPage() {
    const params = useParams();
    const router = useRouter();
    const digestId = params.id as string;

    const [digest, setDigest] = useState<Digest | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [intro, setIntro] = useState("");
    const [content, setContent] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [category, setCategory] = useState("gundem");
    const [greetingText, setGreetingText] = useState("");
    const [published, setPublished] = useState(false);

    // Image upload mode
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');

    const fetchDigest = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/digest?id=${digestId}`);
            const data = await res.json();

            if (data.success && data.digest) {
                const d = data.digest;
                setDigest(d);
                setTitle(d.title || "");
                setIntro(d.intro || "");
                setContent(d.content || "");
                setCoverImageUrl(d.cover_image_url || "");
                setCategory(d.category || "gundem");
                setGreetingText(d.greeting_text || "");
                setPublished(d.published || false);
            } else {
                setMessage({ type: 'error', text: 'Özet bulunamadı' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Yükleme hatası' });
        } finally {
            setLoading(false);
        }
    }, [digestId]);

    useEffect(() => {
        fetchDigest();
    }, [fetchDigest]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setCoverImageUrl(data.url);
                setMessage({ type: 'success', text: 'Görsel yüklendi!' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Upload hatası' });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setMessage({ type: 'error', text: 'Başlık gerekli!' });
            return;
        }

        if (!content.trim()) {
            setMessage({ type: 'error', text: 'İçerik gerekli!' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/digest', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: parseInt(digestId),
                    title,
                    intro,
                    content,
                    cover_image_url: coverImageUrl,
                    category,
                    greeting_text: greetingText,
                    published,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Özet başarıyla güncellendi!' });
                setTimeout(() => router.push('/admin/status'), 1500);
            } else {
                setMessage({ type: 'error', text: data.error || 'Güncelleme hatası' });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        );
    }

    if (!digest) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-700">Özet bulunamadı</p>
                    <button
                        onClick={() => router.push('/admin/status')}
                        className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
                    >
                        Admin Paneline Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-12">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin/status')}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Özet Düzenle</h1>
                            <p className="text-sm text-gray-500">{digest.digest_date}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-all font-medium"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Kaydet
                            </>
                        )}
                    </button>
                </header>

                {/* Message Banner */}
                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        {message.text}
                    </div>
                )}

                {/* Form */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Başlık
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                            placeholder="Özet başlığı..."
                        />
                    </div>

                    {/* Category & Published */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Kategori
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                            >
                                <option value="gundem">Gündem</option>
                                <option value="politika">Politika</option>
                                <option value="ekonomi">Ekonomi</option>
                                <option value="spor">Spor</option>
                                <option value="dunya">Dünya</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3 pt-8">
                            <input
                                type="checkbox"
                                id="published"
                                checked={published}
                                onChange={(e) => setPublished(e.target.checked)}
                                className="w-4 h-4 text-accent focus:ring-accent/20 border-gray-300 rounded"
                            />
                            <label htmlFor="published" className="text-sm font-medium text-gray-700">
                                Yayında
                            </label>
                        </div>
                    </div>

                    {/* Greeting Text */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Karşılama Metni (Opsiyonel)
                        </label>
                        <input
                            type="text"
                            value={greetingText}
                            onChange={(e) => setGreetingText(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                            placeholder="Örn: Günaydın! Bugünün özetine hoş geldiniz..."
                        />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Kapak Görseli
                        </label>

                        {/* Toggle Upload/URL */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setImageMode('url')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${imageMode === 'url'
                                    ? 'bg-accent text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <LinkIcon className="w-4 h-4" />
                                URL
                            </button>
                            <button
                                onClick={() => setImageMode('upload')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${imageMode === 'upload'
                                    ? 'bg-accent text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </button>
                        </div>

                        {imageMode === 'url' ? (
                            <input
                                type="url"
                                value={coverImageUrl}
                                onChange={(e) => setCoverImageUrl(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                                placeholder="https://example.com/image.jpg"
                            />
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-400" />
                                    )}
                                    <span className="text-sm text-gray-600">
                                        {uploading ? 'Yükleniyor...' : 'Görsel seçmek için tıklayın'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        JPEG, PNG, WebP, GIF (Max 5MB)
                                    </span>
                                </label>
                            </div>
                        )}

                        {/* Image Preview */}
                        {coverImageUrl && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">Önizleme:</p>
                                <div className="relative w-full max-w-md h-48">
                                    <NextImage
                                        src={coverImageUrl}
                                        alt="Cover preview"
                                        fill
                                        className="object-cover rounded-lg border border-gray-200"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder.svg';
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Intro */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Giriş Metni
                        </label>
                        <textarea
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                            placeholder="Kısa giriş açıklaması..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            İçerik (Markdown destekli)
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={20}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent font-mono text-sm resize-none"
                            placeholder="Özet içeriği (Markdown formatında)..."
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Markdown formatı desteklenir: **kalın**, *italik*, ### Başlık, - Liste vb.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
