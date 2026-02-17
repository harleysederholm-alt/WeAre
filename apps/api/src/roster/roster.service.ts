import { Injectable } from '@nestjs/common';
import { EventService } from '../ledger/event.service';
import { ImportRosterDto, PlannedShiftDto } from './roster.dto';
import { v4 as uuidv4 } from 'uuid';

export interface PlannedShift {
    id: string;
    restaurantId: string;
    employeeName: string;
    date: string;
    startTime: string;
    endTime: string;
}

export interface ShiftDeviation {
    id: string;
    restaurantId: string;
    date: string;
    employeeName: string;
    type: 'LATE_START' | 'EARLY_LEAVE' | 'OVERTIME' | 'MISSING_SHIFT' | 'EXTRA_SHIFT' | 'OK';
    details: string;
    severity: 'INFO' | 'REVIEW' | 'CRITICAL';
    status: 'OPEN' | 'ACKNOWLEDGED';
    acknowledgedAt?: string;
}

@Injectable()
export class RosterService {
    // In-memory state for prototype
    private plannedShifts: PlannedShift[] = [];
    private deviations: ShiftDeviation[] = [];

    constructor(private readonly eventService: EventService) { }

    async importRoster(dto: ImportRosterDto, userId: string) {
        const events = dto.shifts.map(s => ({
            stream_id: `roster-${dto.restaurantId}-${s.date}`,
            type: 'ROSTER_IMPORTED',
            payload: { ...s, restaurantId: dto.restaurantId },
            meta: { userId },
            occurred_at: new Date()
        }));

        // Store in memory
        dto.shifts.forEach(s => {
            this.plannedShifts.push({
                id: uuidv4(),
                restaurantId: dto.restaurantId,
                ...s
            });
        });

        // Persist
        for (const e of events) {
            await this.eventService.append(e);
        }

        return { count: dto.shifts.length };
    }

    async analyzeDeviations(restaurantId: string, date: string, actualShifts: any[]) {
        const plannedForDay = this.plannedShifts.filter(p => p.restaurantId === restaurantId && p.date === date);
        const newDeviations: ShiftDeviation[] = [];

        // Map Actual Shifts
        const actualMap = new Map(actualShifts.map(s => [s.name?.toLowerCase(), s]));
        const plannedMap = new Map(plannedForDay.map(p => [p.employeeName?.toLowerCase(), p]));

        // Check Planned vs Actual
        for (const [name, planned] of plannedMap) {
            const actual = actualMap.get(name);
            if (!actual) {
                newDeviations.push(this.createDeviation(restaurantId, date, planned.employeeName, 'MISSING_SHIFT', 'Scheduled but did not work', 'REVIEW'));
            } else {
                // Compare times
                const diffStart = this.timeDiff(planned.startTime, actual.start);
                if (diffStart > 15) {
                    newDeviations.push(this.createDeviation(restaurantId, date, planned.employeeName, 'LATE_START', `Started ${diffStart}m late`, 'REVIEW'));
                }
                // ... more logic (Early leave, etc)
                actualMap.delete(name);
            }
        }

        // Check Extras (Remaining in Actual Map)
        for (const [name, actual] of actualMap) {
            newDeviations.push(this.createDeviation(restaurantId, date, actual.name, 'EXTRA_SHIFT', 'Worked but not scheduled', 'INFO'));
        }

        this.deviations.push(...newDeviations);
        return newDeviations;
    }

    private createDeviation(restaurantId: string, date: string, name: string, type: any, details: string, severity: any): ShiftDeviation {
        return {
            id: uuidv4(),
            restaurantId,
            date,
            employeeName: name,
            type,
            details,
            severity,
            status: 'OPEN'
        };
    }

    private timeDiff(planned: string, actual: string): number {
        if (!planned || !actual) return 0;
        const [ph, pm] = planned.split(':').map(Number);
        const [ah, am] = actual.split(':').map(Number);
        return (ah * 60 + am) - (ph * 60 + pm);
    }

    getDeviations(restaurantId: string) {
        return this.deviations.filter(d => d.restaurantId === restaurantId && d.status === 'OPEN');
    }

    acknowledgeDeviation(id: string) {
        const dev = this.deviations.find(d => d.id === id);
        if (dev) {
            dev.status = 'ACKNOWLEDGED';
            dev.acknowledgedAt = new Date().toISOString();
        }
        return dev;
    }
}
