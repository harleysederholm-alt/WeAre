import { Injectable } from '@nestjs/common';

export interface IngredientRequirement {
    masterItemName: string; // Linking by name for prototype. In real app: masterItemId
    quantity: number;
    unit: string;
}

@Injectable()
export class RecipeService {
    // Mock Recipes: Product -> Ingredients
    private recipes: Record<string, IngredientRequirement[]> = {
        'Coffee (Large)': [
            { masterItemName: 'Coffee Beans', quantity: 0.02, unit: 'kg' }, // 20g beans
            { masterItemName: 'Paper Cups (Large)', quantity: 1, unit: 'pcs' },
            { masterItemName: 'Sugar', quantity: 0.005, unit: 'kg' } // Avg 5g sugar
        ],
        'Latte': [
            { masterItemName: 'Coffee Beans', quantity: 0.02, unit: 'kg' },
            { masterItemName: 'Milk (Whole)', quantity: 0.2, unit: 'L' },
            { masterItemName: 'Paper Cups (Large)', quantity: 1, unit: 'pcs' }
        ],
        'Cappuccino': [
            { masterItemName: 'Coffee Beans', quantity: 0.02, unit: 'kg' },
            { masterItemName: 'Milk (Oat)', quantity: 0.15, unit: 'L' }, // Assuming Oat for variety test
            { masterItemName: 'Paper Cups (Small)', quantity: 1, unit: 'pcs' }
        ],
        'Bun': [
            { masterItemName: 'Napkins', quantity: 1, unit: 'pcs' }
            // Buns might be frozen items themselves, buy "frozen bun" -> sell "heated bun"
            // For now, let's say selling a Bun consumes 1 "Frozen Bun" (hypothetically)
        ]
    };

    getIngredientsForProduct(productName: string): IngredientRequirement[] {
        return this.recipes[productName] || [];
    }
}
