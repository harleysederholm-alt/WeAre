'use client';

import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

interface AuditLogTableProps {
    restaurantId: string;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ restaurantId }) => {
    const { t } = useLanguage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuditLogs(restaurantId)
            .then(data => {
                setLogs(data);
                setLoading(false);
            })
            .catch(console.error);
    }, [restaurantId]);

    if (loading) return <div>{t('loading')}</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">{t('audit')}</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="p-3">Timestamp</th>
                            <th className="p-3">Action</th>
                            <th className="p-3">Actor</th>
                            <th className="p-3">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50">
                                <td className="p-3 whitespace-nowrap text-slate-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="p-3 font-medium text-slate-700">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-3 text-slate-600">{log.actor}</td>
                                <td className="p-3 text-slate-600 max-w-md truncate" title={JSON.stringify(log.details, null, 2)}>
                                    {log.details?.description || JSON.stringify(log.details)}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-400">No audit logs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
