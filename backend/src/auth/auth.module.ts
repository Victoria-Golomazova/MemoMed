import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    JwtModule,
    JwtModuleOptions,
} from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
    imports: [
        UsersModule,

        JwtModule.registerAsync({
            inject: [ConfigService],

            useFactory: (
                configService: ConfigService,
            ): JwtModuleOptions => ({
                secret:
                    configService.getOrThrow<string>(
                        'JWT_SECRET',
                    ),

                signOptions: {
                    expiresIn:
                        configService.getOrThrow(
                            'JWT_EXPIRES_IN',
                        ),
                },
            }),
        }),
    ],

    controllers: [AuthController],

    providers: [
        AuthService,
        AuthGuard,
    ],
})
export class AuthModule {}