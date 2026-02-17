import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceHistoryEntity } from './price-history.entity';
import { PricingService } from './pricing.service';

@Module({
    imports: [TypeOrmModule.forFeature([PriceHistoryEntity])],
    providers: [PricingService],
    exports: [PricingService],
})
export class PricingModule { }
