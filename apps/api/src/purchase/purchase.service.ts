import { Injectable, NotFoundException } from '@nestjs/common';
import { EventService } from '../ledger/event.service';
import { EmailIngestionService, ParsedOrder } from './email-ingestion.service';
import { IngestEmailDto, ConfirmPurchaseDto, PurchaseStatus } from './purchase.dto';
import { v4 as uuidv4 } from 'uuid';

export interface PurchaseOrder extends ParsedOrder {
    id: string;
    status: PurchaseStatus;
    ingestedAt: string;
}

@Injectable()
export class PurchaseService {
    // In-memory Read Model
    private orders: PurchaseOrder[] = [];

    constructor(
        private readonly eventService: EventService,
        private readonly emailService: EmailIngestionService
    ) { }

    async ingestEmail(dto: IngestEmailDto, userId: string = 'system') {
        const parsed = this.emailService.parseEmail(dto.sender, dto.subject, dto.body);
        const id = uuidv4();
        const timestamp = new Date().toISOString();

        const event = {
            stream_id: 'purchase-orders',
            type: 'PURCHASE_ORDER_RECEIVED',
            payload: {
                id,
                ...parsed,
                sender: dto.sender,
                subject: dto.subject,
                status: PurchaseStatus.PENDING
            },
            meta: { timestamp, userId },
            occurred_at: new Date()
        };

        await this.eventService.append(event);

        // Update Read Model
        this.orders.push({
            id,
            ...parsed,
            status: PurchaseStatus.PENDING,
            ingestedAt: timestamp
        });

        return { id, status: 'PENDING', itemCount: parsed.items.length };
    }

    getPendingOrders() {
        return this.orders.filter(o => o.status === PurchaseStatus.PENDING);
    }

    getOrder(id: string) {
        return this.orders.find(o => o.id === id);
    }

    async confirmOrder(id: string, dto: ConfirmPurchaseDto, userId: string) {
        const orderIndex = this.orders.findIndex(o => o.id === id);
        if (orderIndex === -1) throw new NotFoundException('Order not found');

        const timestamp = new Date().toISOString();

        const event = {
            stream_id: 'purchase-orders',
            type: 'PURCHASE_ORDER_CONFIRMED',
            payload: {
                id,
                confirmedItems: dto.items,
                confirmedDate: dto.date,
                status: PurchaseStatus.CONFIRMED
            },
            meta: { timestamp, userId },
            occurred_at: new Date()
        };

        await this.eventService.append(event);

        // Update Read Model
        this.orders[orderIndex].status = PurchaseStatus.CONFIRMED;
        this.orders[orderIndex].items = dto.items; // Update with corrected items
        this.orders[orderIndex].orderDate = dto.date;

        return { success: true };
    }
}
