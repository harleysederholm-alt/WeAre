import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import type { Request } from 'express';

@Controller('admin')
export class AdminController {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Get('restaurants')
    getRestaurants() {
        return this.restaurantService.getRestaurants();
    }

    @Post('restaurants')
    async createRestaurant(@Body() body: { name: string; domain: string }, @Req() req: Request) {
        const userEmail = (req.headers['x-user-email'] as string) || 'admin@test.com'; // Mock email for prototype
        return this.restaurantService.createRestaurant(body.name, body.domain, userEmail);
    }

    @Post('roles')
    async assignRole(@Body() body: { email: string; restaurantId: string; role: any }, @Req() req: Request) {
        const adminEmail = (req.headers['x-user-email'] as string) || 'admin@test.com';
        return this.restaurantService.assignRole(body.email, body.restaurantId, body.role, adminEmail);
    }

    @Get('my-restaurants')
    getMyRestaurants(@Req() req: Request, @Query('email') queryEmail?: string) {
        // In real app, get email from JWT. Here, accept query or header.
        const email = queryEmail || (req.headers['x-user-email'] as string) || 'manager@test.com';
        return this.restaurantService.getUserRestaurants(email);
    }
}
