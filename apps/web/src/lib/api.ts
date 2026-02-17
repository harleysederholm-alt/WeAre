const API_URL = 'http://127.0.0.1:3001';
const USE_MOCK = true; // FORCE MOCK FOR DEMO

import { MOCK_DATA } from './mockData';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function submitEod(restaurantId: string, date: string, data: any, role?: string) {
    if (USE_MOCK) {
        await delay(800);
        return { success: true, eventId: 'mock-eod-123' };
    }
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (role) {
        headers['x-user-role'] = role;
    }

    const res = await fetch(`${API_URL}/daily/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ restaurantId, date, ...data }),
    });
    if (!res.ok) throw new Error('Failed to submit EOD');
    return res.json();
}

export async function getOrderSuggestions(restaurantId: string, role: string = 'MANAGER') {
    if (USE_MOCK) {
        await delay(500);
        return { suggestions: MOCK_DATA.inventory.filter(i => i.quantity < i.expected).map(i => ({ ...i, suggested: i.expected - i.quantity })) };
    }
    const res = await fetch(`${API_URL}/order/suggestions?restaurantId=${restaurantId}`, {
        headers: { 'x-user-role': role }
    });
    if (!res.ok) throw new Error('Failed to fetch suggestions');
    return res.json();
}

export async function submitWaste(restaurantId: string, itemId: string, quantity: number, reason: string, date: string, role?: string) {
    if (USE_MOCK) {
        await delay(400);
        return { success: true };
    }
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (role) {
        headers['x-user-role'] = role;
    }

    const res = await fetch(`${API_URL}/waste/log`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ restaurantId, itemId, quantity, reason, date }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to logs waste');
    }
    return res.json();
}

export async function getReports(restaurantId: string, role?: string) {
    if (USE_MOCK) {
        await delay(600);
        return {
            date: new Date().toISOString().split('T')[0],
            sales: MOCK_DATA.sales,
            shifts: MOCK_DATA.shifts,
            tips: MOCK_DATA.tips
        };
    }
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (role) {
        headers['x-user-role'] = role;
    }
    const res = await fetch(`${API_URL}/reports/daily?restaurantId=${restaurantId}`, {
        headers
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
}

export async function previewTips(restaurantId: string, date: string, cashTips: number, shifts: any[]) {
    if (USE_MOCK) {
        await delay(300);
        // Distribute proportionally
        return shifts.map(s => ({ ...s, allocated: 10.50 })); // Mock allocation
    }
    const res = await fetch(`${API_URL}/tips/preview`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId, date, cashTips, shifts }),
    });
    if (!res.ok) throw new Error('Failed to preview tips');
    return res.json();
}

export async function approveTips(restaurantId: string, date: string, allocations: any[]) {
    if (USE_MOCK) {
        await delay(400);
        return { success: true };
    }
    const res = await fetch(`${API_URL}/tips/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId, date, allocations }),
    });
    if (!res.ok) throw new Error('Failed to approve tips');
    return res.json();
}

export async function submitInventory(restaurantId: string, date: string, items: any[], role?: string, overrideReason?: string) {
    if (USE_MOCK) {
        await delay(1000);
        // Simulate Template Validation Error if overrideReason is missing and some items are missing
        // For demo success path, we assume valid
        return { success: true };
    }
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (role) {
        headers['x-user-role'] = role;
    }

    const res = await fetch(`${API_URL}/inventory/count`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ restaurantId, date, items, overrideReason }),
    });

    if (!res.ok) {
        const err = await res.json();
        // Return error object so UI can handle it (e.g. show modal)
        throw err;
    }
    return res.json();
}

export async function getInventoryTemplate(restaurantId: string, role: string = 'STAFF') {
    if (USE_MOCK) {
        await delay(200);
        return {
            items: MOCK_DATA.inventory.map(i => ({ id: i.itemId, name: i.name, category: 'General' })),
            requiredItems: ['Täysmaito', 'Kahvipavut (Espresso)', 'Takeaway Kupit (Iso)']
        };
    }
    const res = await fetch(`${API_URL}/inventory/template?restaurantId=${restaurantId}`, {
        headers: { 'x-user-role': role }
    });
    if (!res.ok) throw new Error('Failed to fetch template');
    return res.json();
}

