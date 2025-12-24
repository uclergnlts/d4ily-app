
"use client";

import { useEffect, useState } from "react";
import { Activity, Database, FileText, Play, RefreshCw, Server, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminStatusPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === "7798") {
            setIsAuthenticated(true);
        } else {
            setError(true);
            setPin("");
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchStats();
            const interval = setInterval(fetchStats, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const handleTrigger = async (action: string, url: string) => {
        if (!confirm("Bu işlemi tetiklemek istediğinize emin misiniz?")) return;

        setActionLoading(action);
        setMessage(null);

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `İşlem başarıyla başlatıldı: ${action}` });
                fetchStats(); // Update stats
            } else {
                setMessage({ type: 'error', text: `Hata: ${data.error || 'Bilinmeyen hata'}` });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: `Bağlantı hatası: ${err.message}` });
        } finally {
            setActionLoading(null);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-xs rounded-xl bg-white p-8 shadow-lg border border-gray-100">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-accent/10 p-3 text-accent">
                            <Activity className="h-8 w-8" />
                        </div>
                    </div>
                    <h1 className="mb-6 text-center text-xl font-bold text-gray-900">Admin Panel</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => { setPin(e.target.value); setError(false); }}
                                placeholder="PIN Giriniz"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-lg tracking-widest focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                                autoFocus
                            />
                        </div>
                        {error && (
                            <p className="text-center text-xs text-red-500 font-medium">Hatalı PIN</p>
                        )}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-accent px-4 py-2 font-medium text-white hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/20"
                        >
                            Giriş
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading && isAuthenticated) {
        return <div className="flex h-screen items-center justify-center text-gray-500">Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-12 font-sans text-gray-800">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Activity className="text-accent" />
                            Sistem Durumu
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Operasyonel Kontrol Merkezi</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${stats?.health?.status === 'operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${stats?.health?.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                            {stats?.health?.status === 'operational' ? 'Sistem Aktif' : 'Sorunlu'}
                        </div>
                        <button onClick={fetchStats} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </header>

                {/* Message Banner */}
                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2 text-gray-500">
                            <Database className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Tweet Verisi (24s)</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats?.metrics?.tweets_24h || 0}</div>
                        <div className="text-xs text-green-600 mt-1">Otomatik toplanan ham veri</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2 text-gray-500">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Haber Verisi (24s)</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats?.metrics?.news_24h || 0}</div>
                        <div className="text-xs text-blue-600 mt-1">RSS kaynaklarından</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2 text-gray-500">
                            <Server className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Son Bülten</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 truncate" title={stats?.lastDigest?.title}>
                            {stats?.lastDigest?.digest_date || "Yok"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                            {new Date(stats?.lastDigest?.updated_at || stats?.lastDigest?.created_at).toLocaleString('tr-TR')}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Manuel İşlemler</h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => handleTrigger('Bülten Oluştur', '/api/cron/generate-digest')}
                            disabled={!!actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-all font-medium"
                        >
                            {actionLoading === 'Bülten Oluştur' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Günlük Özeti Tetikle (AI)
                        </button>

                        <button
                            onClick={() => handleTrigger('Tweet Çek', '/api/cron/fetch-tweets')}
                            disabled={!!actionLoading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all font-medium"
                        >
                            {actionLoading === 'Tweet Çek' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            Tweet Verisini Güncelle
                        </button>

                        <button
                            onClick={() => handleTrigger('Haber Çek', '/api/cron/fetch-news')}
                            disabled={!!actionLoading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all font-medium"
                        >
                            {actionLoading === 'Haber Çek' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            Haber Kaynaklarını Tara
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>
                        Bu panel üzerinden sistemi manuel olarak tetikleyebilirsiniz. Normal şartlarda sistem her gece otomatik çalışır.
                        Manuel tetikleme yaparken lütfen işlemlerin tamamlanmasını bekleyin (30-60 saniye sürebilir).
                    </p>
                </div>

            </div>
        </div>
    );
}
