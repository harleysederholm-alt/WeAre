import React, { useEffect, useState } from 'react';

// Mock API call
const fetchSuggestions = async () => {
    // In real app: return api.get('/master/suggestions');
    return [];
};

export const ApprovalDashboard: React.FC = () => {
    const [suggestions, setSuggestions] = useState<any[]>([]);

    useEffect(() => {
        fetchSuggestions().then(setSuggestions);
    }, []);

    if (suggestions.length === 0) {
        return <div className="p-4 text-slate-500">No pending suggestions.</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-medium border-b">
                    <tr>
                        <th className="p-3">Item</th>
                        <th className="p-3">Issue</th>
                        <th className="p-3">Suggestion</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suggestions.map(s => (
                        <tr key={s.id} className="border-b hover:bg-slate-50">
                            <td className="p-3">{s.itemName}</td>
                            <td className="p-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">{s.issueType}</span></td>
                            <td className="p-3">{s.suggestedValue}</td>
                            <td className="p-3">
                                <button className="text-green-600 hover:underline mr-3">Approve</button>
                                <button className="text-red-600 hover:underline">Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
