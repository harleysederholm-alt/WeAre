import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronRight, Edit2 } from 'lucide-react';

interface MobileSalesListProps {
    salesData: any[];
    onEdit: (data: any) => void;
}

export const MobileSalesList: React.FC<MobileSalesListProps> = ({ salesData, onEdit }) => {
    return (
        <div className="space-y-3 md:hidden">
            {salesData.map((item) => (
                <div
                    key={item.category}
                    onClick={() => onEdit(item)}
                    className="bg-white dark:bg-slate-900/50 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center active:scale-95 transition-transform"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Edit2 size={16} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 dark:text-slate-100">{item.category}</div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">TAX: {item.tax}%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`font-mono font-bold text-lg ${item.amount > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-600'}`}>
                            {item.amount.toFixed(2)}€
                        </span>
                        <ChevronRight size={20} className="text-slate-300" />
                    </div>
                </div>
            ))}
        </div>
    );
};

interface MobileRosterListProps {
    shifts: any[];
    onEdit: (data: any, index: number) => void;
}

export const MobileRosterList: React.FC<MobileRosterListProps> = ({ shifts, onEdit }) => {
    return (
        <div className="space-y-3 md:hidden">
            {shifts.map((shift, index) => (
                <div
                    key={index}
                    onClick={() => onEdit(shift, index)}
                    className="bg-white dark:bg-slate-900/50 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center active:scale-95 transition-transform"
                >
                    <div className="flex items-center gap-3">
                        {/* Role Badge */}
                        <div className={`w-2 h-10 rounded-full ${shift.role === 'CHEF' ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                        <div>
                            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">{shift.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex gap-2">
                                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">{shift.start} - {shift.end}</span>
                                <span>• {shift.role}</span>
                            </div>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300" />
                </div>
            ))}
        </div>
    );
};
