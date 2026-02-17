import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('tip_balances')
@Unique(['restaurantId', 'employeeId'])
export class TipBalanceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    restaurantId: string;

    @Column()
    employeeId: string;

    @Column('int', { default: 0 })
    balanceCents: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastUpdated: Date;
}
