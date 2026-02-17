import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyReportView } from './daily-report-view.entity';
import { EventEntity } from '../ledger/event.entity';

@Injectable()
export class ProjectorService {
    private readonly logger = new Logger(ProjectorService.name);

    constructor(
        @InjectRepository(DailyReportView)
        private readonly viewRepo: Repository<DailyReportView>,
    ) { }

    @OnEvent('event.appended')
    async handleEvent(event: EventEntity) {
        this.logger.log(`Projecting event: ${event.type} (${event.id})`);

        if (event.type === 'DAILY_REPORT_SUBMITTED') {
            await this.handleDailyReport(event);
        } else if (event.type === 'WASTE_LOGGED') {
            await this.handleWaste(event);
        }
    }

    private async handleDailyReport(event: EventEntity) {
        const { restaurantId, date, sales, cash, tips } = event.payload;
        const id = `${restaurantId}-${date}`;

        // Get existing to preserve waste data if we are just submitting EOD
        const existing = await this.viewRepo.findOneBy({ id });

        const entity = new DailyReportView();
        entity.id = id;
        entity.restaurantId = restaurantId;
        entity.date = date;

        // Parse values from payload (safely handle mock data format)
        entity.total_sales = this.sumSales(sales);
        entity.total_cash = Number(cash) || 0;

        // Tips might be calculated or just passed. 
        // For now assuming payload has 'calculatedTips' or we sum user inputs.
        // In our scaffolding, we didn't strictly define the payload shape of DAILY_REPORT_SUBMITTED in code, 
        // but in DailyController we dumped the body. 
        // Let's assume the body has 'sales' array.

        // As a strict projector, if payload is missing data, we default to 0.
        entity.total_tips = 0; // Placeholder until we parse tip payload strictly

        // Preserve waste if exists
        if (existing) {
            entity.total_waste_cost = existing.total_waste_cost;
            entity.waste_count = existing.waste_count;
        }

        await this.viewRepo.save(entity);
    }

    private async handleWaste(event: EventEntity) {
        const { restaurantId, date, totalLossCents } = event.payload;
        const id = `${restaurantId}-${date}`; // Waste logged today belongs to today's report

        // We need to ensure the row exists. 
        // If waste is logged BEFORE EOD, we create a partial row.
        let entity = await this.viewRepo.findOneBy({ id });
        if (!entity) {
            entity = new DailyReportView();
            entity.id = id;
            entity.restaurantId = restaurantId;
            entity.date = date;
            entity.total_sales = 0;
            entity.total_cash = 0;
            entity.total_tips = 0;
            entity.total_waste_cost = 0;
            entity.waste_count = 0;
        }

        // Update waste totals
        const cost = Number(totalLossCents) / 100; // Convert cents to eur
        entity.total_waste_cost = Number(entity.total_waste_cost) + cost;
        entity.waste_count += 1;

        await this.viewRepo.save(entity);
    }

    private sumSales(sales: any[]): number {
        if (!Array.isArray(sales)) return 0;
        return sales.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    }
}
