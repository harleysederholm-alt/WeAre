'use client';

import React, { useState } from 'react';
import { DailyEntryGrid } from '../components/DailyEntryGrid';
import { ContextSidebar } from '../components/ContextSidebar';

import { submitEod, submitWaste } from '../lib/api';
import { WasteGrid } from '../components/WasteGrid';
import { ReportsDashboard } from '../components/ReportsDashboard';
import { InventoryGrid } from '../components/InventoryGrid';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LoginForm } from '../components/LoginForm';
import { TipsModal } from '../components/tips/TipsModal';
import { FlushModal } from '../components/tips/FlushModal';
import { SettingsModal } from '../components/tips/SettingsModal';
import { AuditLogTable } from '../components/AuditLogTable';
import { PurchaseDashboard } from '../components/purchase/PurchaseDashboard';
import { OrderSuggestionDashboard } from '../components/order/OrderSuggestionDashboard';
import { ChangelogModal } from '../components/changelog/ChangelogModal';
import { RosterUpload } from '../components/roster/RosterUpload';
import { DeviationDashboard } from '../components/roster/DeviationDashboard';
import { AdminDashboard } from '../components/admin/AdminDashboard';

import { HelpProvider } from '../context/HelpContext';
import { HelpSidebar } from '../components/help/HelpSidebar';

