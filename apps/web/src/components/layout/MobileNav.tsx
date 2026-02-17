import React from 'react';
import { Calendar, Trash2, Package, Menu, LogOut } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MobileNavProps {
    activeTab: string;
    onTabChange: (tab: any) => void;
    onToggleMenu: () => void;
    onLogout: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange, onToggleMenu, onLogout }) => {
    const { t } = useLanguage();

    const navItems = [
        { id: 'daily', icon: Calendar, label: t('daily') },
        { id: 'waste', icon: Trash2, label: t('waste') },
        { id: 'inventory', icon: Package, label: t('inventory') },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
                <button
                    onClick={onToggleMenu}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 hover:text-slate-600`}
                >
                    <Menu size={24} />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>

            </div>
        </div>
    );
};
