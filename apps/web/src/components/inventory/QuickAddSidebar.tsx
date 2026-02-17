import React, { useState, useEffect } from 'react';

// Mock types
interface MasterItem {
    id: string;
    name: string;
    unit: string;
    category: string;
    ean: string;
}

interface QuickAddSidebarProps {
    onAdd: (item: MasterItem, qty: number) => void;
}

const API_URL = 'http://localhost:3001';

export const QuickAddSidebar: React.FC<QuickAddSidebarProps> = ({ onAdd }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<MasterItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MasterItem | null>(null);
    const [qty, setQty] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);

    // Debounced Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/master/items?q=${searchTerm}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleAdd = () => {
        if (selectedItem) {
            onAdd(selectedItem, Number(qty) || 0);
            // Reset
            setSelectedItem(null);
            setQty('');
            setSearchTerm('');
            setResults([]);
        }
    };

    return (
        <div className="w-80 bg-white border-l border-slate-200 p-4 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-4">Quick Add Item</h3>

            {/* Search Input */}
            <div className="mb-4 relative">
                <label className="block text-xs font-medium text-slate-500 mb-1">Search Master List</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Name or EAN..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedItem(null); // Clear selection on type
                    }}
                />

                {/* Dropdown Results */}
                {searchTerm.length >= 2 && !selectedItem && (
                    <div className="absolute z-10 w-full bg-white border border-slate-200 mt-1 max-h-60 overflow-y-auto shadow-lg rounded-md">
                        {loading && <div className="p-2 text-xs text-slate-400">Searching...</div>}
                        {!loading && results.length === 0 && <div className="p-2 text-xs text-slate-400">No results found</div>}
                        {results.map(item => (
                            <button
                                key={item.id}
                                className="w-full text-left p-2 hover:bg-indigo-50 flex flex-col border-b border-slate-50 last:border-0"
                                onClick={() => {
                                    setSelectedItem(item);
                                    setSearchTerm(item.name); // Set input to name
                                    setResults([]); // Hide dropdown
                                }}
                            >
                                <span className="font-medium text-sm text-slate-700">{item.name}</span>
                                <span className="text-xs text-slate-500">{item.ean} • {item.unit}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Selection Preview */}
            {selectedItem && (
                <div className="mb-4 bg-indigo-50 p-3 rounded-md border border-indigo-100">
                    <div className="text-sm font-bold text-indigo-800">{selectedItem.name}</div>
                    <div className="text-xs text-indigo-600">{selectedItem.category} • {selectedItem.unit}</div>
                    <div className="text-xs text-slate-400 mt-1">EAN: {selectedItem.ean}</div>
                </div>
            )}

            {/* Qty Input */}
            <div className="mb-6">
                <label className="block text-xs font-medium text-slate-500 mb-1">Quantity (Optional)</label>
                <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="0"
                    value={qty}
                    onChange={e => setQty(Number(e.target.value))}
                    disabled={!selectedItem}
                />
            </div>

            {/* Add Button */}
            <button
                onClick={handleAdd}
                disabled={!selectedItem}
                className={`w-full py-2 rounded-md font-medium transition-colors ${selectedItem
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
            >
                Add to Count
            </button>

            <div className="mt-auto text-xs text-slate-400 text-center">
                Press <b>Enter</b> to search.<br />
                Items added here are not saved until you click "Save" in the main grid.
            </div>
        </div>
    );
};
