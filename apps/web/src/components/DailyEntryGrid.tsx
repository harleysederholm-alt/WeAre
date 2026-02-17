'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, CellFocusedEvent } from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';
import '../lib/agGridRegistry'; // Import registry to ensure modules are registered

import { useLanguage } from '../context/LanguageContext';
import { MobileSalesList, MobileRosterList } from './mobile/DailyEntryMobileList';
import { EditEntryModal } from './mobile/EditEntryModal';

interface DailyEntryGridProps {
    restaurantId: string;
    date: string;
    onFocusChange: (context: string) => void;
    onDataChange: (data: any) => void;
}

export const DailyEntryGrid: React.FC<DailyEntryGridProps> = ({ restaurantId, date, onFocusChange, onDataChange }) => {
    const { t } = useLanguage();

    // Mock Data
    const [salesData, setSalesData] = useState([
        { category: 'Ruoka', amount: 0, tax: 14 },
        { category: 'Alkoholi', amount: 0, tax: 24 },
        { category: 'Alkoholiton', amount: 0, tax: 14 },
    ]);

    const [shiftData, setShiftData] = useState([
        { name: 'Matti Meikäläinen', role: 'KOKKI', start: '10:00', end: '18:00', type: 'Normaali' },
        { name: 'Teppo Testaaja', role: 'TARJOILIJA', start: '16:00', end: '23:30', type: 'Normaali' },
    ]);

    const [cashTips, setCashTips] = useState<number>(0);
    const [voucherCount, setVoucherCount] = useState<number>(0);
    const [voucherValue, setVoucherValue] = useState<number>(0);

    // Mobile Edit State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editType, setEditType] = useState<'SALES' | 'ROSTER'>('SALES');
    const [editItem, setEditItem] = useState<any>(null);
    const [editIndex, setEditIndex] = useState<number>(-1);

    const handleEditSale = (item: any) => {
        setEditType('SALES');
        setEditItem(item);
        setEditModalOpen(true);
    };

    const handleEditShift = (item: any, index: number) => {
        setEditType('ROSTER');
        setEditItem(item);
        setEditIndex(index);
        setEditModalOpen(true);
    };

    const handleSaveEdit = (newValue: any) => {
        if (editType === 'SALES') {
            const newSales = salesData.map(s => s.category === newValue.category ? newValue : s);
            setSalesData(newSales);
        } else {
            const newShifts = [...shiftData];
            newShifts[editIndex] = newValue;
            setShiftData(newShifts);
        }
        setEditModalOpen(false);
    };

    const salesDefs = useMemo<ColDef[]>(() => [
        { field: 'category', headerName: t('category'), editable: false, flex: 1 },
        {
            field: 'amount',
            headerName: t('totalSales') + ' (€)',
            editable: true,
            type: 'numericColumn',
            valueParser: (params) => Number(params.newValue),
            flex: 1
        },
        {
            field: 'tax',
            headerName: t('tax'),
            editable: false,
            width: 100
        }
    ], [t]);

    const shiftDefs = useMemo<ColDef[]>(() => [
        { field: 'name', headerName: t('employee'), editable: true, flex: 2 },
        { field: 'role', headerName: t('role'), editable: true, flex: 1 },
        { field: 'start', headerName: t('start'), editable: true, flex: 1 },
        { field: 'end', headerName: t('end'), editable: true, flex: 1 },
        {
            field: 'type',
            headerName: t('type'),
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: { values: ['Normaali', 'Muu', 'Poissa'] },
            flex: 1
        },
    ], [t]);

    const onCellFocused = useCallback((event: CellFocusedEvent) => {
        const col = event.column;
        if (!col) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const colId = typeof col === 'string' ? col : (col as any).getColId();
        onFocusChange(`DAILY: ${colId}`);
    }, [onFocusChange]);

    useEffect(() => {
        onDataChange({ sales: salesData, shifts: shiftData, cashTips, voucherCount, voucherValue });
    }, [salesData, shiftData, cashTips, voucherCount, voucherValue, onDataChange]);

    return (
        <div className="space-y-8">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold mb-4 text-slate-800">{t('daily')} - {t('salesReport')}</h2>
                <div className="ag-theme-quartz h-[200px] w-full hidden md:block">
                    <AgGridReact
                        rowData={salesData}
                        columnDefs={salesDefs}
                        onCellFocused={onCellFocused}
                        theme={themeQuartz}
                    />
                </div>
                <MobileSalesList
                    salesData={salesData}
                    onEdit={handleEditSale}
                />
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold mb-4 text-slate-800">{t('cashTips')}</h2>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
                        <input
                            type="number"
                            className="pl-8 pr-4 py-2 border rounded-lg w-32 font-mono"
                            placeholder="0.00"
                            value={cashTips}
                            onChange={(e) => setCashTips(Number(e.target.value))}
                            onFocus={() => onFocusChange('CASH_TIPS')}
                        />
                    </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold mb-4 text-slate-800">{t('vouchers')}</h2>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <label className="block text-xs text-slate-400 mb-1">{t('voucherCount')}</label>
                        <input
                            type="number"
                            className="px-3 py-2 border rounded-lg w-24 font-mono"
                            placeholder="0"
                            value={voucherCount}
                            onChange={(e) => setVoucherCount(Number(e.target.value))}
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-xs text-slate-400 mb-1">{t('voucherValue')}</label>
                        <span className="absolute left-2 top-[29px] text-slate-500">€</span>
                        <input
                            type="number"
                            className="pl-6 pr-3 py-2 border rounded-lg w-32 font-mono"
                            placeholder="0"
                            value={voucherValue}
                            onChange={(e) => setVoucherValue(Number(e.target.value))}
                        />
                    </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold mb-4 text-slate-800">{t('roster')}</h2>
                <div className="ag-theme-quartz h-[300px] w-full hidden md:block">
                    <AgGridReact
                        rowData={shiftData}
                        columnDefs={shiftDefs}
                        onCellFocused={onCellFocused}
                        theme={themeQuartz}
                    />
                </div>
                <MobileRosterList
                    shifts={shiftData}
                    onEdit={handleEditShift}
                />
            </section>

            <EditEntryModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title={editType === 'SALES' ? editItem?.category : 'Edit Shift'}
                initialValue={editItem}
                onSave={handleSaveEdit}
                type={editType}
            />
        </div>
    );
};
