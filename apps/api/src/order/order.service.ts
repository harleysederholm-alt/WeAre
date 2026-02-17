import { Injectable, Logger } from '@nestjs/common';
import { EventService } from '../ledger/event.service';
import { OrderRequestDto } from './order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(private readonly eventService: EventService) { }

    async sendOrder(dto: OrderRequestDto, userId: string) {
        const orderId = uuidv4();
        const timestamp = new Date().toISOString();

        // 1. Log the "Email" (Mock)
        const emailBody = `
        ----------------------------------------------------
        TILAUSPYYNTÖ (ORDER REQUEST)
        ----------------------------------------------------
        To: ${dto.recipientEmail}
        Subject: Tilauspyyntö - ${dto.restaurantId} - ${dto.category} - ${timestamp.split('T')[0]}
        
        Supplier: ${dto.supplier}
        Requested By: ${userId}
        Delivery Date: ${dto.deliveryDate || 'ASAP'}

        ITEMS:
        ${dto.items.map(i => `- ${i.name}: ${i.quantity} ${i.unit} (${i.notes || ''})`).join('\n')}
        ----------------------------------------------------
        `;

        this.logger.log(`[MOCK EMAIL SENT] ${emailBody}`);

        // 2. Audit Log (Write to Ledger/Audit Stream)
        // We use a specific event type that the AuditProjector picks up (or we make sure it does)
        // The AuditProjector subscribes to 'ORDER_REQUEST_SUBMITTED' if we add it, or we can just append to a dedicated stream.
        // Let's append to the restaurant's stream so it's verifiable.

        await this.eventService.append({
            stream_id: `restaurant-${dto.restaurantId}-orders`, // Separate stream or main? Let's use orders stream.
            type: 'ORDER_REQUEST_SUBMITTED',
            payload: {
                orderId,
                ...dto,
                emailBodySnapshot: emailBody // Snapshot of what was sent
            },
            meta: { userId, timestamp }
        });

        // 3. Return success
        return { orderId, status: 'SENT' };
    }
}
