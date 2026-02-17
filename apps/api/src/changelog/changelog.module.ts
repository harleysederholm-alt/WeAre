import { Module } from '@nestjs/common';
import { ChangelogController } from './changelog.controller';
import { VersioningService } from './versioning.service';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
    imports: [LedgerModule],
    controllers: [ChangelogController],
    providers: [VersioningService],
    exports: [VersioningService]
})
export class ChangelogModule { }
