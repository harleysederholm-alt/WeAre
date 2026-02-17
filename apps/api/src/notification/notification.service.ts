import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { EventService } from '../ledger/event.service';

@Injectable()
export class NotificationService implements OnModuleInit {
    private readonly logger = new Logger(NotificationService.name);

    constructor(private readonly eventService: EventService) { }

    onModuleInit() {
        this.logger.log('NotificationService initialized. Subscribing to critical events...');
        this.eventService.subscribe('DAILY_REPORT_SUBMITTED', this.handleDailyReport.bind(this));
        this.eventService.subscribe('ORDER_REQUEST_SUBMITTED', this.handleOrderRequest.bind(this));
        this.eventService.subscribe('WASTE_LOGGED', this.handleWasteLogged.bind(this));
    }

    private handleDailyReport(event: any) {
        const { restaurantId, date, sales, cashTips } = event.payload;
        // Mock Email
        this.logger.log(`[EMAIL SENT] To: manager@weare.fi | Subject: End of Day Report - ${date}
        ----------------------------------------------------
        Restaurant: ${restaurantId}
        Total Sales: ${sales?.length || 0} items
        Cash Tips: ${cashTips} €
        ----------------------------------------------------`);
    }

    private handleOrderRequest(event: any) {
        const { restaurantId, supplier, items, orderId } = event.payload;
        // Mock Email
        this.logger.log(`[EMAIL SENT] To: ${supplier} (CC: manager@weare.fi) | Subject: New Order ${orderId}
        ----------------------------------------------------
        Restaurant: ${restaurantId}
        Items: ${items.length}
        ----------------------------------------------------`);
    }

    private handleWasteLogged(event: any) {
        const { itemId, quantity, totalLossCents, reason } = event.payload;

        // Mock SMS Alert Rule: If total loss > 50.00€
        const thresholdCents = 5000;

        if (totalLossCents > thresholdCents) {
            this.logger.warn(`[SMS ALERT] To: MANAGER (+358 40 1234567)
             ----------------------------------------------------
             HIGH WASTE ALERT!
             Item: ${itemId}
             Quantity: ${quantity}
             Loss: ${(totalLossCents / 100).toFixed(2)} €
             Reason: ${reason}
             ----------------------------------------------------`);
        } else {
            this.logger.log(`[INFO] Waste logged: ${itemId}, ${(totalLossCents / 100).toFixed(2)}€ (No alert needed)`);
        }
    }
}
