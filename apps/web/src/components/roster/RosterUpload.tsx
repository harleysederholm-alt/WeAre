import React, { useState } from 'react';
import { importRoster } from '../../lib/api';

interface RosterUploadProps {
    restaurantId: string;
}

export const RosterUpload: React.FC<RosterUploadProps> = ({ restaurantId }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImport = async () => {
        try {
            setLoading(true);
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) throw new Error('Input must be an array of shifts');

            await importRoster(restaurantId, parsed);
            alert('Roster Imported Successfully!');
            setJsonInput('');
        } catch (err: any) {
            alert('Import Failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMock = () => {
        const today = new Date().toISOString().split('T')[0];
        const mock = [
            { employeeName: 'Matti Meikäläinen', date: today, startTime: '09:00', endTime: '17:00', role: 'CHEF' },
            { employeeName: 'Teppo Testaaja', date: today, startTime: '10:00', endTime: '16:00', role: 'WAITER' }
        ];
        setJsonInput(JSON.stringify(mock, null, 2));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <h3 className="font-bold mb-2">Import Planned Roster (MaraPlan)</h3>
            <textarea
                className="w-full h-32 p-2 border rounded font-mono text-xs mb-2"
                placeholder="Paste JSON here..."
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
            />
            <div className="flex gap-2">
                <button onClick={loadMock} className="text-xs text-indigo-600 hover:underline">Load Mock Data</button>
                <div className="flex-1"></div>
                <button
                    onClick={handleImport}
                    disabled={loading || !jsonInput}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Importing...' : 'Import Roster'}
                </button>
            </div>
        </div>
    );
};
