import request from 'supertest';
import { PrismaClient } from '@prisma/client';

import App from '@www';

const app = new App().getApp();
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.user.deleteMany();
});

describe('POST /api/v1/auth/signup', () => {
  test('should respond with a 201 status code', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'jhondoe@email.com',
      password: '12345678'
    });
    expect(response.statusCode).toBe(201);
  });

  test('should respond with a 400 status code for zero data', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send();
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid name', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      email: 'jhondoe',
      password: '12345678'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid email', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'jhondoe',
      password: '12345678'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code invalid password', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'jhondoe@email.com',
      password: '123'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid all data', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: '',
      email: 'jhondoe',
      password: '123'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 409 status code for email already exists', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'jhondoe@email.com',
      password: '12345678'
    });
    expect(response.statusCode).toBe(409);
  });

  test('should respond with content-type application/json', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'jhondoee@email.com',
      password: '12345678'
    });
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });
});

describe('POST /api/v1/auth/signin', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: 'jhondoe@email.com',
      password: '12345678'
    });
    expect(response.statusCode).toBe(200);
  });

  test('should respond with a 400 status code for zero data', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send();
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid email', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: 'jhondoe',
      password: '12345678'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code invalid password', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: 'jhondoe@email.com',
      password: '123'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid all data', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: '',
      password: '123'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 409 status code for invalid credentials', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: 'jhondoe@gmail.com',
      password: '12345678'
    });
    expect(response.statusCode).toBe(409);
  });

  test('should respond with content-type application/json', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: 'jhondoe@email.com',
      password: '12345678'
    });
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with a accessToken data object', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: 'jhondoe@email.com',
      password: '12345678'
    });
    expect(response.body).toHaveProperty('data.accessToken');
  });

  test('should respond with a accesstoken data', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: 'jhondoe@email.com',
      password: '12345678'
    });
    expect(response.body).toHaveProperty('data.accessToken');
  });

  test('should respond with an object', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: 'jhondoe@email.com',
      password: '12345678'
    });
    expect(response.body).toEqual(
      expect.objectContaining({
        data: {
          user: {
            email: expect.any(String),
            role: expect.any(String)
          },
          accessToken: {
            expiresIn: expect.any(Number),
            token: expect.any(String)
          }
        },
        message: expect.any(String)
      })
    );
  });
});
