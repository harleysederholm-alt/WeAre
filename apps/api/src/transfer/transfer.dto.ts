export class InitiateTransferDto {
    receiverId: string;
    itemId: string;
    quantity: number;
    reason?: string;
}

export class ResolveTransferDto {
    transferId: string;
    action: 'ACCEPT' | 'REJECT';
    quantity?: number; // For adjustments
    reason?: string;
}