export async function flushTips(restaurantId: string, employeeId: string, amount: number, mode: 'NORMAL_20S' | 'FULL_SETTLEMENT') {
    if (USE_MOCK) {
        await delay(500);
        if (mode === 'NORMAL_20S' && amount % 20 !== 0) throw new Error('Normal flush must be in multiples of 20€.');
        return { success: true };
    }
    const res = await fetch(`${API_URL}/tips/flush`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId, employeeId, amount, mode }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to flush tips');
    }
    return res.json();
}

export async function getManagerPolicy(restaurantId: string) {
    if (USE_MOCK) {
        return { includeManagers: false };
    }
    const res = await fetch(`${API_URL}/tips/policy/${restaurantId}`);
    if (!res.ok) throw new Error('Failed to fetch policy');
    return res.json();
}

export async function setManagerPolicy(restaurantId: string, includeManagers: boolean) {
    if (USE_MOCK) return { success: true };
    const res = await fetch(`${API_URL}/tips/policy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId, includeManagers }),
    });
    if (!res.ok) throw new Error('Failed to set policy');
    return res.json();
}

export async function downloadPdf(restaurantId: string, date: string) {
    if (USE_MOCK) {
        // Create a dummy PDF blob
        const mockContent = "Daily Report (Mock)";
        return new Blob([mockContent], { type: 'application/pdf' });
    }
    const res = await fetch(`${API_URL}/daily/pdf/${restaurantId}/${date}`);
    if (!res.ok) throw new Error('Failed to download PDF');
    return res.blob();
}

export async function getAuditLogs(restaurantId: string, role: string = 'MANAGER') {
    if (USE_MOCK) {
        return [
            { id: '1', type: 'SALE', description: 'Submitted Daily Sales', user: 'Staff A', date: new Date().toISOString() },
            { id: '2', type: 'TIPS', description: 'Flushed 40€ to Matti', user: 'Manager B', date: new Date().toISOString() }
        ];
    }
    const res = await fetch(`${API_URL}/audit?restaurantId=${restaurantId}`, {
        headers: { 'x-user-role': role }
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
}

export async function sendOrder(data: any, role?: string) {
    if (USE_MOCK) {
        await delay(1000);
        return { success: true, orderId: 'mock-ord-999' };
    }
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (role) {
        headers['x-user-role'] = role;
    }
    // Mock user ID for audit
    headers['x-user-id'] = 'mock-frontend-user';

    const res = await fetch(`${API_URL}/order/request`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to send order');
    }
    return res.json();
}

export async function ingestEmail(data: { sender: string; subject: string; body: string }) {
    if (USE_MOCK) return { success: true };
    const res = await fetch(`${API_URL}/purchases/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to ingest email');
    return res.json();
}

export async function getPendingPurchases(role: string = 'MANAGER') {
    if (USE_MOCK) return MOCK_DATA.purchases;
    const res = await fetch(`${API_URL}/purchases/pending`, {
        headers: { 'x-user-role': role }
    });
    if (!res.ok) throw new Error('Failed to fetch pending purchases');
    return res.json();
}

export async function confirmPurchase(id: string, date: string, items: any[]) {
    if (USE_MOCK) return { success: true };
    const res = await fetch(`${API_URL}/purchases/${id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, items }),
    });
    if (!res.ok) throw new Error('Failed to confirm purchase');
    return res.json();
}

export async function getChangelogStatus() {
    if (USE_MOCK) {
        return MOCK_DATA.changelog; // Returns { currentVersion, requiresAck, pendingChanges }
    }
    // Mock user ID for now
    const res = await fetch(`${API_URL}/changelog/status`, {
        headers: {
            'x-user-id': 'mock-frontend-user'
        }
    });
    if (!res.ok) throw new Error('Failed to fetch changelog status');
    return res.json();
}

// Keep a local state for Ack in demo mode
let MOCK_ACK_DONE = false;
export async function ackChangelog(version: string) {
    if (USE_MOCK) {
        MOCK_ACK_DONE = true;
        return { success: true };
    }
    const res = await fetch(`${API_URL}/changelog/ack`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'mock-frontend-user'
        },
        body: JSON.stringify({ version }),
    });
    if (!res.ok) throw new Error('Failed to acknowledge changelog');
    return res.json();
}

export async function initiateTransfer(data: { receiverId: string; itemId: string; quantity: number; reason?: string }) {
    if (USE_MOCK) return { success: true, transferId: 'mock-tr-1' };
    const res = await fetch(`${API_URL}/transfer/initiate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-restaurant-id': 'restaurant-1', // Sender
            'x-user-id': 'mock-frontend-user'
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to initiate transfer');
    return res.json();
}

export async function resolveTransfer(data: { transferId: string; action: 'ACCEPT' | 'REJECT'; quantity?: number; reason?: string }) {
    if (USE_MOCK) return { success: true };
    const res = await fetch(`${API_URL}/transfer/resolve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'mock-frontend-user'
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to resolve transfer');
    return res.json();
}

export async function getPendingTransfers(restaurantId: string) {
    if (USE_MOCK) return [
        { id: 'tr-01', senderId: 'restaurant-2', itemId: 'item-1', quantity: 5, status: 'PENDING', timestamp: new Date().toISOString() }
    ];
    const res = await fetch(`${API_URL}/transfer/pending?restaurantId=${restaurantId}`);
    if (!res.ok) throw new Error('Failed to fetch pending transfers');
    return res.json();
}

// Roster
export async function importRoster(restaurantId: string, shifts: any[]) {
    if (USE_MOCK) return { success: true };
    const res = await fetch(`${API_URL}/roster/import`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'mock-frontend-user'
        },
        body: JSON.stringify({ restaurantId, shifts }),
    });
    if (!res.ok) throw new Error('Failed to import roster');
    return res.json();
}

export async function getDeviations(restaurantId: string) {
    if (USE_MOCK) return [];
    const res = await fetch(`${API_URL}/roster/deviations?restaurantId=${restaurantId}`);
    if (!res.ok) throw new Error('Failed to fetch deviations');
    return res.json();
}

export async function ackDeviation(id: string) {
    if (USE_MOCK) return { success: true };
    const res = await fetch(`${API_URL}/roster/deviations/${id}/ack`, {
        method: 'POST',
        headers: { 'x-user-id': 'mock-frontend-user' }
    });
    if (!res.ok) throw new Error('Failed to acknowledge deviation');
    return res.json();
}

export async function triggerAnalysis(restaurantId: string, date: string, actualShifts: any[]) {
    if (USE_MOCK) return { success: true };
    const res = await fetch(`${API_URL}/roster/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'mock-frontend-user'
        },
        body: JSON.stringify({ restaurantId, date, actualShifts }),
    });
    if (!res.ok) throw new Error('Failed to analyze deviations');
    return res.json();
}

