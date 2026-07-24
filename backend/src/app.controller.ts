import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class AppController {
    @Get()
    @ApiOperation({ summary: 'Check API availability' })
    check() {
        return {
            status: 'ok',
            service: 'memomed-api',
            timestamp: new Date().toISOString(),
        };
    }
}