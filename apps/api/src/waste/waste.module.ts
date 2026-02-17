import { Module } from '@nestjs/common';
import { WasteController } from './waste.controller';
import { WasteService } from './waste.service';
import { LedgerModule } from '../ledger/ledger.module';
import { PricingModule } from '../pricing/pricing.module';

@Module({
    imports: [LedgerModule, PricingModule],
    controllers: [WasteController],
    providers: [WasteService],
})
export class WasteModule { }
