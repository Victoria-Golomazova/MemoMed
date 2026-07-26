import {
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture =
            await Test.createTestingModule({
                imports: [AppModule],
            }).compile();

        app =
            moduleFixture.createNestApplication();

        app.setGlobalPrefix('api');

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
            }),
        );

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/health', () => {
        it('should return API status', () => {
            return request(
                app.getHttpServer(),
            )
                .get('/api/health')
                .expect(200)
                .expect((response) => {
                    expect(
                        response.body.status,
                    ).toBe('ok');

                    expect(
                        response.body.service,
                    ).toBe('memomed-api');
                });
        });
    });
});