import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';
import { LedgerModule } from '../ledger/ledger.module';
import { TipBalanceEntity } from './tip-balance.entity';

@Module({
    imports: [
        LedgerModule,
        TypeOrmModule.forFeature([TipBalanceEntity])
    ],
    controllers: [TipsController],
    providers: [TipsService],
    exports: [TipsService],
})
export class TipsModule { }
