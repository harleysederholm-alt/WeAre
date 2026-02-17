'use client';

import React, { useEffect, useState } from 'react';
import { getOrderSuggestions, sendOrder } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

interface Suggestion {
    masterItemName: string;
    currentStock: number;
    projectedDemand: number;
    buffer: number;
    suggestedQuantity: number;
    unit: string;
    reason: string;
}

export interface DraftItem {
    name: string;
    quantity: number;
    unit: string;
    notes?: string;
}

interface OrderSuggestionDashboardProps {
    restaurantId: string;
    draftItems: DraftItem[];
    setDraftItems: React.Dispatch<React.SetStateAction<DraftItem[]>>;
    onSendOrder: () => void;
    sending: boolean;
}

export const OrderSuggestionDashboard: React.FC<OrderSuggestionDashboardProps> = ({
    restaurantId,
    draftItems,
    setDraftItems,
    onSendOrder,
    sending
}) => {
    const { t } = useLanguage();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    // Supplier state kept local for now, effectively read-only for the parent action? 
    // Wait, parent needs supplier to send order. 
    // Let's keep supplier local and pass it to onSendOrder? No, onSendOrder takes no args.
    // Better: Move supplier state to parent too? 
    // Or: Make onSendOrder accept (supplier, email)?
    const [supplier, setSupplier] = useState('Tukku Oy');
    const [email, setEmail] = useState('orders@tukku.fi');

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        setLoading(true);
        try {
            const data = await getOrderSuggestions(restaurantId);
            setSuggestions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addToDraft = (s: Suggestion) => {
        setDraftItems(prev => {
            const existing = prev.find(i => i.name === s.masterItemName);
            if (existing) {
                return prev.map(i => i.name === s.masterItemName ? { ...i, quantity: i.quantity + s.suggestedQuantity } : i);
            }
            return [...prev, { name: s.masterItemName, quantity: s.suggestedQuantity, unit: s.unit }];
        });
    };

    const removeFromDraft = (index: number) => {
        setDraftItems(prev => prev.filter((_, i) => i !== index));
    };

    // handleSendOrder moved to parent

    return (
        <div className="flex flex-col md:flex-row gap-6 min-h-[600px]">
            {/* Left: Suggestions */}
            <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">{t('reviewSuggestions')}</h2>
                    <button onClick={loadSuggestions} className="text-sm text-indigo-600 hover:text-indigo-800">
                        {t('refresh')}
                    </button>
                </div>

                {loading ? <p>{t('loading')}</p> : (
                    <div className="space-y-4">
                        {suggestions.length === 0 && <p className="text-slate-500 italic">{t('noSuggestions')}</p>}
                        {suggestions.map((s, idx) => (
                            <div key={idx} className="p-4 border border-slate-100 rounded-lg hover:border-indigo-100 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{s.masterItemName}</h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {t('stockCount')}: {s.currentStock} {s.unit} | Demand: {s.projectedDemand.toFixed(1)} | Buffer: {s.buffer.toFixed(1)}
                                        </p>
                                        <p className="text-xs text-indigo-600 mt-1 font-medium">{s.reason}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-emerald-600">
                                            {s.suggestedQuantity} <span className="text-sm font-normal text-slate-500">{s.unit}</span>
                                        </div>
                                        <button
                                            onClick={() => addToDraft(s)}
                                            className="mt-2 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100"
                                        >
                                            + {t('next')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Draft Order */}
            <div className="w-full md:w-1/3 bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col">
                <h2 className="text-xl font-bold text-slate-800 mb-4">{t('draftOrder')}</h2>

                <div className="mb-4 space-y-2">
                    <input
                        className="w-full p-2 text-sm border rounded"
                        value={supplier}
                        onChange={e => setSupplier(e.target.value)}
                        placeholder="Supplier"
                    />
                    <input
                        className="w-full p-2 text-sm border rounded"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                    {draftItems.length === 0 && <p className="text-slate-400 text-center py-8">{t('yourOrderIsEmpty')}</p>}
                    {draftItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                            <span className="text-sm font-medium">{item.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{item.quantity} {item.unit}</span>
                                <button onClick={() => setDraftItems(prev => prev.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">✕</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => onSendOrder()}
                    disabled={sending || draftItems.length === 0}
                    className={`hidden md:block w-full py-3 rounded-lg font-bold text-white shadow transition-all ${sending ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                    {sending ? t('loading') : `${t('sendOrder')} (${draftItems.length})`}
                </button>
            </div>
        </div>
    );
};
