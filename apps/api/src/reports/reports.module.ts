import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectorService } from './projector.service';
import { ReportsController } from './reports.controller';
import { DailyReportView } from './daily-report-view.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DailyReportView]),
    ],
    controllers: [ReportsController],
    providers: [ProjectorService],
})
export class ReportsModule { }
