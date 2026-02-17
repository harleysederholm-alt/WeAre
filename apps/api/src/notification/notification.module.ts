import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
    imports: [LedgerModule],
    providers: [NotificationService],
    exports: [NotificationService]
})
export class NotificationModule { }
