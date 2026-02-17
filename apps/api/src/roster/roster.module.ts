import { Module } from '@nestjs/common';
import { RosterController } from './roster.controller';
import { RosterService } from './roster.service';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
    imports: [LedgerModule],
    controllers: [RosterController],
    providers: [RosterService],
    exports: [RosterService]
})
export class RosterModule { }
