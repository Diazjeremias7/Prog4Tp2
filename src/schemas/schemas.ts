import { z } from 'zod';

export const pizzaItemSchema = z.object({
  size: z.enum(['S', 'M', 'L']),
  toppings: z.array(z.string()).max(5, 'Maximum 5 toppings allowed')
});

export const createOrderSchema = z.object({
  items: z.array(pizzaItemSchema).min(1, 'Order must contain at least one item'),
  address: z.string().min(10, 'Address must be at least 10 characters')
});