import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from './app';
import { OrderService } from './services/order.service';
import type { Express } from 'express';

describe('API Integration Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = makeApp(new OrderService());
  });

  describe('POST /orders', () => {
    test('debería crear orden exitosamente', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          items: [{ size: 'M', toppings: ['cheese'] }],
          address: '123 Main Street'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.totalPrice).toBe(17);
    });

    test('debería retornar 422 si items vacío', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          items: [],
          address: '123 Main Street'
        });

      expect(response.status).toBe(422);
    });

    test('debería retornar 422 si address corta', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          items: [{ size: 'M', toppings: [] }],
          address: 'Short'
        });

      expect(response.status).toBe(422);
    });
  });

  describe('GET /orders/:id', () => {
    test('debería retornar orden existente', async () => {
      const created = await request(app)
        .post('/orders')
        .send({
          items: [{ size: 'L', toppings: [] }],
          address: '123 Main Street'
        });

      const response = await request(app)
        .get(`/orders/${created.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(created.body.id);
    });

    test('debería retornar 404 si no existe', async () => {
      const response = await request(app)
        .get('/orders/invalid-id');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /orders', () => {
    test('debería retornar todas las órdenes', async () => {
      await request(app)
        .post('/orders')
        .send({
          items: [{ size: 'M', toppings: [] }],
          address: '123 Main Street'
        });

      await request(app)
        .post('/orders')
        .send({
          items: [{ size: 'L', toppings: [] }],
          address: '456 Oak Avenue'
        });

      const response = await request(app).get('/orders');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    test('debería retornar array vacío si no hay órdenes', async () => {
      const response = await request(app).get('/orders');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });
});