'use client';

import React, { useState } from 'react';
import { importRoster } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

interface RosterUploadProps {
    restaurantId: string;
}

export const RosterUpload: React.FC<RosterUploadProps> = ({ restaurantId }) => {
    const { t } = useLanguage();
    const [jsonInput, setJsonInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImport = async () => {
        try {
            setLoading(true);
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) throw new Error('Input must be an array of shifts');

            await importRoster(restaurantId, parsed);
            alert(t('importSuccess'));
            setJsonInput('');
        } catch (err: any) {
            alert(`${t('importFailed')}: ` + err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMock = () => {
        const today = new Date().toISOString().split('T')[0];
        const mock = [
            { employeeName: 'Matti Meikäläinen', date: today, startTime: '09:00', endTime: '17:00', role: 'KOKKI' },
            { employeeName: 'Teppo Testaaja', date: today, startTime: '10:00', endTime: '16:00', role: 'TARJOILIJA' }
        ];
        setJsonInput(JSON.stringify(mock, null, 2));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <h3 className="font-bold mb-2">{t('importRoster')}</h3>
            <textarea
                className="w-full h-32 p-2 border rounded font-mono text-xs mb-2"
                placeholder={t('pasteJson')}
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
            />
            <div className="flex gap-2">
                <button onClick={loadMock} className="text-xs text-indigo-600 hover:underline">{t('loadMock')}</button>
                <div className="flex-1"></div>
                <button
                    onClick={handleImport}
                    disabled={loading || !jsonInput}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? t('importing') : t('importRoster')}
                </button>
            </div>
        </div>
    );
};
