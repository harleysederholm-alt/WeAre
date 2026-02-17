import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { VersioningService } from './versioning.service';
import { RolesGuard } from '../auth/roles.guard';
import { ChangeDto, AckDto } from './changelog.dto';
import type { Request } from 'express';

@Controller('changelog')
// @UseGuards(RolesGuard) // Optional for now, or ensure userId is passed
export class ChangelogController {
    constructor(private readonly versioningService: VersioningService) { }

    @Get('status')
    async getStatus(@Req() req: Request) {
        // Mock user from header for prototype
        const userId = (req.headers['x-user-id'] as string) || 'system';
        const currentVersion = this.versioningService.getCurrentVersion();
        const userAck = this.versioningService.getUserAck(userId);

        const pendingChanges = this.versioningService.getChangesSince(userAck);
        const requiresAck = currentVersion > userAck;

        return {
            currentVersion,
            userAck,
            requiresAck,
            pendingChanges
        };
    }

    @Post('ack')
    async acknowledge(@Body() dto: AckDto, @Req() req: Request) {
        const userId = (req.headers['x-user-id'] as string) || 'system';
        await this.versioningService.ackVersion(userId, dto.version);
        return { success: true };
    }

    // Admin/Dev endpoint to force a version bump (for testing)
    @Post('bump')
    async bumpVersion(@Body() changes: ChangeDto[]) {
        const v = await this.versioningService.incrementVersion(changes);
        return { version: v };
    }
}
