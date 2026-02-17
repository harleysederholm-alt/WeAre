import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './audit.entity';
import { AuditProjector } from './audit.projector';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AuditLogEntity]),
        LedgerModule,
    ],
    providers: [AuditProjector, AuditService],
    controllers: [AuditController],
    exports: [AuditService],
})
export class AuditModule { }
