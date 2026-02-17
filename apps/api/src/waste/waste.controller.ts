import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { WasteService } from './waste.service';
import type { LogWasteDto } from './waste.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('waste')
@UseGuards(RolesGuard)
export class WasteController {
    constructor(private readonly wasteService: WasteService) { }

    @Post('log')
    @Roles('MANAGER')
    async logWaste(@Body() body: LogWasteDto) {
        const result = await this.wasteService.logWaste(body);
        return { success: true, eventId: result.id };
    }
}