// Admin / Restaurants
export async function getMyRestaurants(email: string) {
    if (USE_MOCK) return [{ id: 'restaurant-1', name: 'Helsinki City Center', role: 'ADMIN' }];
    const res = await fetch(`${API_URL}/admin/my-restaurants?email=${email}`, {
        headers: { 'x-user-email': email }
    });
    if (!res.ok) throw new Error('Failed to fetch my restaurants');
    return res.json();
}

export async function createRestaurant(name: string, domain: string) {
    if (USE_MOCK) return { id: 'mock-new-rest' };
    const res = await fetch(`${API_URL}/admin/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': 'admin@test.com' },
        body: JSON.stringify({ name, domain }),
    });
    if (!res.ok) throw new Error('Failed to create restaurant');
    return res.json();
}

export async function assignRole(email: string, restaurantId: string, role: string) {
    if (USE_MOCK) return { success: true };
    const res = await fetch(`${API_URL}/admin/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': 'admin@test.com' },
        body: JSON.stringify({ email, restaurantId, role }),
    });
    if (!res.ok) throw new Error('Failed to assign role');
    return res.json();
}

export async function getAllRestaurants() {
    if (USE_MOCK) return [{ id: 'restaurant-1', name: 'Helsinki City Center', domain: 'city' }];
    const res = await fetch(`${API_URL}/admin/restaurants`);
    if (!res.ok) throw new Error('Failed to fetch restaurants');
    return res.json();
}
