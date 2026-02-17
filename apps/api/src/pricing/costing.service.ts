import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventService } from '../ledger/event.service';

@Injectable()
export class CostingService {
    // In-memory cost store (ItemID -> Cost)
    // In real app, this is in 'MasterItem' or 'PriceHistory'
    private itemCosts: Record<string, number> = {};

    constructor(private readonly eventService: EventService) { }

    @OnEvent('purchase-orders')
    async handlePurchase(event: any) {
        if (event.type === 'PURCHASE_ORDER_CONFIRMED') {
            const { confirmedItems } = event.payload;

            for (const item of confirmedItems) {
                const key = item.ean || item.name;
                const newPrice = item.unitPrice;
                const newQty = item.quantity;

                const currentCost = this.itemCosts[key] || newPrice; // Default to new price if unknown

                // Simple Moving Average or just Last Price?
                // User asked for "Cost history" later, but for now let's do Weighted Avg if we knew stock.
                // Without knowing EXACT current stock at moment of purchase, WAC is hard.
                // Let's stick to "Last Purchase Price" for simplicity of prototype, 
                // or a simple specific logic: 
                // NewCost = (CurrentCost + NewPrice) / 2 (Smoothing) - Very rough.

                // Let's just store Last Price for now as it's most common for simple restaurants.
                this.itemCosts[key] = newPrice;

                console.log(`[Costing] Updated cost for ${key} to ${newPrice}€`);

                // Emit Cost Update Event
                await this.eventService.append({
                    stream_id: 'costing-updates',
                    type: 'ITEM_COST_UPDATED',
                    payload: {
                        itemKey: key,
                        newCost: newPrice,
                        source: 'PURCHASE'
                    },
                    meta: { timestamp: new Date().toISOString(), user: 'system' },
                    occurred_at: new Date()
                });
            }
        }
    }

    getCurrentCost(key: string): number {
        return this.itemCosts[key] || 0;
    }
}
