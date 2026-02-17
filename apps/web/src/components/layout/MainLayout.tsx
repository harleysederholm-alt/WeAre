import React, { useState } from 'react';
import { MobileNav } from './MobileNav';
import {
    Calendar, Trash2, Package, ShoppingCart,
    FileText, Users, BarChart3, FileClock, Settings, LogOut, Globe, Menu
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useHelp } from '../../context/HelpContext';
import { useSwipe } from '../../hooks/useSwipe';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: any) => void;
    activeRestaurant: any;
    availableRestaurants: any[];
    switchRestaurant: (id: string) => void;
    onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    setActiveTab,
    activeRestaurant,
    availableRestaurants,
    switchRestaurant,
    onLogout
}) => {
    const { t, language, setLanguage } = useLanguage();
    const { user } = useAuth();
    const { toggleSidebar } = useHelp(); // Changed from toggleHelpMode
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Swipe Handlers
    const swipeHandlers = useSwipe({
        onSwipeRight: () => setIsMobileMenuOpen(true), // Swipe Right (->) opens Left Menu
        onSwipeLeft: () => toggleSidebar(), // Swipe Left (<-) opens Help Sidebar
        edgeOnly: true,
        edgeThreshold: 50
    });

    const menuItems = [
        { id: 'daily', icon: Calendar, label: t('daily'), requiredRole: 'STAFF' },
        { id: 'waste', icon: Trash2, label: t('waste'), requiredRole: 'STAFF' },
        { id: 'inventory', icon: Package, label: t('inventory'), requiredRole: 'STAFF' },
        { id: 'orders', icon: ShoppingCart, label: t('orders'), requiredRole: 'STAFF' },
        { id: 'purchases', icon: FileText, label: t('purchases'), requiredRole: 'MANAGER' },
        { id: 'roster', icon: Users, label: t('roster'), requiredRole: 'MANAGER' },
        { id: 'reports', icon: BarChart3, label: t('reports'), requiredRole: 'MANAGER' },
        { id: 'audit', icon: FileClock, label: t('audit'), requiredRole: 'MANAGER' },
        { id: 'admin', icon: Settings, label: t('admin'), requiredRole: 'ADMIN' },
    ];

    const hasPermission = (requiredRole: string) => {
        if (requiredRole === 'STAFF') return true;
        if (requiredRole === 'MANAGER') return user?.role === 'MANAGER' || user?.role === 'ADMIN';
        if (requiredRole === 'ADMIN') return user?.role === 'ADMIN';
        return false;
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setIsMobileMenuOpen(false);
    };

    return (
        <div
            className="flex min-h-screen bg-slate-50"
            onTouchStart={swipeHandlers.onTouchStart}
            onTouchMove={swipeHandlers.onTouchMove}
            onTouchEnd={swipeHandlers.onTouchEnd}
        >
            {/* Desktop Sidebar - White Glass Theme */}
            <aside className="hidden lg:flex flex-col w-64 bg-slate-50/90 backdrop-blur-md border-r border-slate-200 fixed h-full z-20 shadow-sm text-slate-600">
                <div className="p-6 border-b border-slate-200/50">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">WeAre Portaali</h1>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{activeRestaurant?.name}</p>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map(item => {
                        if (!hasPermission(item.requiredRole)) return null;
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                    }`}
                            >
                                <Icon size={20} className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200/50 space-y-2">
                    <button
                        onClick={() => setLanguage(language === 'fi' ? 'en' : 'fi')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        <Globe size={20} className="text-slate-400" />
                        {language === 'fi' ? 'English' : 'Suomi'}
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} className="text-red-400" />
                        {t('logout')}
                    </button>
                </div>
            </aside>

            {/* Mobile Menu Drawer (Overlay) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white/95 backdrop-blur-md text-slate-900 shadow-2xl p-6 flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold tracking-tight">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                            </button>
                        </div>

                        {/* Restaurant Switcher in Mobile Menu */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t('restaurant')}</label>
                            <select
                                value={activeRestaurant?.id}
                                onChange={(e) => switchRestaurant(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                            >
                                {availableRestaurants.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>

                        <nav className="space-y-1 flex-1 overflow-y-auto">
                            {menuItems.map(item => {
                                if (!hasPermission(item.requiredRole)) return null;
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTabChange(item.id)}
                                        className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="pt-6 border-t border-slate-100 space-y-3">
                            <button
                                onClick={() => setLanguage(language === 'fi' ? 'en' : 'fi')}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                <Globe size={20} className="text-slate-400" />
                                {language === 'fi' ? 'Suomi -> English' : 'English -> Suomi'}
                            </button>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <LogOut size={20} className="text-red-400" />
                                {t('logout')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 transition-all duration-300 w-full lg:pl-64 lg:pr-64 pb-32 lg:pb-8">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white/80 backdrop-blur-md px-4 py-3 shadow-sm border-b border-slate-100 flex justify-between items-center sticky top-0 z-30 transition-all">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 active:bg-slate-100 rounded-xl transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm shadow-indigo-500/20">
                            {activeRestaurant?.name?.charAt(0) || 'W'}
                        </div>
                        <h1 className="font-bold text-slate-900 truncate max-w-[150px]">{activeRestaurant?.name}</h1>
                    </div>
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                </header>

                {/* Content Wrapper */}
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <MobileNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onToggleMenu={() => setIsMobileMenuOpen(true)}
                onLogout={onLogout}
            />
        </div>
    );
};
