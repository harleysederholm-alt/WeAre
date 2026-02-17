import React from 'react';
import { Calendar, Trash2, Package, ShoppingCart, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MobileNavProps {
    activeTab: string;
    onTabChange: (tab: any) => void;
    onToggleMenu: () => void;
    onLogout: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
    const { t } = useLanguage();

    const navItems = [
        { id: 'daily', icon: Calendar, label: t('daily') },
        { id: 'waste', icon: Trash2, label: t('waste') },
        { id: 'inventory', icon: Package, label: t('inventory') },
        { id: 'orders', icon: ShoppingCart, label: t('orders') },
        { id: 'roster', icon: Users, label: t('roster') },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass-nav shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40 pb-safe transition-all duration-300">
            <div className="flex justify-around items-center h-16 px-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onTabChange(item.id);
                                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
                            }}
                            className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400 -translate-y-1' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <div className={`transition-all duration-300 ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-xl' : ''}`}>
                                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <span className="absolute bottom-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
