import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const email = dto.email.trim().toLowerCase();

        const existingUser = await this.usersService.findByEmail(email);

        if (existingUser) {
            throw new ConflictException(
                'User with this email already exists',
            );
        }

        const passwordHash = await hash(dto.password, 12);

        const user = await this.usersService.create({
            email,
            passwordHash,
            firstName: dto.firstName?.trim(),
            lastName: dto.lastName?.trim(),
        });

        const accessToken = await this.createAccessToken({
            sub: user.id,
            email: user.email,
        });

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
            },
        };
    }

    async login(dto: LoginDto) {
        const email = dto.email.trim().toLowerCase();

        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        const passwordMatches = await compare(
            dto.password,
            user.passwordHash,
        );

        if (!passwordMatches) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        const accessToken = await this.createAccessToken({
            sub: user.id,
            email: user.email,
        });

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
            },
        };
    }

    private createAccessToken(payload: JwtPayload) {
        return this.jwtService.signAsync(payload);
    }
}