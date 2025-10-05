export type PizzaSize = 'S' | 'M' | 'L';

export interface PizzaItem {
    size: PizzaSize;
    toppings: string[];
}

export interface Order {
    id: string;
    items: PizzaItem[];
    address: string;
    totalPrice: number;
    createdAt: Date;
}

export interface CreateOrderDTO {
    items: PizzaItem[];
    address: string;
}

export class InvalidPizzaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidPizzaError';
    }
}

export class OrderNotFoundError extends Error {
    constructor(orderId: string) {
        super(`Order ${orderId} not found`);
        this.name = 'OrderNotFoundError';
    }
}