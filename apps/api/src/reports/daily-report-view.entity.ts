import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('daily_report_view')
export class DailyReportView {
    @PrimaryColumn()
    id: string; // Format: restaurant-YYYY-MM-DD

    @Column()
    restaurantId: string;

    @Column()
    date: string;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    total_sales: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    total_cash: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    total_tips: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    total_waste_cost: number;

    @Column({ default: 0 })
    waste_count: number;
}
