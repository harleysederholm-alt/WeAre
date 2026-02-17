import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, Check, Minus } from 'lucide-react';

interface EditEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    initialValue: any;
    onSave: (value: any) => void;
    type: 'SALES' | 'ROSTER';
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({ isOpen, onClose, title, initialValue, onSave, type }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<any>(initialValue);

    useEffect(() => {
        setFormData(initialValue);
    }, [initialValue]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    const toggleSign = () => {
        if (formData?.amount) {
            setFormData({ ...formData, amount: formData.amount * -1 });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

            <div className="relative z-10 bg-white w-full sm:max-w-md rounded-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-900">{title}</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">
                    {type === 'SALES' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                                {t('amount')} (€)
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleSign}
                                    className="p-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 active:scale-95 transition-transform"
                                    title="Vaihda etumerkki (+/-)"
                                >
                                    <Minus size={24} />
                                </button>
                                <input
                                    type="number"
                                    className="flex-1 text-3xl font-mono font-bold border-b-2 border-indigo-100 focus:border-indigo-600 outline-none py-2 bg-transparent text-slate-900 placeholder:text-slate-200 text-right"
                                    placeholder="0.00"
                                    value={formData?.amount || ''}
                                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {type === 'ROSTER' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('employee')}</label>
                                <input
                                    className="w-full p-3 bg-slate-50 rounded-lg font-bold text-slate-700"
                                    value={formData?.name || ''}
                                    disabled
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('start')}</label>
                                    <input
                                        type="time"
                                        className="w-full p-3 border border-slate-200 rounded-lg text-lg font-mono"
                                        value={formData?.start || ''}
                                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('end')}</label>
                                    <input
                                        type="time"
                                        className="w-full p-3 border border-slate-200 rounded-lg text-lg font-mono"
                                        value={formData?.end || ''}
                                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('type')}</label>
                                <select
                                    className="w-full p-3 border border-slate-200 rounded-lg bg-white"
                                    value={formData?.type || 'Normaali'}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Normaali">Normaali</option>
                                    <option value="Muu">Muu</option>
                                    <option value="Poissa">Poissa</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl sm:rounded-b-xl">
                    <button
                        onClick={handleSave}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                    >
                        <Check size={20} />
                        {t('saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    );
};
