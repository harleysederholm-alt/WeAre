import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { EmailIngestionService } from './email-ingestion.service';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
    imports: [LedgerModule],
    controllers: [PurchaseController],
    providers: [PurchaseService, EmailIngestionService],
    exports: [PurchaseService]
})
export class PurchaseModule { }
