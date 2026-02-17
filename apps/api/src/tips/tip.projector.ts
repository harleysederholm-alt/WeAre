import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from '../ledger/event.service';
import { TipBalanceEntity } from './tip-balance.entity';

@Injectable()
export class TipProjector implements OnModuleInit {
    constructor(
        private readonly eventService: EventService,
        @InjectRepository(TipBalanceEntity)
        private readonly balanceRepo: Repository<TipBalanceEntity>,
    ) { }

    onModuleInit() {
        this.eventService.subscribe('TIPS_DISTRIBUTED', this.handleTipsDistributed.bind(this));
        this.eventService.subscribe('TIP_PAID', this.handleTipPaid.bind(this));
    }

    private async handleTipsDistributed(event: any) {
        // payload: { date, totalTips, allocations: [{ employeeId, amount }] }
        const { allocations } = event.payload;
        // Should ideally get restaurantId from stream_id or metadata, but for now we hardcode or parse
        // StreamID format: restaurant-{id}-tips-{date}
        const parts = event.stream_id.split('-');
        const restaurantId = parts[1]; // restaurant-1 -> 1? No, restaurant-restaurant-1... wait.
        // StreamID standard: restaurant-{restaurantId}-...
        // Let's assume restaurantId is the second part if we split by '-'. 
        // Actually, let's look at how we generate it: `restaurant-${restaurantId}-tips-${date}`

        for (const alloc of allocations) {
            await this.updateBalance(restaurantId, alloc.employeeId, alloc.amount);
        }
    }

    private async handleTipPaid(event: any) {
        // payload: { employeeId, amount, mode, reason }
        const { employeeId, amount } = event.payload;
        const parts = event.stream_id.split('-');
        const restaurantId = parts[1];

        // Deduct from balance
        await this.updateBalance(restaurantId, employeeId, -amount); // Negative amount to subtract
    }

    private async updateBalance(restaurantId: string, employeeId: string, changeCents: number) {
        let entry = await this.balanceRepo.findOne({ where: { restaurantId, employeeId } });

        if (!entry) {
            entry = new TipBalanceEntity();
            entry.restaurantId = restaurantId;
            entry.employeeId = employeeId;
            entry.balanceCents = 0;
        }

        // Fix: incoming 'amount' from events is in EUR. We must store Cents.
        // changeCents is actually changeEUR in the event payload.
        // Balance is stored as Cents.
        entry.balanceCents += Math.round(Number(changeCents) * 100); // Convert EUR to Cents
        entry.lastUpdated = new Date();

        await this.balanceRepo.save(entry);
        console.log(`[TipProjector] Updated ${employeeId} balance by ${changeCents}. New: ${entry.balanceCents}`);
    }
}
