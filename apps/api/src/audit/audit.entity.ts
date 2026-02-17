import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    restaurantId: string;

    @CreateDateColumn()
    @Index()
    timestamp: Date;

    @Column()
    actor: string; // The user/role who performed the action

    @Column()
    action: string; // E.g., 'TIPS_DISTRIBUTED', 'DAILY_REPORT_SUBMITTED'

    @Column('simple-json', { nullable: true })
    details: any; // Context specific to the action
}
