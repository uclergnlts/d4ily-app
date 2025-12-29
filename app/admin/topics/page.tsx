"use client";

import { useState, useEffect } from "react";
import { Plus, Folder, FolderPlus, Edit2, Trash, Save } from "lucide-react";

export default function TopicMapEditor() {
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTopicName, setNewTopicName] = useState("");
    const [selectedParent, setSelectedParent] = useState<number | null>(null);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const res = await fetch("/api/blog/topics");
            const data = await res.json();
            if (Array.isArray(data)) {
                setTopics(data);
            } else {
                console.error("API returned invalid data:", data);
                setTopics([]);
            }
        } catch (error) {
            console.error("Failed to fetch topics:", error);
            setTopics([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTopic = async () => {
        if (!newTopicName.trim()) return;

        try {
            const slug = newTopicName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            const res = await fetch("/api/blog/topics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newTopicName,
                    slug: slug,
                    parent_id: selectedParent
                })
            });

            if (res.ok) {
                setNewTopicName("");
                fetchTopics();
            }
        } catch (error) {
            console.error("Failed to create topic:", error);
        }
    };

    // Recursive render for tree view
    const renderTopicTree = (parentId: number | null, level = 0) => {
        const children = topics.filter(t => t.parent_id === parentId);

        if (children.length === 0) return null;

        return (
            <div className={`space-y-2 ${level > 0 ? "ml-6 border-l border-gray-200 pl-4" : ""}`}>
                {children.map(topic => (
                    <div key={topic.id}>
                        <div className="flex items-center group">
                            <div className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 flex-1 border border-transparent hover:border-gray-200 transition-all">
                                <Folder className={`w-4 h-4 ${level === 0 ? "text-indigo-600" : "text-gray-400"}`} />
                                <span className="font-medium text-gray-700">{topic.name}</span>
                                <span className="text-xs text-gray-400 ml-2 font-mono">/{topic.slug}</span>

                                <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setSelectedParent(topic.id)}
                                        className="p-1 hover:bg-indigo-50 text-indigo-600 rounded"
                                        title="Alt Konu Ekle"
                                    >
                                        <FolderPlus className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 text-gray-600 rounded">
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1 hover:bg-red-50 text-red-600 rounded">
                                        <Trash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {renderTopicTree(topic.id, level + 1)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Konu Haritası (Topical Map)</h1>
                    <p className="text-gray-500">Sitenin semantik yapısını ve hiyerarşisini düzenleyin.</p>
                </div>
            </div>

            <div className="flex gap-6 h-full">
                {/* Editor Area */}
                <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-gray-400">Yükleniyor...</div>
                    ) : topics.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Folder className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Henüz Konu Yok</h3>
                            <p className="text-gray-500 mt-1">İlk ana konuyu ekleyerek başlayın.</p>
                        </div>
                    ) : (
                        renderTopicTree(null)
                    )}
                </div>

                {/* Sidebar Creator */}
                <div className="w-80 bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-fit">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <FolderPlus className="w-4 h-4 text-indigo-600" />
                        Yeni Konu Ekle
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Üst Konu (Parent)</label>
                            <select
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                value={selectedParent || ""}
                                onChange={(e) => setSelectedParent(e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">(Ana Konu)</option>
                                {topics.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Konu Adı</label>
                            <input
                                type="text"
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Örn: Ekonomi"
                                value={newTopicName}
                                onChange={(e) => setNewTopicName(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleCreateTopic}
                            className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Oluştur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
