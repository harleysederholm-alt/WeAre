import { Module } from '@nestjs/common';
import { DailyController } from './daily.controller';
import { PdfService } from './pdf.service';
import { DailyService } from './daily.service';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
    imports: [LedgerModule],
    controllers: [DailyController],
    providers: [DailyService, PdfService],
})
export class DailyModule { }
