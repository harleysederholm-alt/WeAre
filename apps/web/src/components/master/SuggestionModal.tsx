import React, { useState } from 'react';

interface SuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    contextItem?: { itemId: string; name: string; ean?: string };
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose, onSubmit, contextItem }) => {
    const [issueType, setIssueType] = useState('WRONG_EAN');
    const [itemName, setItemName] = useState(contextItem?.name || '');
    const [suggestedValue, setSuggestedValue] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                targetItemId: contextItem?.itemId,
                itemName,
                issueType,
                suggestedValue,
                comment
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to submit suggestion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-bold mb-4">Report Issue / Suggestion</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Issue Type</label>
                        <select
                            value={issueType}
                            onChange={e => setIssueType(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                        >
                            <option value="MISSING_ITEM">Missing Item</option>
                            <option value="WRONG_EAN">Wrong EAN</option>
                            <option value="WRONG_NAME">Wrong Name</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Item Name</label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={e => setItemName(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Suggested Value / Correction</label>
                        <input
                            type="text"
                            value={suggestedValue}
                            onChange={e => setSuggestedValue(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                            placeholder="e.g. Correct EAN or Name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Comment</label>
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            {loading ? 'Submitting...' : 'Submit Suggestion'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
