import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface FlushModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFlush: (employee: string, amount: number, mode: 'NORMAL_20S' | 'FULL_SETTLEMENT') => void;
    restaurantId: string;
    employees: any[];
}

export const FlushModal: React.FC<FlushModalProps> = ({ isOpen, onClose, onFlush, restaurantId, employees }) => {
    const { t } = useLanguage();
    const [employee, setEmployee] = useState('');
    const [amount, setAmount] = useState(0);
    const [mode, setMode] = useState<'NORMAL_20S' | 'FULL_SETTLEMENT'>('NORMAL_20S');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onFlush(employee, amount, mode);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{t('flushTips')}</h2>
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Employee Name/ID</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            value={employee}
                            onChange={(e) => setEmployee(e.target.value)}
                            placeholder="e.g. Alice"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('amount')} (€)</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-md"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('payoutMode')}</label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={mode}
                            onChange={(e) => setMode(e.target.value as any)}
                        >
                            <option value="NORMAL_20S">{t('normalFlush')}</option>
                            <option value="FULL_SETTLEMENT">{t('fullSettlement')}</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg"
                    >
                        {t('confirmPayout')}
                    </button>
                </div>
            </div>
        </div>
    );
};
