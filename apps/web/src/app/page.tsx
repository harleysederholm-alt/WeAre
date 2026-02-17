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
import { NoteModal } from '../components/NoteModal';
import { MainLayout } from '../components/layout/MainLayout';
import { FloatingActionButton } from '../components/layout/FloatingActionButton';

import { HelpProvider } from '../context/HelpContext';
import { HelpSidebar } from '../components/help/HelpSidebar';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

function Dashboard() {
    const { user, logout, activeRestaurant, availableRestaurants, switchRestaurant } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'daily' | 'waste' | 'reports' | 'inventory' | 'audit' | 'orders' | 'purchases' | 'roster' | 'admin'>('daily');

    const [reportData, setReportData] = useState<any>({});
    const [wasteData, setWasteData] = useState<any[]>([]);
    const [context, setContext] = useState<any>(null); // Daily context

    // Modal states
    const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
    const [isFlushModalOpen, setIsFlushModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

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

    const handleAddNote = (note: string) => {
        console.log('Note added:', note);
        alert('Note saved: ' + note);
        setIsNoteModalOpen(false);
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
        <MainLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeRestaurant={activeRestaurant}
            availableRestaurants={availableRestaurants}
            switchRestaurant={switchRestaurant}
            onLogout={logout}
        >
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
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 text-lg h-14 w-full md:w-auto"
                    >
                        {activeTab === 'daily' ? t('submitDaily') : activeTab === 'waste' ? t('submitWaste') : t('submitInventory')}
                    </button>
                )}
            </div>

            <ContextSidebar
                context={context}
                restaurantId={restaurantId}
                activeTab={activeTab}
                onAddNote={() => setIsNoteModalOpen(true)}
            />

            <NoteModal
                isOpen={isNoteModalOpen}
                onClose={() => setIsNoteModalOpen(false)}
                onSave={handleAddNote}
                contextTitle={activeTab.toUpperCase()}
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
            <HelpSidebar onAddNote={() => setIsNoteModalOpen(true)} />

            <FloatingActionButton
                activeTab={activeTab}
                onAction={(action) => {
                    if (action === 'submit_daily') handleSubmit();
                    if (action === 'add_waste') setActiveTab('waste'); // Or scroll to add? WasteGrid adds via row. 
                    // Actually, WasteGrid might need a 'Add Item' button if it's empty? 
                    // FAB for Waste usually means "Add Waste Log".
                    if (action === 'submit_inventory') handleSubmit();
                    if (action === 'send_order') alert('Order sending implemented in v2');
                }}
            />
        </MainLayout>
    );
}

export default function Page() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <HelpProvider>
                    <Dashboard />
                </HelpProvider>
            </LanguageProvider>
        </AuthProvider>
    );
}
