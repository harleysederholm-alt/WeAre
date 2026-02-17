import { Controller, Get, Post, Body, UseGuards, Req, Query, Param } from '@nestjs/common';
import { RosterService } from './roster.service';
import { ImportRosterDto } from './roster.dto';
import type { Request } from 'express';

@Controller('roster')
export class RosterController {
    constructor(private readonly rosterService: RosterService) { }

    @Post('import')
    async importRoster(@Body() dto: ImportRosterDto, @Req() req: Request) {
        const userId = (req.headers['x-user-id'] as string) || 'unknown';
        return this.rosterService.importRoster(dto, userId);
    }

    @Get('deviations')
    async getDeviations(@Query('restaurantId') restaurantId: string) {
        return this.rosterService.getDeviations(restaurantId);
    }

    @Post('deviations/:id/ack')
    async ackDeviation(@Param('id') id: string) {
        return this.rosterService.acknowledgeDeviation(id);
    }

    // Prototype helper to trigger analysis manually with provided actuals
    @Post('analyze')
    async analyze(@Body() body: { restaurantId: string, date: string, actualShifts: any[] }) {
        return this.rosterService.analyzeDeviations(body.restaurantId, body.date, body.actualShifts);
    }
}
