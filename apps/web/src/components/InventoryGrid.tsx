'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ColDef,
    GridReadyEvent,
    ClientSideRowModelModule,
    CellStyleModule,
    ColumnAutoSizeModule,
    ValidationModule,
    TextEditorModule,
    NumberEditorModule,
    CellFocusedEvent
} from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';

import { submitInventory, getInventoryTemplate } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ComplianceModal } from './inventory/ComplianceModal';

// Register modules
import { ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    CellStyleModule,
    ColumnAutoSizeModule,
    ValidationModule,
    TextEditorModule,
    NumberEditorModule
]);

interface InventoryGridProps {
    restaurantId: string;
    onFocusChange?: (context: string) => void;
}

interface InventoryRow {
    itemId: string;
    name: string;
    quantity: number;
    unit: string;
    expected: number; // For diff calculation
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({ restaurantId, onFocusChange }) => {
    const { user } = useAuth();
    const [rowData, setRowData] = useState<InventoryRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [template, setTemplate] = useState<{ requiredItems: string[] }>({ requiredItems: [] });

    // Compliance State
    const [complianceModalOpen, setComplianceModalOpen] = useState(false);
    const [missingItems, setMissingItems] = useState<string[]>([]);
    const [pendingItems, setPendingItems] = useState<any[]>([]);

    // Load initial data
    useEffect(() => {
        // Mock Master Items
        const masterItems: InventoryRow[] = [
            { itemId: 'item-1', name: 'Coffee Beans', quantity: 0, unit: 'kg', expected: 0 },
            { itemId: 'item-2', name: 'Maito 1L', quantity: 0, unit: 'L', expected: 0 }, // Renamed to match mock template
            { itemId: 'item-3', name: 'Kahvipavut 1kg', quantity: 0, unit: 'L', expected: 0 }, // Renamed
            { itemId: 'item-4', name: 'Sugar', quantity: 0, unit: 'kg', expected: 0 },
            { itemId: 'item-5', name: 'Paper Cups (Large)', quantity: 0, unit: 'pcs', expected: 0 },
            { itemId: 'item-6', name: 'Paper Cups (Small)', quantity: 0, unit: 'pcs', expected: 0 },
            { itemId: 'item-7', name: 'Napkins', quantity: 0, unit: 'pcs', expected: 0 },
            { itemId: 'item-8', name: 'Trash Bags', quantity: 0, unit: 'roll', expected: 0 },
            { itemId: 'item-9', name: 'Dish Soap', quantity: 0, unit: 'L', expected: 0 },
        ];
        setRowData(masterItems);

        // Fetch Template
        getInventoryTemplate(restaurantId).then(setTemplate).catch(console.error);
    }, [restaurantId]);

    const colDefs: ColDef[] = useMemo(() => [
        {
            field: 'name',
            headerName: 'Item',
            flex: 2,
            editable: false,
            cellRenderer: (params: any) => {
                const isRequired = template.requiredItems.includes(params.value);
                return (
                    <span className="flex items-center gap-2">
                        {params.value}
                        {isRequired && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded border border-red-200 font-bold" title="Required Item">REQ</span>}
                    </span>
                );
            }
        },
        {
            field: 'quantity',
            headerName: 'Count (On Hand)',
            flex: 1,
            editable: true,
            type: 'numericColumn',
            valueParser: params => Number(params.newValue),
            cellStyle: (params) => {
                // Highlight if required but 0/empty? Maybe too aggressive.
                return { fontWeight: 'bold', backgroundColor: '#f0f9ff' };
            }
        },
        { field: 'unit', headerName: 'Unit', flex: 0.5, editable: false },
    ], [template]);

    const onGridReady = (params: GridReadyEvent) => {
        params.api.sizeColumnsToFit();
    };

    const handleCellFocused = useCallback((event: CellFocusedEvent) => {
        const col = event.column;
        if (!col) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const colId = typeof col === 'string' ? col : (col as any).getColId();

        let helpText = '';
        if (colId === 'quantity') helpText = 'Enter the physical count currently on hand.';
        if (onFocusChange) onFocusChange(helpText);
    }, [onFocusChange]);

    const handleSubmit = async (overrideReason?: string) => {
        if (loading) return;
        setLoading(true);

        const items = pendingItems.length > 0 ? pendingItems : rowData.map(row => ({
            itemId: row.itemId,
            name: row.name, // Send name for simple validation on backend
            quantity: Number(row.quantity) || 0
        }));

        try {
            // Basic Validation
            const negativeItems = items.filter(i => i.quantity < 0);
            if (negativeItems.length > 0) {
                alert('Cannot submit negative quantities.');
                setLoading(false);
                return;
            }

            await submitInventory(
                restaurantId,
                new Date().toISOString().split('T')[0],
                items,
                user?.role,
                overrideReason
            );

            alert('Inventory count submitted successfully!');
            setComplianceModalOpen(false);
            setPendingItems([]);
        } catch (err: any) {
            // Check for Compliance Error
            if (err.message && err.message.includes('COMPLIANCE_ERROR')) {
                // Extract missing items from error message "Missing required items: A, B"
                const missingStr = err.message.split(': ')[1] || '';
                const missing = missingStr.split(', ');
                setMissingItems(missing);
                setPendingItems(items); // Save items to state so we can re-submit with override
                setComplianceModalOpen(true);
            } else {
                alert(`Error submitting inventory: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold">Inventaario (Stock Count)</h2>
                <span className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</span>
            </div>

            <div className="bg-white border rounded-lg shadow-sm overflow-hidden" style={{ height: '500px' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    theme={themeQuartz}
                    onGridReady={onGridReady}
                    onCellFocused={handleCellFocused}
                    stopEditingWhenCellsLoseFocus={true}
                />
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-500">
                    * Items marked <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded border border-red-200 font-bold">REQ</span> are required.
                </p>
                <button
                    onClick={() => handleSubmit()}
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'
                        }`}
                >
                    {loading ? 'Submitting...' : 'Submit Count'}
                </button>
            </div>

            <ComplianceModal
                isOpen={complianceModalOpen}
                onClose={() => setComplianceModalOpen(false)}
                onOverride={(reason) => handleSubmit(reason)}
                missingItems={missingItems}
                isManager={user?.role === 'MANAGER'}
            />
        </div>
    );
};
