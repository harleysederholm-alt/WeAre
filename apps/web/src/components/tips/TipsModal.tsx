import React from 'react';

interface TipsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    distribution: any[];
    restaurantId: string;
}

export const TipsModal: React.FC<TipsModalProps> = ({ isOpen, onClose, onApprove, distribution, restaurantId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Tip Distribution Preview</h2>
                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Employee</th>
                                <th className="text-right py-2">Allocated (€)</th>
                                <th className="text-right py-2">Payout (20€)</th>
                                <th className="text-right py-2">Remainder (€)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {distribution.map((t, idx) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="py-2">{t.employeeId}</td>
                                    <td className="text-right py-2">{t.allocated.toFixed(2)}</td>
                                    <td className="text-right py-2 font-bold text-emerald-600">{t.payout.toFixed(2)}</td>
                                    <td className="text-right py-2 text-slate-500">{t.remainder.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onApprove}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold shadow-lg"
                    >
                        Approve Distribution
                    </button>
                </div>
            </div>
        </div>
    );
};
