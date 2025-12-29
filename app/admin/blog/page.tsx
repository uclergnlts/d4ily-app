"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, BarChart } from "lucide-react";

export default function BlogAdminPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/blog/posts?limit=100");
            const data = await res.json();

            if (Array.isArray(data)) {
                setPosts(data);
            } else {
                console.error("API returned invalid data:", data);
                setPosts([]);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Blog Yönetimi</h1>
                    <p className="text-gray-500">İçeriklerinizi yönetin ve SEO skorlarını takip edin.</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Yazı Ekle
                </Link>
            </div>

            {/* Stats Cards - Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Toplam Yazı</p>
                    <h3 className="text-2xl font-bold">{posts.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Yayında</p>
                    <h3 className="text-2xl font-bold text-green-600">
                        {posts.filter(p => p.published).length}
                    </h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Toplam Görüntülenme</p>
                    <h3 className="text-2xl font-bold text-blue-600">
                        {posts.reduce((acc, curr) => acc + (curr.view_count || 0), 0)}
                    </h3>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-6 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Yazı başlığı ara..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Başlık</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Görüntülenme</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">SEO Skoru</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tarih</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Yükleniyor...</td>
                            </tr>
                        ) : filteredPosts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Yazı bulunamadı.</td>
                            </tr>
                        ) : (
                            filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 line-clamp-1 max-w-[300px]" title={post.title}>{post.title}</div>
                                        <div className="text-xs text-gray-500">/{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.published ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Yayında</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Taslak</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                                        <Eye className="w-4 h-4 text-gray-400" />
                                        {post.view_count || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${(post.seo_score || 0) >= 80 ? 'bg-green-500' :
                                                        (post.seo_score || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${post.seo_score || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-gray-600">{post.seo_score || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(post.published_at || post.created_at).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
