'use client';

import React, { useEffect, useState } from 'react';
import { getDeviations, ackDeviation, triggerAnalysis } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

interface DeviationDashboardProps {
    restaurantId: string;
}

export const DeviationDashboard: React.FC<DeviationDashboardProps> = ({ restaurantId }) => {
    const { t } = useLanguage();
    const [deviations, setDeviations] = useState<any[]>([]);
    const [analyzing, setAnalyzing] = useState(false);

    const fetchDeviations = async () => {
        try {
            const data = await getDeviations(restaurantId);
            setDeviations(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDeviations();
    }, []);

    const handleAck = async (id: string) => {
        try {
            await ackDeviation(id);
            fetchDeviations();
        } catch (err) {
            alert('Failed to acknowledge');
        }
    };

    const runAnalysis = async () => {
        setAnalyzing(true);
        try {
            // Mock actual shifts for the "Run Analysis" button
            // In reality, this data comes from the DB (Daily Reports)
            const today = new Date().toISOString().split('T')[0];
            const mockActuals = [
                { name: 'Matti Meikäläinen', start: '09:30', end: '17:00' }, // Late start
                // Teppo is missing
                { name: 'Kalle Kokki', start: '12:00', end: '20:00' } // Extra shift
            ];

            await triggerAnalysis(restaurantId, today, mockActuals);
            fetchDeviations();
        } catch (err: any) {
            alert('Analysis failed: ' + err.message);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{t('shiftDeviations')}</h3>
                <button
                    onClick={runAnalysis}
                    disabled={analyzing}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-medium hover:bg-indigo-200"
                >
                    {analyzing ? t('analyzing') : t('runAnalysis')}
                </button>
            </div>

            {deviations.length === 0 ? (
                <p className="text-slate-500 italic">{t('noDeviations')}</p>
            ) : (
                <div className="space-y-2">
                    {deviations.map(dev => (
                        <div key={dev.id} className={`p-4 rounded-lg border flex justify-between items-center ${dev.severity === 'CRITICAL' ? 'bg-red-50 border-red-200' :
                            dev.severity === 'REVIEW' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'
                            }`}>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{dev.employeeName}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${dev.type === 'LATE_START' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                        dev.type === 'MISSING_SHIFT' ? 'bg-red-100 text-red-800 border-red-200' :
                                            'bg-blue-100 text-blue-800 border-blue-200'
                                        }`}>{dev.type}</span>
                                </div>
                                <p className="text-sm text-slate-600">{dev.details}</p>
                                <p className="text-xs text-slate-400">{dev.date}</p>
                            </div>
                            <button
                                onClick={() => handleAck(dev.id)}
                                className="px-3 py-1 bg-white border border-slate-200 shadow-sm rounded text-sm hover:bg-slate-50"
                            >
                                {t('acknowledge')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
