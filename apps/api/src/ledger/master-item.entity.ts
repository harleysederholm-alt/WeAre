import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('master_items')
export class MasterItemEntity {
    @PrimaryColumn()
    id: string; // Assuming manual ID or UUID

    @Column()
    name: string;

    @Column()
    category: string;
}
