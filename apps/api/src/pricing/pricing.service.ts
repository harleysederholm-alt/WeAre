import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan, IsNull } from 'typeorm';
import { PriceHistoryEntity } from './price-history.entity';

@Injectable()
export class PricingService {
    constructor(
        @InjectRepository(PriceHistoryEntity)
        private readonly priceRepo: Repository<PriceHistoryEntity>,
    ) { }

    /**
     * Finds the active price for an item at a specific point in time.
     * Rule: valid_from <= date < valid_to (or valid_to is null)
     */
    async getPriceAtDate(itemId: string, date: Date): Promise<number> {
        const price = await this.priceRepo.findOne({
            where: [
                {
                    item_id: itemId,
                    valid_from: LessThanOrEqual(date),
                    valid_to: MoreThan(date),
                },
                {
                    item_id: itemId,
                    valid_from: LessThanOrEqual(date),
                    valid_to: IsNull(),
                },
            ],
            order: { valid_from: 'DESC' }, // If multiple overlap (shouldn't happen), take latest start
        });

        if (!price) {
            throw new NotFoundException(`No price found for item ${itemId} at ${date.toISOString()}`);
        }

        return price.price_cents;
    }
}
