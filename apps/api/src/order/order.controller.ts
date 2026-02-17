import { Controller, Post, Body, UseGuards, Req, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { ForecastingService } from './forecasting.service';
import { OrderRequestDto } from './order.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import type { Request } from 'express';

@Controller('order')
@UseGuards(RolesGuard)
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly forecastingService: ForecastingService
    ) { }

    @Post('request')
    @Roles('STAFF', 'MANAGER', 'ADMIN')
    async sendOrder(@Body() dto: OrderRequestDto, @Req() req: Request) {
        // Mock User ID from header (or JWT in real app)
        const userId = (req.headers['x-user-id'] as string) || 'unknown-user';
        return this.orderService.sendOrder(dto, userId);
    }

    @Get('suggestions')
    @Roles('MANAGER', 'ADMIN')
    async getSuggestions(@Query('restaurantId') restaurantId: string = 'restaurant-1') {
        return this.forecastingService.generateSuggestions(restaurantId);
    }
}
