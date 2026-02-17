import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEntity } from './event.entity';
import { MasterItemEntity } from './master-item.entity';
import { EventService } from './event.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([EventEntity, MasterItemEntity]),
        EventEmitterModule.forRoot(),
    ],
    providers: [EventService],
    exports: [EventService],
})
export class LedgerModule { }
