import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'StrongPassword123!',
        minLength: 8,
    })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;

    @ApiPropertyOptional({
        example: 'Виктория',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    firstName?: string;

    @ApiPropertyOptional({
        example: 'Голомазова',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string;
}