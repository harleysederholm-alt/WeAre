import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventService } from '../ledger/event.service';
import { InventoryCountDto } from './inventory.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InventoryService {
    constructor(private readonly eventService: EventService) { }

    // In-memory theoretical stock (Read Model)
    // In a real app, this would be persisted in a 'StockSnapshot' table or similar.
    private theoreticalStock: Record<string, number> = {};

    @OnEvent('purchase-orders')
    async handlePurchaseEvent(event: any) {
        // We are interested in PURCHASE_ORDER_CONFIRMED
        if (event.type === 'PURCHASE_ORDER_CONFIRMED') {
            const { confirmedItems } = event.payload;

            console.log(`[Inventory] Received Purchase Confirmation. Updating stock...`);

            // Iterate items and update stock
            for (const item of confirmedItems) {
                // Find Master Item ID by EAN? 
                // For now, let's assume 'item.ean' maps to 'itemId' roughly or we use lookups.
                // In Phase 22, we mocked items without IDs in the Parser, but the Dashboard had them?
                // Actually the Dashboard used mock data or the ingested data.
                // Let's rely on a simplified mapping for this prototype: 
                // We'll store stock by EAN if available, or just Name :D 
                // Ideally, we need to map EAN -> MasterItemID.

                const key = item.ean || item.name;
                const current = this.theoreticalStock[key] || 0;
                this.theoreticalStock[key] = current + item.quantity;

                // Also append an explicit Inventory Transaction event
                await this.eventService.append({
                    stream_id: `inventory-transactions`,
                    type: 'INVENTORY_STOCK_UPDATED',
                    payload: {
                        reason: 'PURCHASE_RECEIVED',
                        itemKey: key,
                        delta: item.quantity,
                        newLevel: this.theoreticalStock[key]
                    },
                    meta: { timestamp: new Date().toISOString(), user: 'system' },
                    occurred_at: new Date()
                });
            }
        }
    }

    getTheoreticalStock(key: string) {
        return this.theoreticalStock[key] || 0;
    }

    @OnEvent('TRANSFER_ACCEPTED')
    async handleTransferAccepted(payload: { transferId: string; receiverId: string; itemId: string; finalQuantity: number }) {
        console.log(`[Inventory] Transfer Accepted: ${payload.finalQuantity} of ${payload.itemId} to ${payload.receiverId}`);

        // Update theoretical stock
        const key = payload.itemId; // Simplified mapping
        const current = this.theoreticalStock[key] || 0;
        this.theoreticalStock[key] = current + payload.finalQuantity;

        await this.eventService.append({
            stream_id: `inventory-${payload.receiverId}-${payload.itemId}`,
            type: 'INVENTORY_ADJUSTED',
            payload: {
                quantity: payload.finalQuantity,
                reason: `Transfer In: ${payload.transferId}`
            },
            meta: { source: 'TRANSFER' },
            occurred_at: new Date()
        });
    }

    async submitCount(dto: InventoryCountDto) {
        const { restaurantId, date, items } = dto;

        // 1. Get Template for validation
        const template = await this.getTemplate(restaurantId);

        // 2. Validate all template items are present
        const templateItemIds = template.items.map(i => i.id);
        const submittedItemIds = items.map(i => i.itemId);

        const missingItems = templateItemIds.filter(id => !submittedItemIds.includes(id));

        if (missingItems.length > 0) {
            // In a real app we might allow partial counts, but spec says "Inventory required items validation"
            // We'll throw an error listing missing items
            throw new Error(`Inventory submission incomplete. Missing items: ${missingItems.join(', ')}`);
        }

        const streamId = `restaurant-${restaurantId}-inventory-${date}`;

        const event = {
            stream_id: streamId,
            type: 'INVENTORY_COUNT_SUBMITTED',
            payload: {
                restaurantId,
                date,
                items,
                countType: 'FULL_COUNT'
            },
            meta: { timestamp: new Date().toISOString(), user: 'system' },
            occurred_at: new Date(),
        };

        return this.eventService.append(event);
    }
    async getTemplate(restaurantId: string) {
        // Mock template for now - simplified
        return {
            categories: ['Food', 'Alcohol', 'Soft Drinks'],
            items: [
                { id: 'item-1', name: 'Burger Bun', category: 'Food', unit: 'pcs' },
                { id: 'item-2', name: 'Beef Patty', category: 'Food', unit: 'kg' },
                { id: 'item-3', name: 'Coca Cola', category: 'Soft Drinks', unit: 'l' },
                { id: 'item-4', name: 'Beer', category: 'Alcohol', unit: 'l' },
            ]
        };
    }
}
