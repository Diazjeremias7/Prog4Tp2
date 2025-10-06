import express, { Request, Response } from 'express';
import { OrderService } from './services/order.service';
import { createOrderSchema } from './schemas';
import { OrderNotFoundError, InvalidPizzaError } from './types';

export const makeApp = (orderService?: OrderService) => {
  const app = express();
  const service = orderService || new OrderService();

  app.use(express.json());

  // POST /orders
  app.post('/orders', (req: Request, res: Response) => {
    const validation = createOrderSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(422).json({
        error: 'Validation error',
        details: validation.error.errors
      });
    }

    try {
      const order = service.createOrder(validation.data);
      return res.status(201).json(order);
    } catch (error) {
      if (error instanceof InvalidPizzaError) {
        return res.status(422).json({ error: error.message });
      }
      throw error;
    }
  });

  // GET /orders/:id
  app.get('/orders/:id', (req: Request, res: Response) => {
    try {
      const order = service.getOrder(req.params.id);
      return res.status(200).json(order);
    } catch (error) {
      if (error instanceof OrderNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      throw error;
    }
  });

  // GET /orders
  app.get('/orders', (req: Request, res: Response) => {
    const orders = service.getOrders();
    return res.status(200).json(orders);
  });

  return app;
};