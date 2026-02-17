import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DailyReportView } from './daily-report-view.entity';

@Controller('reports')
export class ReportsController {
    constructor(
        @InjectRepository(DailyReportView)
        private readonly viewRepo: Repository<DailyReportView>,
    ) { }

    @Get('daily')
    async getDailyReports(
        @Query('restaurantId') restaurantId: string,
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {
        // Default to last 30 days if not provided
        const endDate = to || new Date().toISOString().split('T')[0];
        const startDate = from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        return this.viewRepo.find({
            where: {
                restaurantId: restaurantId || 'restaurant-1', // Default ID for mock
                date: Between(startDate, endDate)
            },
            order: { date: 'DESC' }
        });
    }
}
