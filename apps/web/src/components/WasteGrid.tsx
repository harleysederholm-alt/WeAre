'use client';

import React, { useCallback, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, CellFocusedEvent } from 'ag-grid-community';
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

// Register modules (idempotent)
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

import 'ag-grid-community/styles/ag-theme-quartz.css';

import { useHelp } from '../context/HelpContext';

interface WasteGridProps {
    restaurantId: string;
    date: string;
    onFocusChange: (context: string) => void;
    onDataChange: (data: any[]) => void;
}

export const WasteGrid: React.FC<WasteGridProps> = ({ restaurantId, date, onFocusChange, onDataChange }) => {
    const { setContext } = useHelp();

    React.useEffect(() => {
        setContext('waste_log');
    }, [setContext]);

    // Mock Data for scaffolding - in real app, fetch items from backend
    const [wasteData, setWasteData] = useState([
        { itemId: 'item-1', name: 'Beer 0.5L', quantity: 0, reason: 'Spilled' },
        { itemId: 'item-2', name: 'Burger Bun', quantity: 0, reason: 'Expired' },
    ]);

    const colDefs: ColDef[] = [
        { field: 'name', headerName: 'Item', editable: false, flex: 1 },
        {
            field: 'quantity',
            headerName: 'Qty',
            editable: true,
            cellEditor: 'agNumberCellEditor',
            valueParser: params => Number(params.newValue),
            width: 100
        },
        {
            field: 'reason',
            headerName: 'Reason',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Spilled', 'Expired', 'Wrong Order', 'Quality Issue']
            },
            flex: 1
        }
    ];

    const onCellFocused = useCallback((event: CellFocusedEvent) => {
        const col = event.column;
        if (!col) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const colId = typeof col === 'string' ? col : (col as any).getColId();

        let helpText = "";
        if (colId === 'quantity') {
            helpText = "Enter amount wasted. Costs will be calculated at today's frozen price.";
        } else if (colId === 'reason') {
            helpText = "Select the primary reason for waste.";
        } else {
            helpText = "Logging waste locks the cost permanently.";
        }

        onFocusChange(helpText);
    }, [onFocusChange]);

    // Notify parent of changes
    React.useEffect(() => {
        onDataChange(wasteData);
    }, [wasteData, onDataChange]);

    return (
        <div className="ag-theme-quartz" style={{ height: 400, width: '100%' }}>
            <h3 className="font-bold mb-2">Hävikki (Waste Log)</h3>
            <AgGridReact
                rowData={wasteData}
                columnDefs={colDefs}
                onCellFocused={onCellFocused}
            />
        </div>
    );
};
