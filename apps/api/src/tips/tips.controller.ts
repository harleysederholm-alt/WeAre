import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { TipsService } from './tips.service';
import type { PreviewTipsDto, ApproveTipsDto, FlushTipsDto, SetPolicyDto } from './tips.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tips')
@UseGuards(RolesGuard)
export class TipsController {
    constructor(private readonly tipsService: TipsService) { }

    @Post('preview')
    async preview(@Body() dto: PreviewTipsDto) {
        return this.tipsService.previewDistribution(dto);
    }

    @Post('approve')
    @Roles('MANAGER')
    async approve(@Body() dto: ApproveTipsDto) {
        return this.tipsService.approveDistribution(dto);
    }

    @Post('flush')
    @Roles('MANAGER')
    async flush(@Body() dto: FlushTipsDto) {
        return this.tipsService.flushTips(dto);
    }

    @Get('policy/:restaurantId')
    async getPolicy(@Param('restaurantId') restaurantId: string) {
        return this.tipsService.getManagerPolicy(restaurantId);
    }

    @Post('policy')
    @Roles('MANAGER')
    async setPolicy(@Body() dto: SetPolicyDto) {
        return this.tipsService.setManagerPolicy(dto);
    }

    @Get('balance/:restaurantId')
    async getBalances(@Param('restaurantId') restaurantId: string) {
        return this.tipsService.getBalances(restaurantId);
    }
}
