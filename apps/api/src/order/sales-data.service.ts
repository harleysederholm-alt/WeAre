import { Injectable } from '@nestjs/common';

export interface DailySales {
    date: string;
    items: Record<string, number>; // ItemName -> Qty Sold
}

@Injectable()
export class SalesDataService {
    // Mock Data: Last 7 days
    getSalesHistory(restaurantId: string, days: number = 7): DailySales[] {
        const history: DailySales[] = [];
        const today = new Date();

        for (let i = 1; i <= days; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            // Mock random sales
            history.push({
                date: date.toISOString().split('T')[0],
                items: {
                    'Coffee (Large)': 50,
                    'Latte': 30,
                    'Cappuccino': 20,
                    'Bun': 15
                }
            });
        }
        return history;
    }

    getAggregatedSales(restaurantId: string, days: number = 7): Record<string, number> {
        const history = this.getSalesHistory(restaurantId, days);
        const aggregated: Record<string, number> = {};

        for (const day of history) {
            for (const [item, qty] of Object.entries(day.items)) {
                aggregated[item] = (aggregated[item] || 0) + qty;
            }
        }
        return aggregated;
    }
}
