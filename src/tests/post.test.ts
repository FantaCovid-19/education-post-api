import request from 'supertest';

import App from '../bin';
import { db } from '../utils/db.util';

const app = new App().getApp();

beforeAll(async () => {
  await db.post.deleteMany();
  await db.user.deleteMany();

  await db.user.create({
    data: {
      id: 1,
      name: 'User 1',
      email: 'email@email.com',
      role: 'USER',
      password: '$2b$10$lGfiSp9m4jjUXSxpCeOMj.endmX89AMg/GsCCfPjCeObZGHeWJqI6'
    }
  });
});

const tokenTest = process.env.TOKEN_TESTING as string;

describe('GET /api/v1/posts', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get('/api/v1/posts').send();
    expect(response.statusCode).toBe(200);
  });

  test('should respond with an array', async () => {
    const response = await request(app).get('/api/v1/posts').send();
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        message: expect.any(String)
      })
    );
  });
});

describe('POST /api/v1/posts', () => {
  test('should respond with a 201 status code', async () => {
    const response = await request(app).post('/api/v1/posts').auth(tokenTest, { type: 'bearer' }).send({
      id: 1,
      title: 'Post 1',
      content: 'Content 1',
      authorId: 1
    });

    expect(response.statusCode).toBe(201);
  });

  test('should respond with a 400 status code for zero data', async () => {
    const response = await request(app).post('/api/v1/posts').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid title', async () => {
    const response = await request(app).post('/api/v1/posts').auth(tokenTest, { type: 'bearer' }).send({
      content: 'Content 1',
      authorId: 1
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid content', async () => {
    const response = await request(app).post('/api/v1/posts').auth(tokenTest, { type: 'bearer' }).send({
      title: 'Post 1',
      authorId: 1
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid authorId', async () => {
    const response = await request(app).post('/api/v1/posts').auth(tokenTest, { type: 'bearer' }).send({
      title: 'Post 1',
      content: 'Content 1'
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid all data', async () => {
    const response = await request(app).post('/api/v1/posts').auth(tokenTest, { type: 'bearer' }).send({
      title: '',
      content: '',
      authorId: 1
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 401 status code for invalid token', async () => {
    const response = await request(app).post('/api/v1/posts').auth('token', { type: 'bearer' }).send({
      title: 'Post 1',
      content: 'Content 1',
      authorId: 1
    });
    expect(response.statusCode).toBe(401);
  });

  test('should respond with a 409 status code for authorId not found', async () => {
    const response = await request(app).post('/api/v1/posts').auth(tokenTest, { type: 'bearer' }).send({
      title: 'Post 1',
      content: 'Content 1',
      authorId: 2
    });
    expect(response.statusCode).toBe(409);
  });

  test('should respond with content-type application/json', async () => {
    const response = await request(app).post('/api/v1/posts').auth(tokenTest, { type: 'bearer' }).send({
      id: 2,
      title: 'Post 1',
      content: 'Content 1',
      authorId: 1
    });
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with an object', async () => {
    const response = await request(app).post('/api/v1/posts').auth(tokenTest, { type: 'bearer' }).send({
      id: 3,
      title: 'Post 1',
      content: 'Content 1',
      authorId: 1
    });
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Object),
        message: expect.any(String)
      })
    );
  });
});

describe('GET /api/v1/posts/:id', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get('/api/v1/posts/1').send();
    expect(response.statusCode).toBe(200);
  });

  test('should respond with a 409 status code for id not found', async () => {
    const response = await request(app).get('/api/v1/posts/0').send();
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 400 status code for invalid id', async () => {
    const response = await request(app).get('/api/v1/posts/abc').send();
    expect(response.statusCode).toBe(400);
  });

  test('should respond with content-type application/json', async () => {
    const response = await request(app).get('/api/v1/posts/1').send();
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with an object', async () => {
    const response = await request(app).get('/api/v1/posts/1').send();
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Object),
        message: expect.any(String)
      })
    );
  });
});

describe('PUT /api/v1/posts/:id', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).put('/api/v1/posts/1').auth(tokenTest, { type: 'bearer' }).send({
      title: 'Post Update',
      content: 'Content Update',
      authorId: 1
    });
    expect(response.statusCode).toBe(200);
  });

  test('should respond with a 400 status code for zero data', async () => {
    const response = await request(app).put('/api/v1/posts/1').auth(tokenTest, { type: 'bearer' }).send({});
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid title', async () => {
    const response = await request(app).put('/api/v1/posts/1').auth(tokenTest, { type: 'bearer' }).send({
      title: ''
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 400 status code for invalid content', async () => {
    const response = await request(app).put('/api/v1/posts/1').auth(tokenTest, { type: 'bearer' }).send({
      content: ''
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 409 status code for invalid authorId', async () => {
    const response = await request(app).put('/api/v1/posts/1').auth(tokenTest, { type: 'bearer' }).send({
      authorId: 2
    });
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 400 status code for invalid all data', async () => {
    const response = await request(app).put('/api/v1/posts/1').auth(tokenTest, { type: 'bearer' }).send({
      title: '',
      content: '',
      authorId: 2
    });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with a 401 status code for invalid token', async () => {
    const response = await request(app).put('/api/v1/posts/1').auth('token', { type: 'bearer' }).send({
      title: 'Post Update',
      content: 'Content Update',
      authorId: 1
    });
    expect(response.statusCode).toBe(401);
  });

  test('should respond with a 409 status code for id not found', async () => {
    const response = await request(app).put('/api/v1/posts/0').auth(tokenTest, { type: 'bearer' }).send({
      title: 'Post Update',
      content: 'Content Update',
      authorId: 1
    });
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 409 status code for invalid id', async () => {
    const response = await request(app).put('/api/v1/posts/abc').auth(tokenTest, { type: 'bearer' }).send({
      title: 'Post Update',
      content: 'Content Update',
      authorId: 1
    });
    expect(response.statusCode).toBe(409);
  });

  test('should respond with content-type application/json', async () => {
    const response = await request(app).put('/api/v1/posts/1').auth(tokenTest, { type: 'bearer' }).send({
      title: 'Post Update',
      content: 'Content Update',
      authorId: 1
    });
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with an object', async () => {
    const response = await request(app).put('/api/v1/posts/1').auth(tokenTest, { type: 'bearer' }).send({
      title: 'Post Update',
      content: 'Content Update',
      authorId: 1
    });
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Object),
        message: expect.any(String)
      })
    );
  });
});

describe('DELETE /api/v1/posts/:id', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).delete('/api/v1/posts/1').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(200);
  });

  test('should respond with a 401 status code for invalid token', async () => {
    const response = await request(app).delete('/api/v1/posts/1').auth('token', { type: 'bearer' }).send();
    expect(response.statusCode).toBe(401);
  });

  test('should respond with a 409 status code for id not found', async () => {
    const response = await request(app).delete('/api/v1/posts/0').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(409);
  });

  test('should respond with a 409 status code for invalid id', async () => {
    const response = await request(app).delete('/api/v1/posts/abc').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.statusCode).toBe(409);
  });

  test('should respond with content-type application/json', async () => {
    const response = await request(app).delete('/api/v1/posts/2').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with an object', async () => {
    const response = await request(app).delete('/api/v1/posts/3').auth(tokenTest, { type: 'bearer' }).send();
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Object),
        message: expect.any(String)
      })
    );
  });
});
