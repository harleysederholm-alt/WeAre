'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, CellValueChangedEvent } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    ValidationModule,
    TextEditorModule,
    NumberEditorModule,
    DateEditorModule,
    CellStyleModule,
    ColumnAutoSizeModule
} from 'ag-grid-community';
import { ingestEmail, getPendingPurchases, confirmPurchase } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

// Register modules
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ValidationModule,
    TextEditorModule,
    NumberEditorModule,
    DateEditorModule,
    CellStyleModule,
    ColumnAutoSizeModule
]);

import 'ag-grid-community/styles/ag-theme-quartz.css';

interface PurchaseDashboardProps {
    restaurantId: string;
}

export const PurchaseDashboard: React.FC<PurchaseDashboardProps> = ({ restaurantId }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'ingest' | 'review'>('review');
    const [pendingOrders, setPendingOrders] = useState<any[]>([]);

    // Ingest State
    const [emailText, setEmailText] = useState('');
    const [ingestStatus, setIngestStatus] = useState('');

    // Review State
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [reviewItems, setReviewItems] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === 'review') {
            loadPending();
        }
    }, [activeTab]);

    const loadPending = async () => {
        try {
            const data = await getPendingPurchases();
            setPendingOrders(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleIngest = async () => {
        if (!emailText) return;
        try {
            await ingestEmail({
                sender: 'test@tukku.fi', // Simulated
                subject: 'Order #123',
                body: emailText
            });
            setIngestStatus(t('success'));
            setEmailText('');
            setTimeout(() => {
                setIngestStatus('');
                setActiveTab('review');
            }, 1000);
        } catch (err: any) {
            setIngestStatus(`${t('error')}: ${err.message}`);
        }
    };

    const handleSelectOrder = (order: any) => {
        setSelectedOrder(order);
        setReviewItems(order.items.map((i: any) => ({ ...i }))); // Clone
    };

    const handleConfirm = async () => {
        if (!selectedOrder) return;
        try {
            await confirmPurchase(selectedOrder.id, selectedOrder.orderDate, reviewItems);
            alert(t('success'));
            setSelectedOrder(null);
            loadPending();
        } catch (err: any) {
            alert(`${t('error')}: ${err.message}`);
        }
    };

    // Grid Defs
    const colDefs: ColDef[] = useMemo(() => [
        { field: 'name', headerName: t('item'), flex: 2, editable: true },
        { field: 'ean', headerName: 'EAN', flex: 1, editable: true },
        { field: 'quantity', headerName: t('quantity'), width: 90, editable: true, type: 'numericColumn' },
        { field: 'unitPrice', headerName: 'Price', width: 90, editable: true, type: 'numericColumn' },
        {
            field: 'total',
            headerName: 'Total',
            width: 90,
            valueGetter: params => (params.data.quantity * params.data.unitPrice).toFixed(2)
        }
    ], [t]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
            {/* Header / Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('review')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'review' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t('pendingPurchases')} ({pendingOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab('ingest')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'ingest' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t('ingestEmail')}
                </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'ingest' && (
                    <div className="max-w-2xl mx-auto space-y-4">
                        <h3 className="font-bold text-slate-800">Paste Supplier Email Text</h3>
                        <p className="text-sm text-slate-500">
                            Simulate receiving an email from a supplier. Try the format:
                            <br />
                            <code className="bg-slate-100 p-1 rounded text-xs block mt-2">
                                - Milk 1L (EAN: 64101) x 10 @ 1.50
                            </code>
                        </p>
                        <textarea
                            className="w-full h-64 p-3 border rounded-md font-mono text-sm focus:ring-2 focus:ring-indigo-500"
                            placeholder="Paste email body here..."
                            value={emailText}
                            onChange={e => setEmailText(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                            <span className={ingestStatus.includes('Error') ? 'text-red-500' : 'text-green-600'}>
                                {ingestStatus}
                            </span>
                            <button
                                onClick={handleIngest}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                            >
                                {t('process')}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'review' && (
                    <div className="flex gap-6 h-full">
                        {/* List */}
                        <div className="w-1/3 border-r border-slate-100 pr-6 space-y-3">
                            {pendingOrders.length === 0 && <p className="text-slate-400 text-sm">No pending orders.</p>}
                            {pendingOrders.map(order => (
                                <div
                                    key={order.id}
                                    onClick={() => handleSelectOrder(order)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedOrder?.id === order.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-700">{order.supplierName}</h4>
                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{order.orderDate}</p>
                                    <p className="text-xs text-slate-400 mt-2">{order.items.length} items found</p>
                                </div>
                            ))}
                        </div>

                        {/* Detail / Editor */}
                        <div className="flex-1 flex flex-col">
                            {selectedOrder ? (
                                <>
                                    <div className="mb-4 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lg">Review Order</h3>
                                            <p className="text-sm text-slate-500">Edit any parsing errors before confirming.</p>
                                        </div>
                                        <button
                                            onClick={handleConfirm}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm"
                                        >
                                            {t('confirm')}
                                        </button>
                                    </div>

                                    <div className="ag-theme-quartz flex-1 w-full">
                                        <AgGridReact
                                            rowData={reviewItems}
                                            columnDefs={colDefs}
                                            onCellValueChanged={(e: CellValueChangedEvent) => {
                                                // Update local state when grid is edited
                                                const newItems = [...reviewItems];
                                                newItems[e.rowIndex!] = e.data;
                                                setReviewItems(newItems);
                                            }}
                                        />
                                    </div>

                                    <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                                        <strong>Original Raw Text:</strong><br />
                                        {selectedOrder.rawBody}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <p>Select an order to review</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
