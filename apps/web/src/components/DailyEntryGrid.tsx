'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { ColDef, ModuleRegistry, CellFocusedEvent } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    ValidationModule,
    TextEditorModule,
    SelectEditorModule,
    CellStyleModule,
    ColumnAutoSizeModule
} from 'ag-grid-community';

// Register modules
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ValidationModule,
    TextEditorModule,
    SelectEditorModule,
    CellStyleModule,
    ColumnAutoSizeModule
]);

// Styles
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { useHelp } from '../context/HelpContext';

interface DailyEntryGridProps {
    restaurantId: string;
    date: string;
    onFocusChange: (context: string) => void;
    onDataChange: (data: any) => void;
}

export const DailyEntryGrid: React.FC<DailyEntryGridProps> = ({ restaurantId, date, onFocusChange, onDataChange }) => {
    const { setContext } = useHelp();

    React.useEffect(() => {
        setContext('daily_sales');
    }, [setContext]);

    // Mock Data for scaffolding
    const [salesData, setSalesData] = useState([
        { category: 'Food', amount: 0, tax: 14 },
        { category: 'Alcohol', amount: 0, tax: 24 },
    ]);

    const [shiftData, setShiftData] = useState([
        { name: 'Alice', type: 'Normaali', start: '10:00', end: '16:00', hours: 6 },
        { name: 'Bob', type: 'Muu', start: '16:00', end: '22:00', hours: 6 },
    ]);

    const salesDefs: ColDef[] = [
        { field: 'category', editable: false },
        { field: 'amount', editable: true, valueParser: params => Number(params.newValue) },
        { field: 'tax', editable: false },
    ];

    const shiftDefs: ColDef[] = [
        { field: 'name', editable: true },
        {
            field: 'type',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: { values: ['Normaali', 'Poissa', 'Muu'] }
        },
        { field: 'start', editable: true },
        { field: 'end', editable: true },
        { field: 'hours', editable: true, valueParser: params => Number(params.newValue) },
    ];

    const [cashTips, setCashTips] = useState<number>(0);
    const [voucherCount, setVoucherCount] = useState<number>(0);
    const [voucherValue, setVoucherValue] = useState<number>(0);

    const onCellFocused = useCallback((event: CellFocusedEvent) => {
        // Determine context based on column/row
        const col = event.column;
        if (!col) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const colId = typeof col === 'string' ? col : (col as any).getColId();

        let helpText = "";
        if (colId === 'type') {
            helpText = "Shift Type: 'Normaali' earns tips. 'Muu' is for training, 'Poissa' is sick leave.";
        } else if (colId === 'amount') {
            helpText = "Enter gross sales including VAT.";
        } else {
            helpText = `Editing ${colId}...`;
        }

        onFocusChange(helpText);
    }, [onFocusChange]);

    // Mock data change to parent
    React.useEffect(() => {
        onDataChange({ sales: salesData, shifts: shiftData, cashTips, voucherCount, voucherValue });
    }, [salesData, shiftData, cashTips, voucherCount, voucherValue, onDataChange]);

    return (
        <div className="space-y-8">
            <div className="ag-theme-quartz" style={{ height: 200, width: '100%' }}>
                <h3 className="font-bold mb-2">Myynti (Sales)</h3>
                <AgGridReact
                    rowData={salesData}
                    columnDefs={salesDefs}
                    onCellFocused={onCellFocused}
                />
            </div>

            {/* Cash Tips Input */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold mb-2 text-slate-700">Käteiset Tipit (Cash Tips)</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
                        <input
                            type="number"
                            className="pl-8 pr-4 py-2 border rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-slate-400"
                            value={cashTips}
                            onChange={(e) => setCashTips(Number(e.target.value))}
                            onFocus={() => onFocusChange("Enter total cash tips found in the drawer.")}
                        />
                    </div>
                    <p className="text-sm text-slate-500">
                        Total cash tips to be distributed among eligible staff.
                    </p>
                </div>
            </div>

            {/* Vouchers Input */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold mb-2 text-slate-700">Lounasetelit (Vouchers)</h3>
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <label className="text-xs text-slate-500 mb-1">Count (kpl)</label>
                        <input
                            type="number"
                            className="px-3 py-2 border rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-slate-400"
                            value={voucherCount}
                            onChange={(e) => setVoucherCount(Number(e.target.value))}
                            onFocus={() => onFocusChange("Enter number of physical vouchers received.")}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-slate-500 mb-1">Total Value (€)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
                            <input
                                type="number"
                                className="pl-8 pr-4 py-2 border rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                value={voucherValue}
                                onChange={(e) => setVoucherValue(Number(e.target.value))}
                                onFocus={() => onFocusChange("Enter total monetary value of vouchers.")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="ag-theme-quartz" style={{ height: 300, width: '100%' }}>
                <h3 className="font-bold mb-2">Työvuorot (Shifts)</h3>
                <AgGridReact
                    rowData={shiftData}
                    columnDefs={shiftDefs}
                    onCellFocused={onCellFocused}
                />
            </div>
        </div>
    );
};
