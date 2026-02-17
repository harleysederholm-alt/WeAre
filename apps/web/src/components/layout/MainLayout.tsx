import React, { useState } from 'react';
import { MobileNav } from './MobileNav';
import {
    Calendar, Trash2, Package, ShoppingCart,
    FileText, Users, BarChart3, FileClock, Settings, LogOut, Globe, Menu,
    Moon, Sun, Bot, Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useHelp } from '../../context/HelpContext';
import { useTheme } from '../../context/ThemeContext';
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
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Swipe Handlers
    // Swipe Handlers
    const swipeHandlers = useSwipe({
        onSwipeRight: () => setIsMobileMenuOpen(true), // Swipe Right (->) opens Left Menu
        onSwipeLeft: () => toggleSidebar(), // Swipe Left (<-) opens Help Sidebar
        edgeOnly: true,
        edgeThreshold: 80 // Widened for easier activation
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
        // DEMO MODE: Allow access to all menus for detailed testing
        return true;

        /* Original Permission Logic
        if (requiredRole === 'STAFF') return true;
        if (requiredRole === 'MANAGER') return user?.role === 'MANAGER' || user?.role === 'ADMIN';
        if (requiredRole === 'ADMIN') return user?.role === 'ADMIN';
        return false;
        */
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setIsMobileMenuOpen(false);
    };

    return (
        <div
            className="flex min-h-screen bg-slate-50 dark:bg-slate-950 overscroll-none touch-pan-y transition-colors duration-300"
            onTouchStart={swipeHandlers.onTouchStart}
            onTouchMove={swipeHandlers.onTouchMove}
            onTouchEnd={swipeHandlers.onTouchEnd}
        >
            {/* Desktop Sidebar - White Glass Theme */}
            <aside className="hidden lg:flex flex-col w-64 bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-md dark:backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 fixed h-full z-20 shadow-sm text-slate-600 dark:text-slate-400">
                <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center">
                    <img
                        src="/logo.png"
                        alt="WeAre Logo"
                        className="h-12 w-auto object-contain mix-blend-multiply mb-2"
                    />
                    <p className="text-xs text-slate-400 font-medium">{activeRestaurant?.name}</p>
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
                                    ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={20} className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {theme === 'light' ? <Moon size={20} className="text-slate-400" /> : <Sun size={20} className="text-yellow-400" />}
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                    <button
                        onClick={() => setLanguage(language === 'fi' ? 'en' : 'fi')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        <Globe size={20} className="text-slate-400" />
                        {language === 'fi' ? 'English' : 'Suomi'}
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
                    <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm glass-drawer text-slate-900 dark:text-slate-100 shadow-2xl p-6 flex flex-col animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <img
                                src="/logo.png"
                                alt="WeAre Logo"
                                className="h-10 w-auto object-contain mix-blend-multiply"
                            />
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
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
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
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
                                            ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-500/30'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                {theme === 'light' ? <Moon size={20} className="text-slate-400" /> : <Sun size={20} className="text-yellow-400" />}
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </button>
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
                <header className="lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 shadow-sm border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-30 transition-all">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 active:bg-slate-100 dark:active:bg-slate-800 rounded-xl transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                            {activeRestaurant?.name?.charAt(0) || 'W'}
                        </div>
                        <h1 className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{activeRestaurant?.name}</h1>
                    </div>
                    {/* Right side icons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-violet-500 dark:text-violet-400 hover:text-violet-600 dark:hover:text-violet-300 active:bg-violet-50 dark:active:bg-violet-900/20 rounded-full transition-colors relative group"
                        >
                            <span className="sr-only">Agent Chat</span>
                            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/50 flex items-center justify-center shadow-sm group-hover:shadow-violet-500/20 transition-all">
                                <Bot size={20} className="text-violet-600 dark:text-violet-300" strokeWidth={2.5} />
                            </div>
                            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
                        </button>

                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
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
