import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from '../ledger/event.service';
import { calculateTipDistribution, Shift, TipAllocation } from './tip.calculator';
import { TipBalanceEntity } from './tip-balance.entity';
import { v4 as uuidv4 } from 'uuid';

export interface PreviewTipsDto {
    restaurantId: string;
    date: string;
    cashTips: number;
    shifts: Shift[];
}

export interface ApproveTipsDto {
    restaurantId: string;
    date: string;
    allocations: TipAllocation[];
}

export interface FlushTipsDto {
    restaurantId: string;
    employeeId: string;
    amount: number;
    mode: 'NORMAL_20S' | 'FULL_SETTLEMENT';
}

export interface SetPolicyDto {
    restaurantId: string;
    includeManagers: boolean;
}

@Injectable()
export class TipsService {
    constructor(
        private readonly eventService: EventService,
        @InjectRepository(TipBalanceEntity)
        private readonly balanceRepo: Repository<TipBalanceEntity>,
    ) { }

    /**
     * Preview distribution without saving.
     */
    async previewDistribution(dto: PreviewTipsDto) {
        // 1. Get current balances
        const balances = await this.getBalances(dto.restaurantId);

        // 2. Calculate
        const distribution = calculateTipDistribution(dto.shifts, dto.cashTips, balances);

        return distribution;
    }

    /**
     * Commit the distribution to the ledger.
     */
    async approveDistribution(dto: ApproveTipsDto) {
        const { restaurantId, date, allocations } = dto;
        const streamId = `restaurant-${restaurantId}-tips-${date}`;

        const payload = {
            date,
            totalTips: allocations.reduce((sum, a) => sum + a.allocated, 0),
            allocations: allocations.map(a => ({
                employeeId: a.employeeId,
                amount: a.allocated,
            }))
        };

        const event = {
            stream_id: streamId,
            type: 'TIPS_DISTRIBUTED',
            payload,
            meta: { timestamp: new Date().toISOString() },
            occurred_at: new Date(),
        };

        return this.eventService.append(event);
    }

    /**
     * Pay out tips to an employee.
     */
    async flushTips(dto: FlushTipsDto) {
        const { restaurantId, employeeId, amount, mode } = dto;

        // Validation
        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive.');
        }

        if (mode === 'NORMAL_20S') {
            if (amount % 20 !== 0) {
                throw new BadRequestException('Normal flush must be in multiples of 20€.');
            }
        }

        // Check balance (Optional but good practice)
        const currentBalance = await this.balanceRepo.findOne({ where: { restaurantId, employeeId } });
        // Balance is stored in Cents. Amount is in EUR.
        if (!currentBalance || currentBalance.balanceCents < Math.round(amount * 100)) {
            throw new BadRequestException(`Insufficient funds. Balance: ${(currentBalance?.balanceCents || 0) / 100}€, Requested: ${amount}€`);
        }

        const streamId = `restaurant-${restaurantId}-tips-payouts`;

        const event = {
            stream_id: streamId,
            type: 'TIP_PAID',
            payload: {
                employeeId,
                amount, // Keeping it in EUR as per contract, Projector will handle units?
                // Wait, Projector used amount directly. We need to be consistent with units.
                // TipCalculator returns EUR.
                // FlushTipsDto.amount is EUR.
                // Projector should convert? Or Event should store Cents?
                // Let's standardise on EUR for now in Payload to match existing, or change everything to Cents.
                // EXISTING: tips.service.ts line 67 passed `a.allocated` (EUR) to payload.
                // So event payload is in EUR.
                mode,
                reason: mode === 'FULL_SETTLEMENT' ? 'Final Settlement' : 'Cash Flush'
            },
            meta: { timestamp: new Date().toISOString() },
            occurred_at: new Date(),
        };

        return this.eventService.append(event);
    }

    /**
     * Update Manager Inclusion Policy
     */
    async setManagerPolicy(dto: SetPolicyDto) {
        const streamId = `restaurant-${dto.restaurantId}-settings`;

        const event = {
            stream_id: streamId,
            type: 'TIPS_POLICY_UPDATED',
            payload: {
                includeManagers: dto.includeManagers
            },
            meta: { timestamp: new Date().toISOString() },
            occurred_at: new Date(),
        };

        return this.eventService.append(event);
    }

    /**
     * Get Current Policy
     */
    async getManagerPolicy(restaurantId: string) {
        const streamId = `restaurant-${restaurantId}-settings`;
        const events = await this.eventService.getStream(streamId);

        let includeManagers = false; // Default

        // Replay events
        for (const event of events) {
            if (event.type === 'TIPS_POLICY_UPDATED') {
                includeManagers = event.payload.includeManagers;
            }
        }

        return { includeManagers };
    }

    /**
     * Reconstruct balances from the ledger.
     * Balance = SUM(Earned) - SUM(Paid)
     */
    async getBalances(restaurantId: string): Promise<Record<string, number>> {
        const entities = await this.balanceRepo.find({ where: { restaurantId } });
        const balances: Record<string, number> = {};

        for (const e of entities) {
            // Balance is stored in Cents. Frontend expects EUR.
            balances[e.employeeId] = e.balanceCents / 100;
        }
        return balances;
    }
}
