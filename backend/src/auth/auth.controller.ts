import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import * as authTypes from './auth.types';
import {CurrentUser} from './decorators/current-user.decorator';
import {LoginDto} from './dto/login.dto';
import {RegisterDto} from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {
    }

    @Post('register')
    @ApiOperation({
        summary: 'Register a new user',
    })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Login',
    })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get('me')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get current user',
    })
    async me(
        @CurrentUser() currentUser: authTypes.JwtPayload,
    ) {
        const user = await this.usersService.findById(
            currentUser.sub,
        );

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}