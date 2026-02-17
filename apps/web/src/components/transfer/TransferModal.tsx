import React, { useState } from 'react';
import { initiateTransfer } from '../../lib/api';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: { id: string; name: string; unit: string };
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, item }) => {
    const [receiverId, setReceiverId] = useState('restaurant-2'); // Default to 'other'
    const [quantity, setQuantity] = useState(0);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await initiateTransfer({
                receiverId,
                itemId: item.id || item.name, // Fallback
                quantity: Number(quantity),
                reason
            });
            alert('Transfer Initiated!');
            onClose();
        } catch (err: any) {
            alert('Failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                <h3 className="text-lg font-bold mb-4">Transfer {item.name}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Target Restaurant</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={receiverId}
                            onChange={e => setReceiverId(e.target.value)}
                        >
                            <option value="restaurant-2">Restaurant 2 (Helsinki)</option>
                            <option value="restaurant-3">Restaurant 3 (Tampere)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Quantity ({item.unit})</label>
                        <input
                            type="number"
                            step="0.1"
                            className="w-full p-2 border rounded"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Reason</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="e.g. They ran out"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading || quantity <= 0}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
