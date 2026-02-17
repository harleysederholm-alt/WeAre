import { Injectable } from '@nestjs/common';
import { EventService } from '../ledger/event.service';
import { ChangeDto } from './changelog.dto';

@Injectable()
export class VersioningService {
    // In-memory state for prototype
    private currentVersion = '2026.01.01.0000'; // Default start
    private userAcks: Record<string, string> = {};
    private changeHistory: { version: string; date: string; changes: ChangeDto[] }[] = [];

    constructor(private readonly eventService: EventService) {
        // In real app, replay events to rebuild state
    }

    getCurrentVersion() {
        return this.currentVersion;
    }

    getUserAck(userId: string) {
        return this.userAcks[userId] || '0000.00.00.0000';
    }

    getChangesSince(userVersion: string) {
        // String comparison works for ISO-like format YYYY.MM.DD.HHMM
        return this.changeHistory.filter(c => c.version.localeCompare(userVersion) > 0);
    }

    private generateVersion(): string {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        return `${yyyy}.${mm}.${dd}.${hh}${min}`;
    }

    async incrementVersion(changes: ChangeDto[], userId: string = 'system') {
        const newVersion = this.generateVersion();

        // Prevent duplicate version in same minute (edge case)
        if (newVersion <= this.currentVersion) {
            // In real app, maybe append suffix or wait. 
            // For prototype, just warn or use current + suffix? 
            // Let's assume low frequency for now.
            // Or technically manual increment minute?
        }

        this.currentVersion = newVersion;

        const versionEntry = {
            version: this.currentVersion,
            date: new Date().toISOString(),
            changes
        };
        this.changeHistory.push(versionEntry);

        // Persist via Event
        await this.eventService.append({
            stream_id: 'master-versioning',
            type: 'MASTER_VERSION_INCREMENTED',
            payload: versionEntry,
            meta: { timestamp: new Date().toISOString(), user: userId },
            occurred_at: new Date()
        });

        return this.currentVersion;
    }

    async ackVersion(userId: string, version: string) {
        this.userAcks[userId] = version;

        // Persist Ack
        await this.eventService.append({
            stream_id: `user-${userId}-ack`,
            type: 'USER_ACKNOWLEDGED_VERSION',
            payload: { version },
            meta: { timestamp: new Date().toISOString(), user: userId },
            occurred_at: new Date()
        });
    }
}
