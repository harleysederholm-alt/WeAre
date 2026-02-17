import { Controller, Post, Body, BadRequestException, Get, Param, Res, NotFoundException, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { DailyService } from './daily.service';
import { PdfService } from './pdf.service';
import { DailyReportDto } from './daily.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('daily')
@UseGuards(RolesGuard)
export class DailyController {
    constructor(
        private readonly dailyService: DailyService,
        private readonly pdfService: PdfService
    ) { }

    @Post('submit')
    @Roles('STAFF', 'MANAGER', 'ADMIN')
    async submitEod(@Body() dto: DailyReportDto, @Req() req: Request) {
        const { restaurantId, date, ...rest } = dto;

        // Date Boundary Check (F2 Spec)
        const submissionDate = new Date(date);
        const now = new Date();
        // Start of previous month: 1st day of (Current Month - 1)
        const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Reset hours to compare dates only roughly (or strictly?)
        // Spec: "current month + previous month".
        // Using strict time comparison might be too harsh if timezones differ, but < startOfPreviousMonth is safe.
        // startOfPreviousMonth is 00:00:00 on the 1st.

        if (submissionDate < startOfPreviousMonth) {
            // Check for Admin override
            // In Mock Auth, we look at headers. In real JWT, req.user.
            const userRole = req.headers['x-user-role'];
            if (userRole !== 'ADMIN') {
                throw new ForbiddenException('Cannot submit reports older than previous month. Admin override required.');
            }
        }

        try {
            const result = await this.dailyService.submitEod(restaurantId, date, rest);
            return { success: true, eventId: result.id };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get('pdf/:restaurantId/:date')
    @Roles('MANAGER', 'ADMIN')
    async getPdf(
        @Param('restaurantId') restaurantId: string,
        @Param('date') date: string,
        @Res() res: Response
    ) {
        const report = await this.dailyService.getDailyReport(restaurantId, date);
        if (!report) {
            throw new NotFoundException('Daily report not found for this date');
        }

        const buffer = await this.pdfService.generateDailyReportPdf(report);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=report-${restaurantId}-${date}.pdf`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}
