import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from './audit.entity';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLogEntity)
        private readonly auditRepo: Repository<AuditLogEntity>,
    ) { }

    async getLogs(restaurantId: string, limit: number = 50) {
        return this.auditRepo.find({
            where: { restaurantId },
            order: { timestamp: 'DESC' },
            take: limit,
        });
    }
}
