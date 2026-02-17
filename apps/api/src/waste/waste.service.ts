import { Injectable, BadRequestException } from '@nestjs/common';
import { EventService } from '../ledger/event.service';
import { PricingService } from '../pricing/pricing.service';
import { v4 as uuidv4 } from 'uuid';

export interface LogWasteDto {
    restaurantId: string;
    itemId: string;
    quantity: number;
    reason: string;
    date: string; // ISO Date String (YYYY-MM-DD or full ISO)
}

@Injectable()
export class WasteService {
    constructor(
        private readonly eventService: EventService,
        private readonly pricingService: PricingService,
    ) { }

    async logWaste(dto: LogWasteDto) {
        const { restaurantId, itemId, quantity, reason, date } = dto;
        const wasteDate = new Date(date);

        // 1. Resolve Frozen Cost
        // "Price at Event Time": When waste is logged, backend must query price_history
        // for the price active at the date of the waste.
        let costCents = 0;
        try {
            costCents = await this.pricingService.getPriceAtDate(itemId, wasteDate);
        } catch (error) {
            // In a real app, maybe we allow 0 cost with a warning, or block it. 
            // For this strict governance system, we block it to ensure data integrity.
            throw new BadRequestException(`Cannot log waste: No valid price found for item ${itemId} on ${date}.`);
        }

        const totalLossCents = costCents * quantity;

        // 2. Create Event
        const streamId = `restaurant-${restaurantId}-waste-${wasteDate.toISOString().split('T')[0]}`;

        const event = {
            stream_id: streamId,
            type: 'WASTE_LOGGED',
            payload: {
                itemId,
                quantity,
                reason,
                frozenCostCents: costCents, // The frozen "Cost"
                totalLossCents,
                date,
            },
            meta: { timestamp: new Date().toISOString(), user: 'system' }, // User would come from auth context
            occurred_at: new Date(),
        };

        return this.eventService.append(event);
    }
}
