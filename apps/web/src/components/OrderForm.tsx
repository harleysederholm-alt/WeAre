import React, { useState } from 'react';
import { sendOrder } from '../lib/api';

interface OrderItem {
    name: string;
    quantity: number;
    unit: string;
    notes: string;
}

export const OrderForm: React.FC = () => {
    const [category, setCategory] = useState('Food'); // Default
    const [supplier, setSupplier] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [items, setItems] = useState<OrderItem[]>([
        { name: '', quantity: 1, unit: 'kpl', notes: '' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
        const newItems = [...items];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: '', quantity: 1, unit: 'kpl', notes: '' }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!supplier || !recipientEmail || items.some(i => !i.name)) {
            alert('Please fill in all required fields (Supplier, Email, Item Names)');
            setLoading(false);
            return;
        }

        const payload = {
            restaurantId: 'restaurant-1',
            category,
            supplier,
            recipientEmail,
            deliveryDate: deliveryDate || undefined,
            items
        };

        try {
            await sendOrder(payload, 'STAFF'); // Assume staff role for now
            alert('Order sent successfully!');
            // Reset form
            setSupplier('');
            setRecipientEmail('');
            setDeliveryDate('');
            setItems([{ name: '', quantity: 1, unit: 'kpl', notes: '' }]);
        } catch (err: any) {
            alert('Failed to send order: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Tilauspyyntö (Order Helper)</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="Food">Food (Ruoka)</option>
                            <option value="Alcohol">Alcohol (Alkoholi)</option>
                            <option value="Cleaning">Cleaning (Siivous)</option>
                            <option value="Office">Office (Toimisto)</option>
                            <option value="Other">Other (Muu)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Supplier (Toimittaja)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            value={supplier}
                            onChange={e => setSupplier(e.target.value)}
                            placeholder="e.g. Tukku Oy"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded-md"
                            value={recipientEmail}
                            onChange={e => setRecipientEmail(e.target.value)}
                            placeholder="orders@supplier.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Requested Delivery (Optional)</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded-md"
                            value={deliveryDate}
                            onChange={e => setDeliveryDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Items</label>
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <input
                                type="text"
                                placeholder="Item Name"
                                className="flex-1 p-2 border rounded-md text-sm"
                                value={item.name}
                                onChange={e => handleItemChange(index, 'name', e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Qty"
                                className="w-20 p-2 border rounded-md text-sm"
                                value={item.quantity}
                                min="0.1"
                                step="0.1"
                                onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Unit"
                                className="w-20 p-2 border rounded-md text-sm"
                                value={item.unit}
                                onChange={e => handleItemChange(index, 'unit', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Notes"
                                className="flex-1 p-2 border rounded-md text-sm"
                                value={item.notes}
                                onChange={e => handleItemChange(index, 'notes', e.target.value)}
                            />
                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                    title="Remove Item"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addItem}
                        className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
                    >
                        + Add Item
                    </button>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Sending...' : 'Send Order Request'}
                    </button>
                </div>
            </div>
        </form>
    );
};
