import { describe, test, expect, beforeEach } from 'vitest';
import { OrderService } from './order.service';

describe('OrderService - calculatePrice', () => {
    let service: OrderService;

    beforeEach(() => {
        service = new OrderService();
    });

    test('debería calcular precio para pizza S sin toppings', () => {
        const price = service.calculatePrice('S', []);
        expect(price).toBe(10);
    });
});