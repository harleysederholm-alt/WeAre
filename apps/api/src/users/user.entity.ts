import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryColumn()
    email: string;

    @Column('jsonb')
    roles: Record<string, string>; // e.g., { "restaurant_1": "MANAGER" }
}
