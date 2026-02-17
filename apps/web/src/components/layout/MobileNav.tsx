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

    const getColorClass = (id: string, type: 'text' | 'bg' | 'border' | 'shadow' | 'ring') => {
        const colors: Record<string, string> = {
            daily: 'emerald',
            waste: 'rose',
            inventory: 'teal',
            orders: 'blue',
            roster: 'violet',
            purchases: 'cyan',
            reports: 'amber',
            audit: 'orange',
            admin: 'slate'
        };
        const color = colors[id] || 'indigo';

        if (type === 'text') return `text-${color}-600 dark:text-${color}-400`;
        if (type === 'bg') return `bg-${color}-100 dark:bg-${color}-900/30`; // Darker bg for light mode visibility
        if (type === 'border') return `border-${color}-200 dark:border-${color}-700`;
        if (type === 'shadow') return `shadow-${color}-500/20`;
        if (type === 'ring') return `ring-${color}-500`;
        return '';
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass-nav shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40 pb-safe transition-all duration-300">
            <div className="flex justify-around items-center h-16 px-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const activeText = getColorClass(item.id, 'text');
                    const activeBg = getColorClass(item.id, 'bg');
                    const activeShadow = getColorClass(item.id, 'shadow');

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onTabChange(item.id);
                                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
                            }}
                            className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${isActive ? `${activeText} -translate-y-1` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <div className={`transition-all duration-300 ${isActive ? `${activeBg} p-1.5 rounded-xl ${activeShadow} shadow-lg` : ''}`}>
                                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-bold' : ''}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${activeText.replace('text-', 'bg-')}`} />
                            )}
                        </button>
                    );
                })}
            </div>
            {/* Ambient Glow for Active Tab (Under the menu) */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 blur-xl transition-colors duration-500 ${getColorClass(activeTab, 'text')}`} />
        </div>
    );
};
