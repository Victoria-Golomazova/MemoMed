import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'StrongPassword123!',
    })
    @IsString()
    @MaxLength(128)
    password: string;
}