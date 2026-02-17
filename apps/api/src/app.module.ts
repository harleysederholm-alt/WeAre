import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LedgerModule } from './ledger/ledger.module';
import { DailyModule } from './daily/daily.module';
import { PricingModule } from './pricing/pricing.module';
import { WasteModule } from './waste/waste.module';
import { ReportsModule } from './reports/reports.module';
import { InventoryModule } from './inventory/inventory.module';
import { TipsModule } from './tips/tips.module';
import { AuditModule } from './audit/audit.module';
import { OrderModule } from './order/order.module';
import { ChangelogModule } from './changelog/changelog.module';
import { TransferModule } from './transfer/transfer.module';
import { RosterModule } from './roster/roster.module';
import { AdminModule } from './admin/admin.module';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'weare',
      autoLoadEntities: true,
      synchronize: true, // Dev only
    }),
    EventEmitterModule.forRoot(),
    LedgerModule,
    DailyModule,
    PricingModule,
    WasteModule,
    ReportsModule,
    InventoryModule,
    TipsModule,
    AuditModule,
    OrderModule,
    ChangelogModule,
    TransferModule,
    RosterModule,
    AdminModule,
    PurchaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
