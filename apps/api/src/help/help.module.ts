import { Module } from '@nestjs/common';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
    imports: [LedgerModule],
    controllers: [HelpController],
    providers: [HelpService],
    exports: [HelpService]
})
export class HelpModule { }
