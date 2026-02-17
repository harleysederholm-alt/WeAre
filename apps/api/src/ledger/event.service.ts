import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(EventEntity)
        private readonly eventRepo: Repository<EventEntity>,
        private eventEmitter: EventEmitter2,
    ) { }

    async append(eventData: Partial<EventEntity>): Promise<EventEntity> {
        // Ensure we are not overwriting.
        if (eventData.id) {
            const existing = await this.eventRepo.findOneBy({ id: eventData.id });
            if (existing) {
                throw new ConflictException(`Event with ID ${eventData.id} already exists. Cannot overwrite.`);
            }
        }

        const event = this.eventRepo.create(eventData);
        const savedEvent = await this.eventRepo.save(event);

        // Emit event for Projectors (Async)
        this.eventEmitter.emit('event.appended', savedEvent);

        return savedEvent;
    }

    async getStream(streamId: string): Promise<EventEntity[]> {
        return this.eventRepo.find({
            where: { stream_id: streamId },
            order: { occurred_at: 'ASC' },
        });
    }

    subscribe(pattern: string, handler: (event: any) => void) {
        this.eventEmitter.on('event.appended', (event: EventEntity) => {
            if (event.type === pattern) {
                handler(event);
            }
        });
    }
}
