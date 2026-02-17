export class PlannedShiftDto {
    employeeName: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    role?: string;
}

export class ImportRosterDto {
    restaurantId: string;
    shifts: PlannedShiftDto[];
}

export class AnaylzeDeviationDto {
    restaurantId: string;
    date: string;
}