function Dashboard() {
    const { user, logout, activeRestaurant, availableRestaurants, switchRestaurant } = useAuth();
    const [activeTab, setActiveTab] = useState<'daily' | 'waste' | 'reports' | 'inventory' | 'audit' | 'orders' | 'purchases' | 'roster' | 'admin'>('daily');

    const [reportData, setReportData] = useState<any>({});
    const [wasteData, setWasteData] = useState<any[]>([]);
    const [context, setContext] = useState<any>(null); // Daily context

    // Modal states
    const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
    const [isFlushModalOpen, setIsFlushModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    // Tips logic
    const [tipsDistribution, setTipsDistribution] = useState<any>(null);
    const [managerPolicy, setManagerPolicy] = useState({ includeManagers: false });

    // Mock data handlers (simple implementations for now)
    const handlePreviewTips = async () => {
        // This would normally call the API
        setIsTipsModalOpen(true);
    };

    const handleApproveTips = async () => {
        setIsTipsModalOpen(false);
        alert('Tips approved!');
    };

    const handleFlushTips = async () => {
        setIsFlushModalOpen(false);
        alert('Tips flushed!');
    };

    const handleSavePolicy = async (policy: any) => {
        setManagerPolicy(policy);
        setIsSettingsModalOpen(false);
    };

    if (!user) {
        return <LoginForm />;
    }

    // Pass activeRestaurant.id to API calls instead of hardcoded 'restaurant-1'
    const restaurantId = activeRestaurant?.id || 'restaurant-1';

    const handleSubmit = async () => {
        const today = new Date().toISOString().split('T')[0];

        if (activeTab === 'daily') {
            try {
                // Ensure date is present
                reportData.date = today;
                await submitEod(restaurantId, today, reportData);
                alert('Daily report submitted!');
            } catch (err: any) {
                alert('Failed to submit daily report: ' + err.message);
            }
        } else if (activeTab === 'waste') {
            try {
                // Filter for positive quantities
                const itemsToSubmit = wasteData.filter((item: any) => item.quantity > 0);

                if (itemsToSubmit.length === 0) {
                    alert('No waste items to submit (quantities must be > 0)');
                    return;
                }

                // Submit sequentially
                await Promise.all(itemsToSubmit.map((item: any) =>
                    submitWaste(restaurantId, item.itemId, Number(item.quantity), item.reason, today)
                ));

                alert(`Submitted ${itemsToSubmit.length} waste entries!`);
                setWasteData([]);
            } catch (err: any) {
                alert('Failed to submit waste log: ' + err.message);
            }
        } else if (activeTab === 'inventory') {
            alert('Inventory submission not yet implemented in this view.');
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <main className="flex-1 p-4 md:p-8 md:mr-64 transition-all duration-300">
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        {/* Restaurant Switcher */}
                        {availableRestaurants.length > 1 ? (
                            <select
                                className="bg-slate-100 border border-slate-200 font-bold text-slate-800 p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                value={activeRestaurant?.id}
                                onChange={e => switchRestaurant(e.target.value)}
                            >
                                {availableRestaurants.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="bg-indigo-600 text-white p-2 rounded-lg">
                                {/* Logo or Initials */}
                                <span className="font-bold">{activeRestaurant?.name?.charAt(0) || 'W'}</span>
                            </div>
                        )}

                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{activeRestaurant?.name || 'WeAre Portal'}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${user.role === 'MANAGER' ? 'bg-purple-500' : 'bg-green-500'}`}></span>
                                <span className="text-xs text-slate-500 font-medium">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                            {['daily', 'waste', 'inventory', 'orders', 'reports', 'audit', 'purchases', 'roster', 'admin'].map((tab) => {
                                // Permissions
                                if ((tab === 'reports' || tab === 'audit' || tab === 'purchases' || tab === 'roster') && user.role !== 'MANAGER' && user.role !== 'ADMIN') return null;
                                if (tab === 'admin' && user.role !== 'ADMIN') return null; // Only ADMIN checks this

                                const labels: Record<string, string> = {
                                    daily: 'Daily',
                                    waste: 'Diff/Waste',
                                    inventory: 'Stock',
                                    orders: 'Orders',
                                    reports: 'Reports',
                                    audit: 'Audit Log',
                                    purchases: 'Purchases',
                                    roster: 'Roster',
                                    admin: 'Admin'
                                };
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {labels[tab]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </header>

                {activeTab === 'daily' ? (
                    <DailyEntryGrid
                        restaurantId={restaurantId}
                        date={new Date().toISOString().split('T')[0]}
                        onDataChange={setReportData}
                        onFocusChange={(ctx) => setContext(ctx)}
                    />
                ) : activeTab === 'admin' ? (
                    <AdminDashboard />
                ) : activeTab === 'waste' ? (
                    <WasteGrid
                        restaurantId={restaurantId}
                        date={new Date().toISOString().split('T')[0]}
                        onDataChange={setWasteData}
                        onFocusChange={(ctx) => setContext(ctx)}
                    />
                ) : activeTab === 'inventory' ? (
                    <InventoryGrid
                        restaurantId={restaurantId}
                        onFocusChange={(ctx) => setContext(ctx)}
                    />
                ) : activeTab === 'reports' ? (
                    <ReportsDashboard restaurantId={restaurantId} />
                ) : activeTab === 'audit' ? (
                    <AuditLogTable restaurantId={restaurantId} />
                ) : activeTab === 'orders' ? (
                    <OrderSuggestionDashboard restaurantId={restaurantId} />
                ) : activeTab === 'purchases' ? (
                    <PurchaseDashboard restaurantId={restaurantId} />
                ) : activeTab === 'roster' ? (
                    <div className="space-y-8">
                        <RosterUpload restaurantId={restaurantId} />
                        <DeviationDashboard restaurantId={restaurantId} />
                    </div>
                ) : null}

                <div className="mt-8 flex justify-end gap-4">
                    {(activeTab === 'daily' || activeTab === 'waste' || activeTab === 'inventory') && (
                        <button
                            onClick={handleSubmit}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            Submit {activeTab === 'daily' ? 'Daily Report' : activeTab === 'waste' ? 'Waste Log' : 'Inventory'}
                        </button>
                    )}
                </div>
            </main>

            <ContextSidebar
                context={context}
                restaurantId={restaurantId}
            />

            <ChangelogModal />

            {/* Tips Modals */}
            <TipsModal
                isOpen={isTipsModalOpen}
                onClose={() => setIsTipsModalOpen(false)}
                distribution={tipsDistribution}
                onApprove={handleApproveTips}
                restaurantId={restaurantId}
            />
            <FlushModal
                isOpen={isFlushModalOpen}
                onClose={() => setIsFlushModalOpen(false)}
                onFlush={handleFlushTips}
                restaurantId={restaurantId}
                employees={[]}
            />
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onSave={handleSavePolicy}
                initialIncludeManagers={managerPolicy.includeManagers}
            />
        </div>
    );
}

export default function Page() {
    return (
        <AuthProvider>
            <HelpProvider>
                <Dashboard />
                <HelpSidebar />
            </HelpProvider>
        </AuthProvider>
    );
}
