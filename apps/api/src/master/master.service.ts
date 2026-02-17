import { Injectable, NotFoundException } from '@nestjs/common';
import { EventService } from '../ledger/event.service';
import { CreateSuggestionDto, ResolveSuggestionDto, SuggestionStatus } from './master.dto';
import { v4 as uuidv4 } from 'uuid';

export interface Suggestion {
    id: string;
    restaurantId: string;
    targetItemId?: string;
    itemName: string;
    issueType: string;
    suggestedValue?: string;
    ean?: string;
    comment?: string;
    status: SuggestionStatus;
    createdAt: string;
    createdBy: string;
}

@Injectable()
export class MasterService {
    // In-memory cache for demo purposes. In real CQRS, this would be a Read Model (Projector).
    private suggestions: Suggestion[] = [];

    constructor(private readonly eventService: EventService) {
        // Hydrate from events on init? 
        // For prototype, we'll start empty or rely on the stream.
        // Let's implement a quick replay in a real app, but here we'll just push to array on 'submit'.
    }

    // Mock Master Item Cache (Read Model)
    private masterItems = [
        { id: 'item-1', name: 'Coffee Beans', unit: 'kg', category: 'Dry Goods', ean: '641000000001' },
        { id: 'item-2', name: 'Milk (Whole)', unit: 'L', category: 'Dairy', ean: '641000000002' },
        { id: 'item-3', name: 'Milk (Oat)', unit: 'L', category: 'Dairy', ean: '641000000003' },
        { id: 'item-4', name: 'Sugar', unit: 'kg', category: 'Dry Goods', ean: '641000000004' },
        { id: 'item-5', name: 'Paper Cups (Large)', unit: 'pcs', category: 'Supplies', ean: '641000000005' },
        { id: 'item-6', name: 'Paper Cups (Small)', unit: 'pcs', category: 'Supplies', ean: '641000000006' },
        { id: 'item-7', name: 'Napkins', unit: 'pcs', category: 'Supplies', ean: '641000000007' },
        { id: 'item-8', name: 'Trash Bags', unit: 'roll', category: 'Supplies', ean: '641000000008' },
        { id: 'item-9', name: 'Dish Soap', unit: 'L', category: 'Chemicals', ean: '641000000009' },
        { id: 'item-10', name: 'Espresso Roast', unit: 'kg', category: 'Dry Goods', ean: '641000000010' },
        { id: 'item-11', name: 'Croissant (Frozen)', unit: 'pcs', category: 'Frozen', ean: '641000000011' },
        { id: 'item-12', name: 'Orange Juice', unit: 'L', category: 'Beverage', ean: '641000000012' },
    ];

    searchItems(query: string) {
        if (!query) return this.masterItems;
        const q = query.toLowerCase();
        return this.masterItems.filter(item =>
            item.name.toLowerCase().includes(q) ||
            item.ean.includes(q)
        );
    }

    async submitSuggestion(dto: CreateSuggestionDto, userId: string) {
        const suggestionId = uuidv4();
        const timestamp = new Date().toISOString();

        // 1. Create Event
        const event = {
            stream_id: 'master-data-suggestions',
            type: 'ITEM_SUGGESTION_CREATED',
            payload: {
                suggestionId,
                ...dto,
                status: SuggestionStatus.NEW
            },
            meta: { timestamp, userId },
            occurred_at: new Date()
        };

        await this.eventService.append(event);

        // 2. Update local cache (Read Model)
        const newSuggestion: Suggestion = {
            id: suggestionId,
            restaurantId: dto.restaurantId,
            targetItemId: dto.targetItemId,
            itemName: dto.itemName,
            issueType: dto.issueType,
            suggestedValue: dto.suggestedValue,
            ean: dto.ean,
            comment: dto.comment,
            status: SuggestionStatus.NEW,
            createdAt: timestamp,
            createdBy: userId
        };
        this.suggestions.push(newSuggestion);

        return { suggestionId };
    }

    getPendingSuggestions() {
        return this.suggestions.filter(s => s.status === SuggestionStatus.NEW);
    }

    async resolveSuggestion(dto: ResolveSuggestionDto, adminId: string) {
        const suggestion = this.suggestions.find(s => s.id === dto.suggestionId);
        if (!suggestion) throw new NotFoundException('Suggestion not found');

        const event = {
            stream_id: 'master-data-suggestions',
            type: 'ITEM_SUGGESTION_RESOLVED',
            payload: {
                suggestionId: dto.suggestionId,
                action: dto.action,
                adminComment: dto.adminComment
            },
            meta: { timestamp: new Date().toISOString(), userId: adminId },
            occurred_at: new Date()
        };

        await this.eventService.append(event);

        // Update local cache
        suggestion.status = dto.action;

        // IF APPROVED -> Emit MASTER_ITEM_UPDATED event
        if (dto.action === SuggestionStatus.APPROVED) {
            await this.eventService.append({
                stream_id: 'master-data-items',
                type: 'MASTER_ITEM_UPDATED',
                payload: {
                    itemId: suggestion.targetItemId || uuidv4(), // Create new if missing
                    name: suggestion.itemName,
                    ean: suggestion.ean,
                    // Map other fields...
                    updatedFromSuggestionId: suggestion.id
                },
                meta: { timestamp: new Date().toISOString(), userId: adminId },
                occurred_at: new Date()
            });
        }

        return { success: true };
    }
}
