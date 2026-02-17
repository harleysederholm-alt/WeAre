import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { InitiateTransferDto, ResolveTransferDto } from './transfer.dto';
import type { Request } from 'express';

@Controller('transfer')
export class TransferController {
    constructor(private readonly transferService: TransferService) { }

    @Post('initiate')
    async initiate(@Body() dto: InitiateTransferDto, @Req() req: Request) {
        const userId = (req.headers['x-user-id'] as string) || 'unknown';
        const senderId = (req.headers['x-restaurant-id'] as string) || 'restaurant-1';
        return this.transferService.initiateTransfer(senderId, dto, userId);
    }

    @Post('resolve')
    async resolve(@Body() dto: ResolveTransferDto, @Req() req: Request) {
        const userId = (req.headers['x-user-id'] as string) || 'unknown';
        return this.transferService.resolveTransfer(dto, userId);
    }

    @Get('pending')
    async getPending(@Query('restaurantId') restaurantId: string) {
        return this.transferService.getPendingTransfers(restaurantId);
    }
}
