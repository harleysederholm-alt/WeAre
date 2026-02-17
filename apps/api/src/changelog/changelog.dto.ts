export class ChangeDto {
    domain: string;
    changeType: 'ADD' | 'UPDATE' | 'FIX' | 'BREAKING';
    description: string;
    scope: 'GLOBAL' | 'FRANCHISE' | 'RESTAURANT';
    severity: 'INFO' | 'IMPORTANT' | 'CRITICAL';
    affectedSystem: 'INVENTORY' | 'PRICES' | 'TIPS' | 'REPORTS' | 'SYSTEM';
    requiresAck: boolean;
}

export class AckDto {
    version: string;
}
