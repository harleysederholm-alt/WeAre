
export const MOCK_DATA = {
    dailySales: {
        category: 'Food', amount: 1250.50, tax: 14
    },
    sales: [
        { category: 'Food', amount: 1250.50, tax: 14 },
        { category: 'Alcohol', amount: 890.00, tax: 24 },
        { category: 'Non-Alcohol', amount: 420.20, tax: 14 },
    ],
    shifts: [
        { name: 'Matti Meikäläinen', role: 'CHEF', start: '10:00', end: '18:00', type: 'Normaali' },
        { name: 'Teppo Testaaja', role: 'WAITER', start: '16:00', end: '23:30', type: 'Normaali' },
        { name: 'Liisa Laaksonen', role: 'BARTENDER', start: '18:00', end: '02:00', type: 'Normaali' },
        { name: 'Kalle Kokkinen', role: 'CHEF', start: '12:00', end: '20:00', type: 'Sairas' },
    ],
    tips: {
        cashTips: 45.00,
        voucherCount: 12,
        voucherValue: 124.00
    },
    inventory: [
        { itemId: 'item-1', name: 'Kahvipavut (Espresso)', quantity: 12.5, unit: 'kg', expected: 12.0 },
        { itemId: 'item-2', name: 'Täysmaito', quantity: 45, unit: 'L', expected: 50 },
        { itemId: 'item-3', name: 'Kauramaito (Oatly)', quantity: 22, unit: 'L', expected: 20 },
        { itemId: 'item-4', name: 'Sokeri', quantity: 5, unit: 'kg', expected: 10 },
        { itemId: 'item-5', name: 'Takeaway Kupit (Iso)', quantity: 150, unit: 'kpl', expected: 200 },
        { itemId: 'item-6', name: 'Takeaway Kupit (Pieni)', quantity: 300, unit: 'kpl', expected: 300 },
        { itemId: 'item-7', name: 'Lautasliinat', quantity: 4, unit: 'rll', expected: 5 },
        { itemId: 'item-8', name: 'Jätesäkit', quantity: 2, unit: 'rll', expected: 2 },
        { itemId: 'item-9', name: 'Astianpesuaine', quantity: 10, unit: 'L', expected: 12 },
    ],
    waste: [
        { itemId: 'item-2', name: 'Täysmaito', quantity: 2, reason: 'Expired', date: '2026-02-16' },
        { itemId: 'item-1', name: 'Kahvipavut', quantity: 0.5, reason: 'Spilled', date: '2026-02-16' },
        { itemId: 'item-5', name: 'Takeaway Kupit (Iso)', quantity: 10, reason: 'Damaged', date: '2026-02-15' },
    ],
    orders: [
        {
            id: 'ord-123',
            supplier: 'Kesko',
            status: 'PENDING',
            items: [{ name: 'Täysmaito', quantity: 50, unit: 'L' }, { name: 'Kauramaito', quantity: 30, unit: 'L' }],
            date: '2026-02-17'
        },
        {
            id: 'ord-124',
            supplier: 'Hartwall',
            status: 'DELIVERED',
            items: [{ name: 'Olut 0.5L', quantity: 100, unit: 'btl' }],
            date: '2026-02-16'
        },
        {
            id: 'ord-125',
            supplier: 'Valio',
            status: 'DRAFT',
            items: [{ name: 'Kerma', quantity: 5, unit: 'L' }],
            date: '2026-02-17'
        }
    ],
    purchases: [
        { id: 'inv-001', supplier: 'Kesko', total: 450.00, status: 'CONFIRMED', date: '2026-02-15' },
        { id: 'inv-002', supplier: 'Metos', total: 1200.00, status: 'PENDING_APPROVAL', date: '2026-02-16' },
        { id: 'inv-003', supplier: 'Wihuri', total: 320.50, status: 'CONFIRMED', date: '2026-02-14' },
    ],
    changelog: {
        currentVersion: '2026.02.17.1500',
        requiresAck: true,
        pendingChanges: [
            {
                version: '2026.02.17.1500',
                changes: [
                    { domain: 'Inventory', changeType: 'UPDATE', description: 'Added template validation for accurate stock counts.' },
                    { domain: 'Tips', changeType: 'UPDATE', description: 'Enforced €20 rule for cash payouts.' },
                    { domain: 'System', changeType: 'CREATE', description: 'New Help Sidebar with Search functionality.' },
                ]
            },
            {
                version: '2026.02.16.1200',
                changes: [
                    { domain: 'UI', changeType: 'UPDATE', description: 'Visual refresh: White Glass Theme applied.' },
                    { domain: 'Roster', changeType: 'FIX', description: 'Fixed shift editing on mobile devices.' },
                ]
            },
            {
                version: '2026.02.15.1000',
                changes: [
                    { domain: 'System', changeType: 'CREATE', description: 'Backend PDF Generation microservice.' },
                    { domain: 'Inventory', changeType: 'UPDATE', description: 'New deviation limits for alerting.' },
                    { domain: 'Reporting', changeType: 'FIX', description: 'Z-Report import parsing for VAT breakdown.' },
                ]
            }
        ]
    }
};
