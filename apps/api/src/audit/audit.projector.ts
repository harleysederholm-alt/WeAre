import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from '../ledger/event.service';
import { AuditLogEntity } from './audit.entity';

@Injectable()
export class AuditProjector implements OnModuleInit {
    constructor(
        private readonly eventService: EventService,
        @InjectRepository(AuditLogEntity)
        private readonly auditRepo: Repository<AuditLogEntity>,
    ) { }

    onModuleInit() {
        this.eventService.subscribe('DAILY_REPORT_SUBMITTED', this.handleDailyReport.bind(this));
        this.eventService.subscribe('TIPS_DISTRIBUTED', this.handleTipsDistributed.bind(this));
        this.eventService.subscribe('TIP_PAID', this.handleTipPaid.bind(this));
        this.eventService.subscribe('TIPS_POLICY_UPDATED', this.handlePolicyUpdate.bind(this));
        this.eventService.subscribe('ORDER_REQUEST_SUBMITTED', this.handleOrderSubmitted.bind(this));
    }

    private async handleOrderSubmitted(event: any) {
        await this.log(
            event,
            'ORDER_SENT',
            `Order sent to ${event.payload.recipientEmail} (${event.payload.items.length} items)`
        );
    }

    private async handleDailyReport(event: any) {
        await this.log(
            event,
            'DAILY_SUBMISSION',
            `Daily Report submitted for ${event.payload.date}`
        );
    }

    private async handleTipsDistributed(event: any) {
        await this.log(
            event,
            'TIPS_DISTRIBUTED',
            `Tips distributed for ${event.payload.date}. Total: ${event.payload.totalTips}€`
        );
    }

    private async handleTipPaid(event: any) {
        await this.log(
            event,
            'TIP_PAID',
            `Tip Payout: ${event.payload.amount}€ to ${event.payload.employeeId} (${event.payload.mode})`
        );
    }

    private async handlePolicyUpdate(event: any) {
        await this.log(
            event,
            'POLICY_CHANGE',
            `Manager Inclusion Policy set to: ${event.payload.includeManagers}`
        );
    }

    private async log(event: any, action: string, description: string) {
        const parts = event.stream_id.split('-');
        const restaurantId = parts[1]; // Assumes standard stream_id: restaurant-{id}-...

        const entry = new AuditLogEntity();
        entry.restaurantId = restaurantId;
        entry.timestamp = new Date(); // Or use event.occurred_at? Audit usually means "when we processed it" or "when it happened".
        // Let's use current time for "Log Time".

        // Actor is tricky. Events usually have `meta.userId` or similar.
        // Our current EventEntity doesn't explicitly enforce meta structure.
        // We'll check event.meta?.userId or default to 'System/Unknown'.
        entry.actor = event.meta?.userId || 'System';

        entry.action = action;
        entry.details = {
            description,
            streamId: event.stream_id,
            eventId: event.id,
            payload: event.payload
        };

        await this.auditRepo.save(entry);
        console.log(`[Audit] Logged ${action} for ${restaurantId}`);
    }
}
