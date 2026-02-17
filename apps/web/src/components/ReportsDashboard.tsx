'use client';

import React, { useEffect, useState } from 'react';
import { getReports, downloadPdf } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface ReportsDashboardProps {
    restaurantId: string;
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ restaurantId }) => {
    const { user } = useAuth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'MANAGER') {
            getReports(restaurantId, user.role)
                .then(data => {
                    setReports(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    const handleDownload = async (date: string) => {
        try {
            const blob = await downloadPdf('restaurant-1', date);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report-${date}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err: any) {
            alert('Failed to download PDF: ' + err.message);
        }
    };

    if (loading) return <div>Loading reports...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Johdon Raportit (Management Reports)</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Date</th>
                            <th className="py-2 px-4 border-b text-right">Total Sales (€)</th>
                            <th className="py-2 px-4 border-b text-right">Cash (€)</th>
                            <th className="py-2 px-4 border-b text-right">Tips (€)</th>
                            <th className="py-2 px-4 border-b text-right text-red-600">Waste Cost (€)</th>
                            <th className="py-2 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{row.date}</td>
                                <td className="py-2 px-4 border-b text-right font-medium">{row.total_sales}</td>
                                <td className="py-2 px-4 border-b text-right">{row.total_cash}</td>
                                <td className="py-2 px-4 border-b text-right">{row.total_tips}</td>
                                <td className="py-2 px-4 border-b text-right text-red-600">{row.total_waste_cost}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        onClick={() => handleDownload(row.date)}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        Download PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {reports.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-4 text-center text-gray-500">No reports found. Submit EOD to see data here.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <p className="text-sm text-gray-500 mt-2">
                * Waste Cost is calculated using the frozen price at the moment of waste logging.
            </p>
        </div>
    );
};
