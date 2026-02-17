import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { HelpService } from './help.service';
import { CreateHelpArticleDto } from './help.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('help')
@UseGuards(RolesGuard)
export class HelpController {
    constructor(private readonly helpService: HelpService) { }

    @Post()
    @Roles('MANAGER', 'ADMIN')
    async createHelp(@Body() dto: CreateHelpArticleDto, @Req() req: any) {
        const userId = req.headers['x-user-id'] || 'system';
        return this.helpService.createHelp(dto, userId);
    }

    @Get()
    @Roles('STAFF', 'MANAGER', 'ADMIN')
    getHelp(
        @Query('context') context?: string,
        @Query('query') query?: string,
        @Query('restaurantId') restaurantId?: string
    ) {
        return this.helpService.getHelp({ context, query, restaurantId });
    }
}
