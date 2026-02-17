import { Injectable } from '@nestjs/common';
import { EventService } from '../ledger/event.service';
import { v4 as uuidv4 } from 'uuid';

export interface Restaurant {
    id: string;
    name: string;
    domain: string; // e.g. @panchovilla.fi
    active: boolean;
}

export interface UserRole {
    email: string;
    restaurantId: string;
    role: 'STAFF' | 'MANAGER' | 'ADMIN';
}

@Injectable()
export class RestaurantService {
    // In-memory state for prototype
    private restaurants: Restaurant[] = [
        { id: 'restaurant-1', name: 'Helsinki Central', domain: 'panchovilla.fi', active: true },
        { id: 'restaurant-2', name: 'Tampere Unit', domain: 'panchovilla.fi', active: true }
    ];

    private userRoles: UserRole[] = [
        { email: 'manager@test.com', restaurantId: 'restaurant-1', role: 'MANAGER' },
        { email: 'staff@test.com', restaurantId: 'restaurant-1', role: 'STAFF' },
        { email: 'admin@test.com', restaurantId: 'restaurant-1', role: 'ADMIN' },
        // Multi-unit manager
        { email: 'manager@test.com', restaurantId: 'restaurant-2', role: 'MANAGER' },
        { email: 'admin@test.com', restaurantId: 'restaurant-2', role: 'ADMIN' }
    ];

    constructor(private readonly eventService: EventService) { }

    async createRestaurant(name: string, domain: string, adminEmail: string) {
        const id = `restaurant-${uuidv4().slice(0, 8)}`;
        const restaurant: Restaurant = { id, name, domain, active: true };

        this.restaurants.push(restaurant);

        // Assign Admin (Creator)
        this.userRoles.push({ email: adminEmail, restaurantId: id, role: 'ADMIN' });

        await this.eventService.append({
            stream_id: `system-restaurants`,
            type: 'RESTAURANT_CREATED',
            payload: restaurant,
            meta: { user: adminEmail },
            occurred_at: new Date()
        });

        // Initialize Master Data streams or templates if needed
        return restaurant;
    }

    getRestaurants() {
        return this.restaurants;
    }

    getUserRoles(email: string) {
        return this.userRoles.filter(r => r.email === email);
    }

    async assignRole(email: string, restaurantId: string, role: 'STAFF' | 'MANAGER' | 'ADMIN', assignedBy: string) {
        // Remove existing role for this restaurant if any
        this.userRoles = this.userRoles.filter(r => !(r.email === email && r.restaurantId === restaurantId));

        this.userRoles.push({ email, restaurantId, role });

        await this.eventService.append({
            stream_id: `system-roles`,
            type: 'ROLE_ASSIGNED',
            payload: { email, restaurantId, role },
            meta: { user: assignedBy },
            occurred_at: new Date()
        });

        return { success: true };
    }

    getUserRestaurants(email: string) {
        // Return restaurants where user has a role
        const roleRecords = this.getUserRoles(email);
        const restaurantIds = new Set(roleRecords.map(r => r.restaurantId));
        return this.restaurants.filter(r => restaurantIds.has(r.id));
    }
}
