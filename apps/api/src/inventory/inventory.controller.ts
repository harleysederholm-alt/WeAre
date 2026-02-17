import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryCountDto } from './inventory.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('inventory')
@UseGuards(RolesGuard)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('count')
    @Roles('STAFF', 'MANAGER')
    async submitCount(@Body() dto: InventoryCountDto) {
        const result = await this.inventoryService.submitCount(dto);
        return { success: true, eventId: result.id };
    }

    @Get('stock')
    @Roles('MANAGER', 'ADMIN')
    async getStock(@Query('key') key: string) {
        return { quantity: this.inventoryService.getTheoreticalStock(key) };
    }

    @Get('template')
    @Roles('STAFF', 'MANAGER')
    async getTemplate(@Query('restaurantId') restaurantId: string) {
        return this.inventoryService.getTemplate(restaurantId);
    }
}
