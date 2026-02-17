import React, { useMemo } from 'react';
import { Plus, Check, Trash, ArrowRight, RotateCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { HelpSpot } from '../help/HelpSpot';

interface FloatingActionButtonProps {
    activeTab: string;
    onAction: (action: string) => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ activeTab, onAction }) => {
    // ... existing code ...
    const { t } = useLanguage();

    const config = useMemo(() => {
        // ... existing switch ...
        switch (activeTab) {
            case 'daily':
                return { label: t('submitDaily'), icon: Check, action: 'submit_daily', color: 'bg-indigo-600' };
            case 'waste':
                return { label: t('submitWaste'), icon: Check, action: 'submit_waste', color: 'bg-rose-600' };
            case 'inventory':
                return { label: t('submitInventory'), icon: Check, action: 'submit_inventory', color: 'bg-emerald-600' };
            case 'orders':
                return { label: t('sendOrder'), icon: ArrowRight, action: 'send_order', color: 'bg-blue-600' };
            default:
                return null;
        }
    }, [activeTab, t]);

    if (!config) return null;

    const Icon = config.icon;

    return (
        <>
            <button
                onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(20);
                    onAction(config.action);
                }}
                className={`md:hidden fixed bottom-24 right-4 ${config.color} text-white p-4 rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center gap-3 z-30 transition-all active:scale-90 animate-in zoom-in duration-300`}
            >
                <Icon size={24} strokeWidth={3} />
                <span className="font-bold text-sm pr-1">{config.label}</span>
            </button>
            <HelpSpot
                title={config.label}
                content="Paina tätä nappia tallentaaksesi ja lähettääksesi tiedot. Varmista että kaikki rivit on täytetty."
                className="fixed bottom-36 right-4 z-40"
            />
        </>
    );
};
