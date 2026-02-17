import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity('events')
export class EventEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column()
    stream_id: string;

    @Column()
    type: string;

    @Column('jsonb')
    payload: any;

    @Column('jsonb', { nullable: true })
    meta: any;

    @CreateDateColumn({ name: 'occurred_at' })
    occurred_at: Date;
}
