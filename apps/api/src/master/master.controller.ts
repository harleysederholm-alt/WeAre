import { Controller, Post, Get, Body, UseGuards, Req, Query } from '@nestjs/common';
import { MasterService } from './master.service';
import { CreateSuggestionDto, ResolveSuggestionDto } from './master.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('master')
@UseGuards(RolesGuard)
export class MasterController {
    constructor(private readonly masterService: MasterService) { }

    @Post('suggestion')
    @Roles('STAFF', 'MANAGER', 'ADMIN')
    async submitSuggestion(@Body() dto: CreateSuggestionDto, @Req() req: any) {
        const userId = req.headers['x-user-id'] || 'system';
        return this.masterService.submitSuggestion(dto, userId);
    }

    @Get('items')
    @Roles('STAFF', 'MANAGER', 'ADMIN')
    getItems(@Query('q') query: string) {
        return this.masterService.searchItems(query);
    }

    @Get('suggestions')
    @Roles('MANAGER', 'ADMIN')
    getPendingSuggestions() {
        return this.masterService.getPendingSuggestions();
    }

    @Post('resolve')
    @Roles('ADMIN') // Only Admin can approve master data changes
    async resolveSuggestion(@Body() dto: ResolveSuggestionDto, @Req() req: any) {
        const userId = req.headers['x-user-id'] || 'admin';
        return this.masterService.resolveSuggestion(dto, userId);
    }
}
