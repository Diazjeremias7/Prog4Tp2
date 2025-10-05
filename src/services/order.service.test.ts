import { describe, test, expect, beforeEach } from 'vitest';
import { OrderService } from './order.service';
import { InvalidPizzaError } from '../types/types';

describe('OrderService - calculatePrice', () => {
    let service: OrderService;

    beforeEach(() => {
        service = new OrderService();
    });

    test('debería calcular precio para pizza S sin toppings', () => {
        const price = service.calculatePrice('S', []);
        expect(price).toBe(10);
    });

    test('debería calcular precio para pizza M', () => {
        const price = service.calculatePrice('M', []);
        expect(price).toBe(15);
    });

    test('debería calcular precio para pizza L', () => {
        const price = service.calculatePrice('L', []);
        expect(price).toBe(20);
    });

    test('debería agregar $2 por cada topping', () => {
        const price = service.calculatePrice('M', ['cheese', 'pepperoni']);
        expect(price).toBe(19); // 15 + 4
    });

    test('debería rechazar más de 5 toppings', () => {
        expect(() => {
            service.calculatePrice('L', ['t1', 't2', 't3', 't4', 't5', 't6']);
        }).toThrow(InvalidPizzaError);
    });
});