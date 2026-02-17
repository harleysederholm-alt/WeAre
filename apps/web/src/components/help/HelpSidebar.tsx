import React, { useEffect, useState } from 'react';
import { useHelp } from '../../context/HelpContext';
import { useAuth } from '../../context/AuthContext';

// Mock API Call
const fetchHelpArticles = async (context: string, restaurantId: string, query?: string) => {
    try {
        const params = new URLSearchParams();
        if (context && context !== 'global') params.append('context', context);
        if (restaurantId) params.append('restaurantId', restaurantId);
        if (query) params.append('query', query);

        const res = await fetch(`http://localhost:3001/api/help?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch help');
        return await res.json();
    } catch (error) {
        console.error('Error fetching help:', error);
        return [];
    }
};

interface HelpSidebarProps {
    onAddNote?: () => void;
}

export const HelpSidebar: React.FC<HelpSidebarProps> = ({ onAddNote }) => {
    const { isSidebarOpen, toggleSidebar, currentContext, language } = useHelp();
    const { user } = useAuth();
    const [articles, setArticles] = useState<any[]>([]);

    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isSidebarOpen) {
            // Initial fetch by context
            fetchHelpArticles(currentContext, 'restaurant-1').then(setArticles);
        }
    }, [isSidebarOpen, currentContext]);

    const handleSearch = async () => {
        // Toggle search mode or execute search
        if (!showSearch) {
            setShowSearch(true);
        } else {
            // Execute search
            const results = await fetchHelpArticles('global', 'restaurant-1', searchQuery);
            setArticles(results);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (!isSidebarOpen) {
        return (
            <button
                onClick={toggleSidebar}
                className="fixed right-0 top-20 bg-indigo-600 text-white p-2 rounded-l-md shadow-md hover:bg-indigo-700 transition-all z-50"
                title="Open Help"
            >
                ?
            </button>
        );
    }

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform border-l border-slate-200 flex flex-col">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Memo / Ohjeet</h2>
                <button onClick={toggleSidebar} className="text-slate-500 hover:text-slate-800">✕</button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    <span>Context: {currentContext}</span>
                    <button onClick={() => setShowSearch(!showSearch)} className="text-indigo-600 hover:text-indigo-800">
                        {showSearch ? 'Hide Search' : 'Search'}
                    </button>
                </div>

                {showSearch && (
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search guides..."
                            className="flex-1 p-2 text-sm border border-slate-300 rounded"
                            autoFocus
                        />
                        <button onClick={handleSearch} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold">
                            GO
                        </button>
                    </div>
                )}

                {articles.length === 0 ? (
                    <div className="text-sm text-slate-500 italic">
                        No specific help for this context.
                        <br />
                        <button
                            onClick={handleSearch}
                            className="text-indigo-600 mt-2 hover:underline"
                        >
                            Search all guides
                        </button>
                    </div>
                ) : (
                    articles.map(article => (
                        <div key={article.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <h3 className="font-semibold text-indigo-700 mb-2">
                                {language === 'fi' ? article.title_fi : article.title_en || article.title_fi}
                            </h3>
                            <p className="text-sm text-slate-600 mb-3">
                                {language === 'fi' ? article.body_fi : article.body_en || article.body_fi}
                            </p>
                            {article.steps_fi && (
                                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                    {(language === 'fi' ? article.steps_fi : article.steps_en || article.steps_fi).map((step: string, i: number) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ul>
                            )}
                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-xs py-0.5 px-1.5 bg-slate-200 rounded text-slate-500">
                                    {article.layer}
                                </span>
                            </div>
                        </div>
                    ))
                )}

                {user?.role === 'MANAGER' && (
                    <div className="pt-4 border-t">
                        <button
                            onClick={onAddNote}
                            className="w-full py-2 border-2 border-dashed border-slate-300 text-slate-500 rounded hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm"
                        >
                            + Add Note for this screen
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
