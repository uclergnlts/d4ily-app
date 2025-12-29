"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Activity, Database, FileText, RefreshCw, Server, AlertCircle, CheckCircle, Edit, Calendar, BarChart3
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [recentDigests, setRecentDigests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    const fetchRecentDigests = async () => {
        try {
            const res = await fetch("/api/admin/recent-digests");
            const data = await res.json();
            if (data.success) {
                setRecentDigests(data.digests || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchStats();
            fetchRecentDigests();
            const interval = setInterval(fetchStats, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

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
        <div className="p-6 sm:p-12 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="text-accent" />
                        Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Sistem durumu ve operasyonel kontrol merkezi</p>
                </div>
                <Link
                    href="/istatistikler"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                    <BarChart3 className="w-4 h-4" />
                    Detaylı İstatistikler
                </Link>
            </header>

            {/* Status Badge */}
            <div className="flex items-center justify-between">
                <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${stats?.health?.status === 'operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${stats?.health?.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                    {stats?.health?.status === 'operational' ? 'Sistem Aktif' : 'Sorunlu'}
                </div>
                <button onClick={fetchStats} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
            </div>

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

            {/* Cron Schedule Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Otomatik İşlemler (Cron Schedule)</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-sm text-blue-900">Tweet & RSS Fetch</p>
                            <p className="text-xs text-blue-700">Her 4 saatte bir (00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC)</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-sm text-green-900">Günlük Özet</p>
                            <p className="text-xs text-green-700">Her gün 06:00 UTC (Türkiye 09:00)</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-sm text-purple-900">Haftalık Özet</p>
                            <p className="text-xs text-purple-700">Her pazartesi 08:00 UTC (Türkiye 11:00)</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                        💡 <strong>Not:</strong> Tüm işlemler GitHub Actions üzerinden otomatik çalışır.
                        Manuel tetikleme için GitHub repository → Actions → İlgili workflow → &quot;Run workflow&quot; kullanın.
                    </p>
                </div>
            </div>

            {/* Recent Digests */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Edit className="w-5 h-5 text-accent" />
                        Son Özetler
                    </h3>
                    <button
                        onClick={() => router.push('/admin/digests')}
                        className="text-sm text-accent hover:underline"
                    >
                        Tümünü Gör →
                    </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {recentDigests.length === 0 ? (
                        <p className="text-gray-500 text-sm">Henüz özet yok</p>
                    ) : (
                        recentDigests.slice(0, 5).map((digest: any) => (
                            <div
                                key={digest.id}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-sm">{digest.title || 'Başlıksız'}</p>
                                        <p className="text-xs text-gray-500">
                                            {digest.digest_date} • {digest.category || 'gundem'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push(`/admin/edit/${digest.id}`)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-all"
                                >
                                    <Edit className="w-3 h-3" />
                                    Düzenle
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>
                    Sistem otomatik olarak çalışır. Cron schedule yukarıda gösterilmiştir.
                    İstatistikler real-time olarak yansır.
                </p>
            </div>
        </div>
    );
}
