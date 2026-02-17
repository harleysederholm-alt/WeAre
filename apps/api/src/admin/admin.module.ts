import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { RestaurantService } from './restaurant.service';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
    imports: [LedgerModule],
    controllers: [AdminController],
    providers: [RestaurantService],
    exports: [RestaurantService]
})
export class AdminModule { }
