import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { LedgerModule } from '../ledger/ledger.module';
import { SalesDataService } from './sales-data.service';
import { RecipeService } from './recipe.service';
import { ForecastingService } from './forecasting.service';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [LedgerModule, InventoryModule],
    controllers: [OrderController],
    providers: [OrderService, SalesDataService, RecipeService, ForecastingService],
})
export class OrderModule { }
