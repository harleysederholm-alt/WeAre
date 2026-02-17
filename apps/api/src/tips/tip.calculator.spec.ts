import { calculateTipDistribution, Shift } from './tip.calculator';

describe('TipCalculator', () => {
    it('should distribute tips proportionally to hours', () => {
        const shifts: Shift[] = [
            { employeeId: 'A', hours: 5 },
            { employeeId: 'B', hours: 5 },
        ];
        const cashTotal = 100;

        const result = calculateTipDistribution(shifts, cashTotal);

        expect(result).toHaveLength(2);
        expect(result.find(r => r.employeeId === 'A')!.allocated).toBe(50);
        expect(result.find(r => r.employeeId === 'B')!.allocated).toBe(50);
    });

    it('should handle €20 payout rule (Normal Flush)', () => {
        const shifts: Shift[] = [{ employeeId: 'A', hours: 10 }];
        const cashTotal = 50; // 50 allocated

        const result = calculateTipDistribution(shifts, cashTotal);

        // Should accumulate 50. Payout floor(50/20)*20 = 40. Remainder 10.
        const allocation = result[0];
        expect(allocation.allocated).toBe(50);
        expect(allocation.payout).toBe(40);
        expect(allocation.remainder).toBe(10); // 50 - 40 = 10
    });

    it('should include previous balances in payout calculation', () => {
        const shifts: Shift[] = [{ employeeId: 'A', hours: 10 }];
        const cashTotal = 10; // 10 allocated
        const existingBalances = { 'A': 15 }; // 15 stored

        // Total available = 10 + 15 = 25
        // Payout = 20
        // Remainder = 5

        const result = calculateTipDistribution(shifts, cashTotal, existingBalances);

        expect(result[0].allocated).toBe(10);
        expect(result[0].payout).toBe(20);
        expect(result[0].remainder).toBe(5);
    });

    it('should handle rounding correctly to 2 decimals', () => {
        // 100 tips, 3 employees with 1 hour each.
        // 33.333... each.
        const shifts: Shift[] = [
            { employeeId: 'A', hours: 1 },
            { employeeId: 'B', hours: 1 },
            { employeeId: 'C', hours: 1 },
        ];
        const cashTotal = 100;

        const result = calculateTipDistribution(shifts, cashTotal);

        // 33.33 each. Sum = 99.99. 0.01 lost in rounding or handled?
        // The implementation rounds each allocation.
        // allocated = Math.round(33.333 * 100) / 100 = 33.33

        expect(result[0].allocated).toBe(33.33);
        expect(result[1].allocated).toBe(33.33);
        expect(result[2].allocated).toBe(33.33);

        // Payout logic: 33.33 -> payout 20 -> remainder 13.33
        expect(result[0].payout).toBe(20);
        expect(result[0].remainder).toBe(13.33);
    });

    it('should handle zero hours/cash gracefully', () => {
        const shifts: Shift[] = [{ employeeId: 'A', hours: 0 }];
        const result = calculateTipDistribution(shifts, 100);
        expect(result[0].allocated).toBe(0);
    });
});
