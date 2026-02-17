const API_URL = 'http://127.0.0.1:3001';

export async function submitEod(restaurantId: string, date: string, data: any, role?: string) {
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
    const res = await fetch(`${API_URL}/order/suggestions?restaurantId=${restaurantId}`, {
        headers: { 'x-user-role': role }
    });
    if (!res.ok) throw new Error('Failed to fetch suggestions');
    return res.json();
}

export async function submitWaste(restaurantId: string, itemId: string, quantity: number, reason: string, date: string, role?: string) {
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
    const res = await fetch(`${API_URL}/inventory/template?restaurantId=${restaurantId}`, {
        headers: { 'x-user-role': role }
    });
    if (!res.ok) throw new Error('Failed to fetch template');
    return res.json();
}

export async function flushTips(restaurantId: string, employeeId: string, amount: number, mode: 'NORMAL_20S' | 'FULL_SETTLEMENT') {
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
    const res = await fetch(`${API_URL}/tips/policy/${restaurantId}`);
    if (!res.ok) throw new Error('Failed to fetch policy');
    return res.json();
}

export async function setManagerPolicy(restaurantId: string, includeManagers: boolean) {
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
    const res = await fetch(`${API_URL}/daily/pdf/${restaurantId}/${date}`);
    if (!res.ok) throw new Error('Failed to download PDF');
    return res.blob();
}

export async function getAuditLogs(restaurantId: string, role: string = 'MANAGER') {
    const res = await fetch(`${API_URL}/audit?restaurantId=${restaurantId}`, {
        headers: { 'x-user-role': role }
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
}

export async function sendOrder(data: any, role?: string) {
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
    const res = await fetch(`${API_URL}/purchases/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to ingest email');
    return res.json();
}

export async function getPendingPurchases(role: string = 'MANAGER') {
    const res = await fetch(`${API_URL}/purchases/pending`, {
        headers: { 'x-user-role': role }
    });
    if (!res.ok) throw new Error('Failed to fetch pending purchases');
    return res.json();
}

export async function confirmPurchase(id: string, date: string, items: any[]) {
    const res = await fetch(`${API_URL}/purchases/${id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, items }),
    });
    if (!res.ok) throw new Error('Failed to confirm purchase');
    return res.json();
}

export async function getChangelogStatus() {
    // Mock user ID for now
    const res = await fetch(`${API_URL}/changelog/status`, {
        headers: {
            'x-user-id': 'mock-frontend-user'
        }
    });
    if (!res.ok) throw new Error('Failed to fetch changelog status');
    return res.json();
}

export async function ackChangelog(version: string) {
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
    const res = await fetch(`${API_URL}/transfer/pending?restaurantId=${restaurantId}`);
    if (!res.ok) throw new Error('Failed to fetch pending transfers');
    return res.json();
}

// Roster
export async function importRoster(restaurantId: string, shifts: any[]) {
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
    const res = await fetch(`${API_URL}/roster/deviations?restaurantId=${restaurantId}`);
    if (!res.ok) throw new Error('Failed to fetch deviations');
    return res.json();
}

export async function ackDeviation(id: string) {
    const res = await fetch(`${API_URL}/roster/deviations/${id}/ack`, {
        method: 'POST',
        headers: { 'x-user-id': 'mock-frontend-user' }
    });
    if (!res.ok) throw new Error('Failed to acknowledge deviation');
    return res.json();
}

export async function triggerAnalysis(restaurantId: string, date: string, actualShifts: any[]) {
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
    const res = await fetch(`${API_URL}/admin/my-restaurants?email=${email}`, {
        headers: { 'x-user-email': email }
    });
    if (!res.ok) throw new Error('Failed to fetch my restaurants');
    return res.json();
}

export async function createRestaurant(name: string, domain: string) {
    const res = await fetch(`${API_URL}/admin/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': 'admin@test.com' },
        body: JSON.stringify({ name, domain }),
    });
    if (!res.ok) throw new Error('Failed to create restaurant');
    return res.json();
}

export async function assignRole(email: string, restaurantId: string, role: string) {
    const res = await fetch(`${API_URL}/admin/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': 'admin@test.com' },
        body: JSON.stringify({ email, restaurantId, role }),
    });
    if (!res.ok) throw new Error('Failed to assign role');
    return res.json();
}

export async function getAllRestaurants() {
    const res = await fetch(`${API_URL}/admin/restaurants`);
    if (!res.ok) throw new Error('Failed to fetch restaurants');
    return res.json();
}
