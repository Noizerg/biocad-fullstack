import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../app.module';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../../.env' });

describe('Auth flow (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let accessToken: string;
  let refreshToken: string;
  let uniqueEmail: string;
  beforeAll(async () => {
    uniqueEmail = `authtest+${Date.now()}@ex.com`;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    server = app.getHttpServer();
  });

  it('/auth/register (POST)', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({ email: uniqueEmail, password: '123456' })
      .expect(201);

    expect(res.body).toHaveProperty('email', uniqueEmail);
    expect(res.body).toHaveProperty('id');
  });

  it('/auth/login (POST)', async () => {
    const res = await request(server)
      .post('/auth/login')
      .send({ email: uniqueEmail, password: '123456' })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('/auth/refresh (POST)', async () => {
    const res = await request(server)
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
  });

  it('/users (GET, protected)', async () => {
    const res = await request(server)
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('email');
  });

  it('/users/me (GET, protected)', async () => {
    const res = await request(server)
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('email', uniqueEmail);
  });

  afterAll(async () => {
    await app.close();
  });
});
