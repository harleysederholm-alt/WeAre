import { Injectable } from '@nestjs/common';
import { EventService } from '../ledger/event.service';
import { CreateHelpArticleDto, SearchHelpDto, HelpLayer } from './help.dto';
import { v4 as uuidv4 } from 'uuid';

export interface HelpArticle {
    id: string;
    contextKey: string;
    layer: HelpLayer;
    restaurantId?: string;
    title_fi: string;
    body_fi: string;
    steps_fi: string[];
    title_en: string;
    body_en: string;
    steps_en: string[];
    tags: string[];
    updatedAt: string;
    updatedBy: string;
}

@Injectable()
export class HelpService {
    // In-memory cache for fast lookups (Simulating a Read Model)
    private articles: HelpArticle[] = [];

    constructor(private readonly eventService: EventService) {
        this.seedDefaultHelp();
    }

    private seedDefaultHelp() {
        // Add some default GLOBAL help
        this.articles.push({
            id: 'global-1',
            contextKey: 'daily_sales',
            layer: HelpLayer.GLOBAL,
            title_fi: 'Myynnin syöttäminen',
            title_en: 'Entering Sales',
            body_fi: 'Syötä päivän kokonaismyynti kassajärjestelmän Z-raportista.',
            body_en: 'Enter the total sales from the POS Z-report.',
            steps_fi: ['Ota Z-raportti', 'Etsi rivi "Kokonaismyynti"', 'Syötä summa Sales-kenttään'],
            steps_en: ['Print Z-report', 'Find "Total Sales"', 'Enter amount in Sales field'],
            updatedAt: new Date().toISOString(),
            updatedBy: 'system',
            tags: ['sales', 'daily']
        } as any);
        this.articles.push({
            id: 'global-2',
            contextKey: 'waste_grid',
            layer: HelpLayer.GLOBAL,
            title_fi: 'Hävikin kirjaus',
            title_en: 'Logging Waste',
            body_fi: 'Kirjaa kaikki hävikki (pilaantunut, pudonnut, vanhentunut).',
            body_en: 'Log all waste (spoiled, dropped, expired).',
            steps_fi: ['Valitse tuote', 'Syötä määrä', 'Valitse syy'],
            steps_en: ['Select Item', 'Enter Qty', 'Select Reason'],
            updatedAt: new Date().toISOString(),
            updatedBy: 'system',
            tags: ['waste']
        } as any);
    }

    async createHelp(dto: CreateHelpArticleDto, userId: string): Promise<HelpArticle> {
        const id = uuidv4();
        const timestamp = new Date().toISOString();

        const event = {
            stream_id: 'help-articles',
            type: 'HELP_ARTICLE_CREATED',
            payload: { id, ...dto },
            meta: { timestamp, userId },
            occurred_at: new Date()
        };

        await this.eventService.append(event);

        const article: HelpArticle = {
            id,
            ...dto,
            steps_fi: dto.steps_fi || [],
            steps_en: dto.steps_en || [],
            tags: dto.tags || [],
            updatedAt: timestamp,
            updatedBy: userId
        };

        this.articles.push(article);
        return article;
    }

    getHelp(dto: SearchHelpDto): HelpArticle[] {
        let results = this.articles;

        // 1. Filter by Context (if provided)
        if (dto.context) {
            results = results.filter(a => a.contextKey === dto.context);
        }

        // 2. Filter by Text Query
        if (dto.query) {
            const q = dto.query.toLowerCase();
            results = results.filter(a =>
                a.title_fi.toLowerCase().includes(q) ||
                a.title_en.toLowerCase().includes(q) ||
                a.body_fi.toLowerCase().includes(q) ||
                a.tags.some(t => t.includes(q))
            );
        }

        // 3. Layer Resolution (Global + Unit Specific)
        // If restaurantId is provided, include UNIT layers for that restaurant + GLOBAL.
        // If not provided, only GLOBAL.
        if (dto.restaurantId) {
            results = results.filter(a =>
                a.layer === HelpLayer.GLOBAL ||
                (a.layer === HelpLayer.UNIT && a.restaurantId === dto.restaurantId)
            );
        } else {
            results = results.filter(a => a.layer === HelpLayer.GLOBAL);
        }

        return results;
    }
}
