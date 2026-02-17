import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface InventoryMobileListProps {
    items: any[];
    onUpdate: (itemId: string, quantity: number) => void;
    template: { requiredItems: string[] };
}

export const InventoryMobileList: React.FC<InventoryMobileListProps> = ({ items, onUpdate, template }) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="md:hidden space-y-4 pb-20">
            {/* Search Bar */}
            <div className="sticky top-0 bg-slate-50 pt-2 pb-4 z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder={t('searchGuides')} // Reusing 'searchGuides' or generic search if available
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-3">
                {filteredItems.map((item) => {
                    const isRequired = template?.requiredItems?.includes(item.name);

                    return (
                        <div key={item.itemId} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-slate-800">{item.name}</span>
                                    {isRequired && (
                                        <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200 font-bold">
                                            REQ
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                    {item.unit}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={item.quantity === 0 ? '' : item.quantity} // Show empty if 0 for easier typing, or handle logic
                                    placeholder="0"
                                    onChange={(e) => onUpdate(item.itemId, parseFloat(e.target.value) || 0)}
                                    className="w-24 px-3 py-3 text-right bg-slate-50 border border-slate-200 rounded-lg font-mono text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none active:scale-[1.02] transition-transform"
                                    onFocus={(e) => e.target.select()}
                                />
                            </div>
                        </div>
                    );
                })}

                {filteredItems.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        No items found.
                    </div>
                )}
            </div>
        </div>
    );
};
