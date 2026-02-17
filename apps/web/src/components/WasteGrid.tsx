'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, CellFocusedEvent, NewValueParams } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    ValidationModule,
    TextEditorModule,
    SelectEditorModule,
    NumberEditorModule,
    DateEditorModule,
    CellStyleModule,
    ColumnAutoSizeModule
} from 'ag-grid-community';

// Register modules
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ValidationModule,
    TextEditorModule,
    SelectEditorModule,
    NumberEditorModule,
    DateEditorModule,
    CellStyleModule,
    ColumnAutoSizeModule
]);

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional theme CSS

import { useLanguage } from '../context/LanguageContext';

interface WasteGridProps {
    restaurantId: string;
    date: string;
    onFocusChange: (context: string) => void;
    onDataChange: (data: any) => void;
}

export const WasteGrid: React.FC<WasteGridProps> = ({ restaurantId, date, onFocusChange, onDataChange }) => {
    const { t } = useLanguage();
    const [rowData, setRowData] = useState([
        { itemId: '1', name: 'Beer 0.5L', quantity: 0, reason: 'Spilled' },
        { itemId: '2', name: 'Burger Bun', quantity: 0, reason: 'Expired' },
        { itemId: '3', name: 'Coffee Beans', quantity: 0, reason: 'Quality' },
    ]);

    const columnDefs = useMemo<ColDef[]>(() => [
        { field: 'name', headerName: t('item'), flex: 1, minWidth: 140 },
        {
            field: 'quantity',
            headerName: t('quantity'),
            editable: true,
            type: 'numericColumn',
            valueParser: params => Number(params.newValue),
            width: 100,
            minWidth: 100
        },
        {
            field: 'reason',
            headerName: t('reason'),
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Spilled', 'Expired', 'Quality', 'Staff Meal', 'Theft']
            },
            flex: 1,
            minWidth: 120
        }
    ], [t]);

    const onCellFocused = useCallback((event: CellFocusedEvent) => {
        const col = event.column;
        if (!col) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const colId = typeof col === 'string' ? col : (col as any).getColId();
        onFocusChange(`WASTE: ${colId}`);
    }, [onFocusChange]);

    const handleCellValueChanged = (params: NewValueParams) => {
        if (!params.node || params.node.rowIndex === null || params.node.rowIndex === undefined) return;
        const updatedData = [...rowData];
        updatedData[params.node.rowIndex] = params.data;
        setRowData(updatedData);
        onDataChange(updatedData);
    };

    return (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold mb-4 text-slate-800">{t('wasteLog')}</h2>
            <div className="ag-theme-quartz h-[400px] w-full">
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={{ sortable: true, filter: true, resizable: true }}
                    onCellValueChanged={handleCellValueChanged}
                    onCellFocused={onCellFocused}
                />
            </div>
        </section>
    );
};
