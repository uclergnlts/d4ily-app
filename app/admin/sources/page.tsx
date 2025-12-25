"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Plus, Edit3, Trash2, RefreshCw, Search,
    CheckCircle, XCircle, Loader2, AlertCircle, Twitter, Rss, Save, X
} from "lucide-react";

interface TwitterAccount {
    id: number;
    username: string;
    display_name: string | null;
    category: string;
    priority: number;
    show_in_live_feed?: boolean;
    is_active: boolean;
    notes: string | null;
}

interface RSSSource {
    id: number;
    url: string;
    name: string;
    category: string;
    is_active: boolean;
    fetch_interval: number;
    notes: string | null;
}

export default function SourcesManagementPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'twitter' | 'rss'>('twitter');

    // Twitter State
    const [twitterAccounts, setTwitterAccounts] = useState<TwitterAccount[]>([]);
    const [twitterLoading, setTwitterLoading] = useState(true);
    const [twitterSearch, setTwitterSearch] = useState("");

    // RSS State
    const [rssSources, setRSSSources] = useState<RSSSource[]>([]);
    const [rssLoading, setRSSLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'add' | 'edit'>('add');

    // Form State
    const [formData, setFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        fetchTwitterAccounts();
        fetchRSSSources();
    }, []);

    const fetchTwitterAccounts = async () => {
        try {
            const res = await fetch('/api/admin/sources/twitter');
            const data = await res.json();
            if (data.success) {
                setTwitterAccounts(data.accounts || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setTwitterLoading(false);
        }
    };

    const fetchRSSSources = async () => {
        try {
            const res = await fetch('/api/admin/sources/rss');
            const data = await res.json();
            if (data.success) {
                setRSSSources(data.sources || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setRSSLoading(false);
        }
    };

    const handleImportSources = async () => {
        if (!confirm('Hardcoded kaynaklardan DB\'ye aktarım yapılsın mı? (108 Twitter + 7 RSS)')) return;

        setImporting(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/seed-sources', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                setMessage({
                    type: 'success',
                    text: `✅ İçe aktarıldı! Twitter: ${data.twitter}/${data.twitterTotal || 0}, RSS: ${data.rss}/${data.rssTotal || 0}`
                });
                fetchTwitterAccounts();
                fetchRSSSources();
            } else {
                setMessage({ type: 'error', text: `Hata: ${data.error}` });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setImporting(false);
        }
    };

    const handleAdd = (tab: 'twitter' | 'rss') => {
        setModalType('add');
        setFormData(tab === 'twitter' ? { priority: 5, category: 'genel' } : { fetch_interval: 240, category: 'gundem' });
        setActiveTab(tab);
        setShowModal(true);
    };

    const handleEdit = (item: any, tab: 'twitter' | 'rss') => {
        setModalType('edit');
        setFormData(item);
        setActiveTab(tab);
        setShowModal(true);
    };

    const handleToggleActive = async (id: number, is_active: boolean, tab: 'twitter' | 'rss') => {
        try {
            const endpoint = tab === 'twitter' ? '/api/admin/sources/twitter' : '/api/admin/sources/rss';
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_active: !is_active }),
            });

            const data = await res.json();
            if (data.success) {
                tab === 'twitter' ? fetchTwitterAccounts() : fetchRSSSources();
                setMessage({ type: 'success', text: 'Durum güncellendi!' });
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    const handleDelete = async (id: number, tab: 'twitter' | 'rss') => {
        if (!confirm('Bu kaynağı silmek istediğinize emin misiniz?')) return;

        try {
            const endpoint = tab === 'twitter' ? '/api/admin/sources/twitter' : '/api/admin/sources/rss';
            const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });

            const data = await res.json();
            if (data.success) {
                tab === 'twitter' ? fetchTwitterAccounts() : fetchRSSSources();
                setMessage({ type: 'success', text: 'Kaynak silindi!' });
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const endpoint = activeTab === 'twitter' ? '/api/admin/sources/twitter' : '/api/admin/sources/rss';
            const method = modalType === 'add' ? 'POST' : 'PUT';

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: modalType === 'add' ? 'Eklendi!' : 'Güncellendi!' });
                setShowModal(false);
                activeTab === 'twitter' ? fetchTwitterAccounts() : fetchRSSSources();
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Hata!' });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const filteredTwitter = twitterAccounts.filter(a =>
        a.username.toLowerCase().includes(twitterSearch.toLowerCase()) ||
        (a.display_name && a.display_name.toLowerCase().includes(twitterSearch.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-12">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Kaynak Yönetimi</h1>
                        <p className="text-sm text-gray-500">Twitter hesapları ve RSS kaynaklarını yönetin</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {twitterAccounts.length === 0 && rssSources.length === 0 && (
                            <button
                                onClick={handleImportSources}
                                disabled={importing}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                            >
                                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                İçe Aktar (108 + 7)
                            </button>
                        )}
                        <button
                            onClick={() => {
                                fetchTwitterAccounts();
                                fetchRSSSources();
                            }}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Message Banner */}
                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('twitter')}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'twitter'
                                ? 'bg-accent text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Twitter className="w-5 h-5" />
                            Twitter Hesapları ({twitterAccounts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('rss')}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'rss'
                                ? 'bg-accent text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Rss className="w-5 h-5" />
                            RSS Kaynakları ({rssSources.length})
                        </button>
                    </div>

                    {/* Twitter Tab */}
                    {activeTab === 'twitter' && (
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={twitterSearch}
                                        onChange={(e) => setTwitterSearch(e.target.value)}
                                        placeholder="Hesap ara..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    />
                                </div>
                                <button
                                    onClick={() => handleAdd('twitter')}
                                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    Yeni Hesap
                                </button>
                            </div>

                            {twitterLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Username</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Kategori</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Öncelik</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Canlı Akış</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Durum</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {filteredTwitter.map((account) => (
                                                <tr key={account.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium">@{account.username}</td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                                            {account.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">{account.priority}</td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {account.show_in_live_feed ? (
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Evet</span>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => handleToggleActive(account.id, account.is_active, 'twitter')}
                                                            className="flex items-center gap-1 text-sm"
                                                        >
                                                            {account.is_active ? (
                                                                <><CheckCircle className="w-4 h-4 text-green-500" /> Aktif</>
                                                            ) : (
                                                                <><XCircle className="w-4 h-4 text-red-500" /> Pasif</>
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(account, 'twitter')}
                                                                className="p-2 hover:bg-gray-200 rounded"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(account.id, 'twitter')}
                                                                className="p-2 hover:bg-red-100 rounded"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredTwitter.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                            Henüz Twitter hesabı eklenmemiş
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* RSS Tab */}
                    {activeTab === 'rss' && (
                        <div className="p-6 space-y-4">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleAdd('rss')}
                                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
                                >
                                    <Plus className="w-4 h-4" />
                                    Yeni RSS Kaynağı
                                </button>
                            </div>

                            {rssLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Ad</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">URL</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Kategori</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Durum</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {rssSources.map((source) => (
                                                <tr key={source.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium">{source.name}</td>
                                                    <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">{source.url}</td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                                            {source.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => handleToggleActive(source.id, source.is_active, 'rss')}
                                                            className="flex items-center gap-1 text-sm"
                                                        >
                                                            {source.is_active ? (
                                                                <><CheckCircle className="w-4 h-4 text-green-500" /> Aktif</>
                                                            ) : (
                                                                <><XCircle className="w-4 h-4 text-red-500" /> Pasif</>
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(source, 'rss')}
                                                                className="p-2 hover:bg-gray-200 rounded"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(source.id, 'rss')}
                                                                className="p-2 hover:bg-red-100 rounded"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {rssSources.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                            Henüz RSS kaynağı eklenmemiş
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">
                                {modalType === 'add' ? 'Yeni ' : 'Düzenle: '}
                                {activeTab === 'twitter' ? 'Twitter Hesabı' : 'RSS Kaynağı'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {activeTab === 'twitter' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Username</label>
                                        <input
                                            type="text"
                                            value={formData.username || ''}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            placeholder="RTErdogan"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1"> Kategori</label>
                                        <select
                                            value={formData.category || 'genel'}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            <option value="genel">Genel</option>
                                            <option value="siyaset">Siyaset</option>
                                            <option value="ekonomi">Ekonomi</option>
                                            <option value="spor">Spor</option>
                                            <option value="medya">Medya</option>
                                            <option value="teknoloji">Teknoloji</option>
                                            <option value="bilim">Bilim</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Öncelik (0-10)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={formData.priority || 5}
                                            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="showInLiveFeed"
                                            checked={formData.show_in_live_feed || false}
                                            onChange={(e) => setFormData({ ...formData, show_in_live_feed: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                                        />
                                        <label htmlFor="showInLiveFeed" className="text-sm font-medium text-gray-700">
                                            Canlı Akışta Göster (/akis)
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Ad</label>
                                        <input
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            placeholder="BBC Türkçe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">URL</label>
                                        <input
                                            type="url"
                                            value={formData.url || ''}
                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Kategori</label>
                                        <select
                                            value={formData.category || 'gundem'}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            <option value="gundem">Gündem</option>
                                            <option value="siyaset">Siyaset</option>
                                            <option value="ekonomi">Ekonomi</option>
                                            <option value="dunya">Dünya</option>
                                            <option value="spor">Spor</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
