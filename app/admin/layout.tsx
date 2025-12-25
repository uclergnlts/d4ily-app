"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard, FileEdit, Settings, LogOut, Menu, X,
    Activity, ChevronRight
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin",
            description: "Sistem durumu ve metrikler"
        },
        {
            name: "Özetler",
            icon: FileEdit,
            path: "/admin/digests",
            description: "Günlük özetleri yönet"
        },
        {
            name: "Kaynak Yönetimi",
            icon: Settings,
            path: "/admin/sources",
            description: "Twitter & RSS kaynakları"
        },
    ];

    const isActive = (path: string) => {
        if (path === "/admin") {
            return pathname === "/admin";
        }
        return pathname?.startsWith(path);
    };

    const handleLogout = () => {
        router.push("/");
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">D4ily Admin</h1>
                                <p className="text-xs text-gray-400">Yönetim Paneli</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-gray-800 rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        router.push(item.path);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                                            ? "bg-accent text-white shadow-lg"
                                            : "hover:bg-gray-800 text-gray-300 hover:text-white"
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <div className="flex-1 text-left">
                                        <div className="font-medium text-sm">{item.name}</div>
                                        <div className="text-xs opacity-70 mt-0.5">{item.description}</div>
                                    </div>
                                    {active && <ChevronRight className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="font-semibold">D4ily Admin</h2>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
