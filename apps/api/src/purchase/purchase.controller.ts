import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { IngestEmailDto, ConfirmPurchaseDto } from './purchase.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('purchases')
@UseGuards(RolesGuard)
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Post('ingest')
    @Roles('ADMIN', 'MANAGER') // In real life, this might be a webhook with API Key
    async ingestEmail(@Body() dto: IngestEmailDto, @Req() req: any) {
        return this.purchaseService.ingestEmail(dto, 'webhook-or-manager');
    }

    @Get('pending')
    @Roles('MANAGER', 'ADMIN')
    getPending() {
        return this.purchaseService.getPendingOrders();
    }

    @Get(':id')
    @Roles('MANAGER', 'ADMIN')
    getOne(@Param('id') id: string) {
        return this.purchaseService.getOrder(id);
    }

    @Post(':id/confirm')
    @Roles('MANAGER', 'ADMIN')
    async confirm(@Param('id') id: string, @Body() dto: ConfirmPurchaseDto, @Req() req: any) {
        const userId = req.headers['x-user-id'] || 'manager';
        return this.purchaseService.confirmOrder(id, dto, userId);
    }
}
