'use client';

import React from 'react';

interface ContextSidebarProps {
    context: string;
    restaurantId: string;
}

export const ContextSidebar: React.FC<ContextSidebarProps> = ({ context, restaurantId }) => {
    return (
        <aside className="fixed right-0 top-0 h-full w-64 bg-slate-50/90 backdrop-blur-sm border-l border-slate-200 p-6 pt-24 hidden md:block z-10 shadow-lg transition-transform">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4">Context Help</h3>

            <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm text-sm text-slate-600 min-h-[100px] leading-relaxed">
                {context || "Select a cell to see context-aware guidelines."}
            </div>

            <div className="mt-8">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-3">System Rules</h4>
                <ul className="text-xs text-slate-500 space-y-2">
                    <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        Only 'Normaali' shifts earn tips.
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        Prices are frozen at event time.
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        Submitting EOD locks the report.
                    </li>
                </ul>
            </div>
        </aside>
    );
};
