"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Edit, Calendar, Search, Filter, Loader2, ChevronRight, FileText
} from "lucide-react";

interface Digest {
    id: number;
    digest_date: string;
    title: string;
    category: string;
    published: boolean;
    word_count: number;
}

export default function DigestsListPage() {
    const router = useRouter();
    const [digests, setDigests] = useState<Digest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    useEffect(() => {
        fetchDigests();
    }, []);

    const fetchDigests = async () => {
        try {
            const res = await fetch('/api/admin/all-digests');
            const data = await res.json();
            if (data.success) {
                setDigests(data.digests || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDigests = digests.filter(d => {
        const matchesSearch = d.title?.toLowerCase().includes(search.toLowerCase()) ||
            d.digest_date.includes(search);
        const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-6 sm:p-12 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <header>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="text-accent" />
                    Özetler
                </h1>
                <p className="text-gray-500 text-sm mt-1">Günlük özetleri görüntüle ve düzenle</p>
            </header>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Başlık veya tarihe göre ara..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                        <option value="all">Tüm Kategoriler</option>
                        <option value="gundem">Gündem</option>
                        <option value="politika">Politika</option>
                        <option value="ekonomi">Ekonomi</option>
                        <option value="spor">Spor</option>
                        <option value="dunya">Dünya</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Toplam: <strong>{digests.length}</strong> özet</span>
                <span>•</span>
                <span>Gösterilen: <strong>{filteredDigests.length}</strong></span>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tarih</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Başlık</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Durum</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredDigests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            Özet bulunamadı
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDigests.map((digest) => (
                                        <tr
                                            key={digest.id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => router.push(`/admin/edit/${digest.id}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {digest.digest_date}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-md truncate">
                                                    {digest.title || 'Başlıksız'}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {digest.word_count || 0} kelime
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                                    {digest.category || 'gundem'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${digest.published
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {digest.published ? 'Yayında' : 'Taslak'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/admin/edit/${digest.id}`);
                                                    }}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-all"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    Düzenle
                                                    <ChevronRight className="w-3 h-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
