import {
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let authService: AuthService;

    const usersServiceMock = {
        findByEmail: jest.fn(),
        create: jest.fn(),
    };

    const jwtServiceMock = {
        signAsync: jest.fn(),
    };

    beforeEach(async () => {
        const moduleRef =
            await Test.createTestingModule({
                providers: [
                    AuthService,

                    {
                        provide: UsersService,
                        useValue: usersServiceMock,
                    },

                    {
                        provide: JwtService,
                        useValue: jwtServiceMock,
                    },
                ],
            }).compile();

        authService =
            moduleRef.get(AuthService);

        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            usersServiceMock.findByEmail
                .mockResolvedValue(null);

            usersServiceMock.create
                .mockResolvedValue({
                    id: 'user-id',
                    email: 'user@test.com',
                    firstName: 'Vika',
                    lastName: null,
                    createdAt: new Date(),
                });

            jwtServiceMock.signAsync
                .mockResolvedValue('jwt-token');

            const result =
                await authService.register({
                    email: 'USER@test.com',
                    password: 'Test12345!',
                    firstName: 'Vika',
                });

            expect(result.accessToken)
                .toBe('jwt-token');

            expect(result.user.email)
                .toBe('user@test.com');

            expect(
                usersServiceMock.create,
            ).toHaveBeenCalled();

            const createArgument =
                usersServiceMock.create.mock
                    .calls[0][0];

            expect(
                createArgument.passwordHash,
            ).not.toBe('Test12345!');
        });

        it('should reject duplicate email', async () => {
            usersServiceMock.findByEmail
                .mockResolvedValue({
                    id: 'existing-user',
                });

            await expect(
                authService.register({
                    email: 'user@test.com',
                    password: 'Test12345!',
                }),
            ).rejects.toBeInstanceOf(
                ConflictException,
            );
        });
    });

    describe('login', () => {
        it('should reject invalid password', async () => {
            const passwordHash = await hash(
                'CorrectPassword123!',
                12,
            );

            usersServiceMock.findByEmail
                .mockResolvedValue({
                    id: 'user-id',
                    email: 'user@test.com',
                    passwordHash,
                });

            await expect(
                authService.login({
                    email: 'user@test.com',
                    password: 'WrongPassword123!',
                }),
            ).rejects.toBeInstanceOf(
                UnauthorizedException,
            );
        });
    });
});