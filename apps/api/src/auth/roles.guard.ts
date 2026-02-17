import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        // In a real app, this comes from request.user (set by JWT strategy).
        // For MOCK auth, we look for a header 'x-user-role'.
        const userRole = request.headers['x-user-role'];

        if (!userRole || !requiredRoles.includes(userRole)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
