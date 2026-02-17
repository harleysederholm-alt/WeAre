import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('price_history')
export class PriceHistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column()
    item_id: string;

    @Column('int')
    price_cents: number;

    @Column('timestamp')
    valid_from: Date;

    @Column('timestamp', { nullable: true })
    valid_to: Date;
}
