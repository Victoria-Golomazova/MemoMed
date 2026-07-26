import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JwtPayload } from './auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<Request & { user?: JwtPayload }>();

        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            request.user =
                await this.jwtService.verifyAsync<JwtPayload>(token);

            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }

    private extractToken(request: Request): string | undefined {
        const authorization = request.headers.authorization;

        if (!authorization) {
            return undefined;
        }

        const [type, token] = authorization.split(' ');

        return type === 'Bearer' ? token : undefined;
    }
}