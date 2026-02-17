import { Injectable } from '@nestjs/common';
import { SalesDataService } from './sales-data.service';
import { RecipeService } from './recipe.service';
import { InventoryService } from '../inventory/inventory.service';

export interface OrderSuggestion {
    masterItemName: string;
    currentStock: number;
    projectedDemand: number;
    buffer: number;
    suggestedQuantity: number;
    unit: string;
    reason: string;
}

@Injectable()
export class ForecastingService {
    constructor(
        private readonly salesService: SalesDataService,
        private readonly recipeService: RecipeService,
        private readonly inventoryService: InventoryService
    ) { }

    async generateSuggestions(restaurantId: string): Promise<OrderSuggestion[]> {
        // 1. Get Sales (Last 7 Days)
        const sales = this.salesService.getAggregatedSales(restaurantId, 7);

        // 2. Calculate Ingredient Demand
        const ingredientDemand: Record<string, { qty: number, unit: string }> = {};

        for (const [product, qtySold] of Object.entries(sales)) {
            const ingredients = this.recipeService.getIngredientsForProduct(product);
            for (const ing of ingredients) {
                if (!ingredientDemand[ing.masterItemName]) {
                    ingredientDemand[ing.masterItemName] = { qty: 0, unit: ing.unit };
                }
                ingredientDemand[ing.masterItemName].qty += (ing.quantity * qtySold);
            }
        }

        const suggestions: OrderSuggestion[] = [];
        const BUFFER_PERCENT = 0.10; // 10% safety stock

        // 3. Compare with Stock
        for (const [itemName, demand] of Object.entries(ingredientDemand)) {
            const currentStock = this.inventoryService.getTheoreticalStock(itemName);

            const bufferedDemand = demand.qty * (1 + BUFFER_PERCENT);
            const netRequired = bufferedDemand - currentStock;

            if (netRequired > 0) {
                suggestions.push({
                    masterItemName: itemName,
                    currentStock,
                    projectedDemand: demand.qty,
                    buffer: demand.qty * BUFFER_PERCENT,
                    suggestedQuantity: Math.ceil(netRequired * 10) / 10, // Round up to 1 decimal
                    unit: demand.unit,
                    reason: `Based on 7-day sales. Demand: ${demand.qty.toFixed(1)} + 10% Buffer`
                });
            }
        }

        return suggestions;
    }
}
