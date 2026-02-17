import React, { useEffect, useState } from 'react';
import { getPendingTransfers, resolveTransfer } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

export const IncomingTransfersWidget: React.FC = () => {
    const { t } = useLanguage();
    const [transfers, setTransfers] = useState<any[]>([]);

    const fetchTransfers = async () => {
        try {
            const data = await getPendingTransfers('restaurant-1'); // Assume self is rest-1
            setTransfers(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTransfers();
        const interval = setInterval(fetchTransfers, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleResolve = async (id: string, action: 'ACCEPT' | 'REJECT') => {
        try {
            await resolveTransfer({ transferId: id, action });
            fetchTransfers(); // Refresh
        } catch (err) {
            alert(t('resolveFailed'));
        }
    };

    if (transfers.length === 0) return null;

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 animate-pulse">
            <h4 className="font-bold text-amber-800 flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs border border-amber-200">{transfers.length}</span>
                {t('incomingTransfers')}
            </h4>
            <div className="mt-3 space-y-2">
                {transfers.map(t => (
                    <div key={t.id} className="bg-white p-3 rounded border border-amber-100 shadow-sm flex justify-between items-center">
                        <div>
                            <p className="font-bold text-sm">{t.itemId} <span className="font-normal text-slate-500">x {t.quantity}</span></p>
                            <p className="text-xs text-slate-500">From: {t.senderId}</p>
                            {t.reason && <p className="text-xs text-slate-400 italic">"{t.reason}"</p>}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleResolve(t.id, 'ACCEPT')}
                                className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold hover:bg-emerald-200"
                            >
                                {t('accept')}
                            </button>
                            <button
                                onClick={() => handleResolve(t.id, 'REJECT')}
                                className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-bold hover:bg-red-100"
                            >
                                {t('reject')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
