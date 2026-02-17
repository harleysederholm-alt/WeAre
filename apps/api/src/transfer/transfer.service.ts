import { Injectable } from '@nestjs/common';
import { EventService } from '../ledger/event.service';
import { InitiateTransferDto, ResolveTransferDto } from './transfer.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransferService {
    // In-memory state for prototype
    private transfers: any[] = [];

    constructor(private readonly eventService: EventService) { }

    // In a real app, we'd rebuild state from events or use a Read Model
    // For now, we'll just query the event stream or keep a simple in-memory list populated by onModuleInit
    // but to keep it simple and stateless for this prototype, I'll rely on a simple array 
    // that won't persist across restarts unless I implement a Projector. 
    // Let's implement a simple getter that filters from a "mock" db or just returns what we have.
    // Actually, let's allow "replaying" or just storing in memory is fine for the session.

    async initiateTransfer(senderId: string, dto: InitiateTransferDto, userId: string) {
        const transferId = uuidv4();
        const transfer = {
            id: transferId,
            senderId,
            receiverId: dto.receiverId,
            itemId: dto.itemId,
            quantity: dto.quantity,
            reason: dto.reason,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };
        this.transfers.push(transfer);

        await this.eventService.append({
            stream_id: `transfer-${transferId}`,
            type: 'TRANSFER_INITIATED',
            payload: transfer,
            meta: { userId },
            occurred_at: new Date()
        });

        return transfer;
    }

    async resolveTransfer(dto: ResolveTransferDto, userId: string) {
        const transfer = this.transfers.find(t => t.id === dto.transferId);
        if (!transfer) throw new Error('Transfer not found');
        if (transfer.status !== 'PENDING') throw new Error('Transfer already resolved');

        transfer.status = dto.action === 'ACCEPT' ? 'COMPLETED' : 'REJECTED';

        await this.eventService.append({
            stream_id: `transfer-${dto.transferId}`,
            type: dto.action === 'ACCEPT' ? 'TRANSFER_ACCEPTED' : 'TRANSFER_REJECTED',
            payload: {
                transferId: dto.transferId,
                receiverId: transfer.receiverId,
                itemId: transfer.itemId,
                finalQuantity: dto.quantity || transfer.quantity,
                reason: dto.reason
            },
            meta: { userId },
            occurred_at: new Date()
        });

        return transfer;
    }

    getPendingTransfers(restaurantId: string) {
        return this.transfers.filter(t => t.receiverId === restaurantId && t.status === 'PENDING');
    }
}
