import request from 'supertest';
import { PrismaClient } from '@prisma/client';

import App from '@www';

const app = new App().getApp();
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: 1,
      name: 'User 1',
      email: 'email@email.com',
      role: 'ADMIN',
      password: '$2b$10$lGfiSp9m4jjUXSxpCeOMj.endmX89AMg/GsCCfPjCeObZGHeWJqI6'
    }
  });
});

const tokenTest = process.env.TOKEN_TESTING;

describe('GET /api/v1/users', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(200);
  });

  test('should respond with a 401 status code', async () => {
    const response = await request(app).get('/api/v1/users').send();
    expect(response.statusCode).toBe(401);
  });

  test('should respond with array', async () => {
    const response = await request(app).get('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        message: expect.any(String)
      })
    );
  });
});

describe('POST /api/v1/users', () => {
  test('should respond with a 201 status code', async () => {
    const response = await request(app).post('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send({
      id: 2,
      name: 'User 2',
      email: 'user2@email.com',
      password: '12345678',
      role: 'ADMIN'
    });
    expect(response.statusCode).toBe(201);
  });

  test('should respond with a 400 status code for zero data', async () => {
    const response = await request(app).post('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid name', async () => {
    const response = await request(app).post('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send({
      email: 'jhondoe',
      password: '12345678'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid email', async () => {
    const response = await request(app).post('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send({
      name: 'John Doe',
      email: 'jhondoe',
      password: '12345678'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code invalid password', async () => {
    const response = await request(app).post('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send({
      name: 'John Doe',
      email: 'jhondoe',
      password: '123'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid all data', async () => {
    const response = await request(app).post('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send({
      name: '',
      email: 'jhondoe',
      password: '123'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 409 status code for email already exists', async () => {
    const response = await request(app).post('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send({
      name: 'John Doe',
      email: 'user2@email.com',
      password: '12345678'
    });
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 401 status code', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'User 3',
      email: 'user3@email.com',
      password: '12345678',
      role: 'ADMIN'
    });
    expect(response.statusCode).toBe(401);
  });

  test('should respond with content-type application/json', async () => {
    const response = await request(app).post('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send({
      id: 3,
      name: 'User 3',
      email: 'user3@email.com',
      password: '12345678',
      role: 'ADMIN'
    });
    expect(response.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with object', async () => {
    const response = await request(app).post('/api/v1/users').auth(tokenTest, { type: 'bearer' }).send({
      id: 4,
      name: 'User 4',
      email: 'user4@email.com',
      password: '12345678',
      role: 'ADMIN'
    });
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Object),
        message: expect.any(String)
      })
    );
  });
});

describe('GET /api/v1/users/:id', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get('/api/v1/users/1').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(200);
  });

  test('should respond with a 409 status code for id not found', async () => {
    const response = await request(app).get('/api/v1/users/0').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 409 status code for invalid id', async () => {
    const response = await request(app).get('/api/v1/users/aaasd').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 401 status code', async () => {
    const response = await request(app).get('/api/v1/users/1').send();
    expect(response.statusCode).toBe(401);
  });

  test('should respond with content-type application/json', async () => {
    const response = await request(app).get('/api/v1/users/1').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with object', async () => {
    const response = await request(app).get('/api/v1/users/1').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Object),
        message: expect.any(String)
      })
    );
  });
});

describe('PUT /api/v1/users/:id', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).put('/api/v1/users/1').auth(tokenTest, { type: 'bearer' }).send({
      name: 'User 1 Updated',
      email: 'user1update@email.com'
    });
    expect(response.statusCode).toBe(200);
  });

  test('should respond with a 409 status code for id not found', async () => {
    const response = await request(app).put('/api/v1/users/0').auth(tokenTest, { type: 'bearer' }).send({
      name: 'User 1 Updated'
    });
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 409 status code for invalid id', async () => {
    const response = await request(app).put('/api/v1/users/aaasd').auth(tokenTest, { type: 'bearer' }).send({
      name: 'User 1 Updated'
    });
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 400 status code for zero data', async () => {
    const response = await request(app).put('/api/v1/users/1').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid name', async () => {
    const response = await request(app).put('/api/v1/users/1').auth(tokenTest, { type: 'bearer' }).send({
      name: '',
      email: 'jhondoe'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid email', async () => {
    const response = await request(app).put('/api/v1/users/1').auth(tokenTest, { type: 'bearer' }).send({
      name: 'John Doe',
      email: 'jhondoe'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 401 status code', async () => {
    const response = await request(app).put('/api/v1/users/1').send({
      name: 'User 1 Updated',
      email: 'jhondoe'
    });
    expect(response.statusCode).toBe(401);
  });

  test('should respond with content-type application/json', async () => {
    const response = await request(app).put('/api/v1/users/1').auth(tokenTest, { type: 'bearer' }).send({
      name: 'John Doe'
    });
    expect(response.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with object', async () => {
    const response = await request(app).put('/api/v1/users/1').auth(tokenTest, { type: 'bearer' }).send({
      email: 'jhondoe@gmail.com'
    });
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Object),
        message: expect.any(String)
      })
    );
  });
});

describe('DELETE /api/v1/users/:id', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).delete('/api/v1/users/2').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(200);
  });

  test('should respond with a 409 status code for id not found', async () => {
    const response = await request(app).delete('/api/v1/users/0').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 409 status code for invalid id', async () => {
    const response = await request(app).delete('/api/v1/users/aaasd').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 401 status code', async () => {
    const response = await request(app).delete('/api/v1/users/1').send();
    expect(response.statusCode).toBe(401);
  });

  test('should respond with content-type application/json', async () => {
    const response = await request(app).delete('/api/v1/users/3').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with object', async () => {
    const response = await request(app).delete('/api/v1/users/1').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Object),
        message: expect.any(String)
      })
    );
  });
});
