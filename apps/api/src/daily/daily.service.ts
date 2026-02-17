import { Injectable } from '@nestjs/common';
import { EventService } from '../ledger/event.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DailyService {
    constructor(private readonly eventService: EventService) { }

    async submitEod(restaurantId: string, date: string, data: any) {
        // TODO: Validate that a report for this date/restaurant hasn't already been submitted?
        // Or rely on the fact that we can append, and the read model determines the "active" one.
        // The design doc says: "Once submitted, the report is locked. Corrections require a CORRECTED event."
        // So we should probably check if a SUBMITTED event exists for this day/restaurant stream.

        const streamId = `restaurant-${restaurantId}-${date}`;
        const existingEvents = await this.eventService.getStream(streamId);

        const alreadySubmitted = existingEvents.some(e => e.type === 'DAILY_REPORT_SUBMITTED');
        if (alreadySubmitted) {
            // In a real implementation, we might throw an error or require a "CORRECTION" type.
            // For now, we'll allow it but log a warning or assume it's a correction if the user intended.
            // But the prompt says "Corrections require a DAILY_REPORT_CORRECTED event".
            // So if they hit "Submit EOD" again, we should block it.
            throw new Error('Daily report already submitted. Use correction flow.');
        }

        const event = {
            stream_id: streamId,
            type: 'DAILY_REPORT_SUBMITTED',
            payload: data,
            meta: { timestamp: new Date().toISOString() },
            occurred_at: new Date(), // or business date? "occurred_at" usually means wall clock time.
        };

        return this.eventService.append(event);
    }

    async getDailyReport(restaurantId: string, date: string) {
        const streamId = `restaurant-${restaurantId}-${date}`;
        const events = await this.eventService.getStream(streamId);
        // In a real system we would sort by version/time and maybe merge corrections.
        // For now, take the latest submission.
        const submission = events.reverse().find(e => e.type === 'DAILY_REPORT_SUBMITTED');

        if (!submission) return null;

        return {
            ...submission.payload,
            date,
            restaurantId,
            submittedBy: submission.meta?.userId || 'Unknown',
            submittedAt: submission.occurred_at
        };
    }
}
