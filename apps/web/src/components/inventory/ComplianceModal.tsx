import React, { useState } from 'react';

interface ComplianceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOverride: (reason: string) => void;
    missingItems: string[];
    isManager: boolean;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose, onOverride, missingItems, isManager }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex items-start gap-4 mb-4">
                    <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Incomplete Inventory</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            The following <strong>Required Items</strong> match the template but have not been counted:
                        </p>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6 max-h-40 overflow-y-auto">
                    <ul className="list-disc list-inside text-sm text-slate-700">
                        {missingItems.map(item => (
                            <li key={item} className="font-medium">{item}</li>
                        ))}
                    </ul>
                </div>

                {isManager ? (
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Manager Override Reason</label>
                        <textarea
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="Why are these items missing? (e.g. Out of stock, Discontinued)"
                            rows={2}
                        />
                    </div>
                ) : (
                    <div className="mb-6 bg-blue-50 text-blue-800 text-xs p-3 rounded border border-blue-200">
                        <span className="font-bold">Staff Note:</span> You cannot override this check. Please count the missing items or ask a Manager.
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
                    >
                        Go Back & Count
                    </button>
                    {isManager && (
                        <button
                            onClick={() => onOverride(reason)}
                            disabled={!reason.trim()}
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Override & Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
