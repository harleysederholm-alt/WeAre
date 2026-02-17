export interface Shift {
    employeeId: string;
    hours: number;
}

export interface TipAllocation {
    employeeId: string;
    allocated: number; // The exact amount earned this period
    payout: number;    // The amount to payout (multiples of 20)
    remainder: number; // The amount remaining (allocated - payout)
}

/**
 * Calculates tip distribution based on worked hours.
 * Rounds to 2 decimal places for storage/display.
 * Payout uses strict 20 Euro bill logic.
 */
export function calculateTipDistribution(shifts: Shift[], cashTotal: number, existingBalances: Record<string, number> = {}): TipAllocation[] {
    const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0);

    if (totalHours === 0 || cashTotal === 0) {
        return shifts.map(s => ({
            employeeId: s.employeeId,
            allocated: 0,
            payout: 0,
            remainder: (existingBalances[s.employeeId] || 0)
        }));
    }

    // Calculate generic hourly rate
    const rate = cashTotal / totalHours;

    return shifts.map(shift => {
        const previousBalance = existingBalances[shift.employeeId] || 0;
        const earnedRaw = shift.hours * rate;

        // Round allocated to 2 decimals (cents)
        const allocated = Math.round(earnedRaw * 100) / 100;

        // Calculate total available for this person
        const totalAvailable = previousBalance + allocated;

        // Payout rule: Multiples of 20
        // Math.floor(Total / 20) * 20
        const payout = Math.floor(totalAvailable / 20) * 20;

        // Remainder stays in pool
        // Need to strictly handle floating point math?
        // Working in cents is safer.
        const totalAvailableCents = Math.round(totalAvailable * 100);
        const payoutCents = payout * 100;
        const remainderCents = totalAvailableCents - payoutCents;
        const remainder = remainderCents / 100;

        return {
            employeeId: shift.employeeId,
            allocated,
            payout,
            remainder
        };
    });
}
