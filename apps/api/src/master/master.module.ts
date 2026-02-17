import { Module } from '@nestjs/common';
import { MasterController } from './master.controller';
import { MasterService } from './master.service';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
    imports: [LedgerModule],
    controllers: [MasterController],
    providers: [MasterService],
    exports: [MasterService]
})
export class MasterModule { }
