import { InvalidPizzaError, PizzaSize, CreateOrderDTO, Order, OrderNotFoundError } from "../types/types";

export class OrderService {

    private orders: Map<string, Order> = new Map();
    private idCounter = 1;

    calculatePrice(size: PizzaSize, toppings: string[]): number {
        if (toppings.length > 5) {
            throw new InvalidPizzaError('Maximum 5 toppings allowed');
        }

        const basePrices: Record<PizzaSize, number> = {
            S: 10,
            M: 15,
            L: 20
        };

        return basePrices[size] + (toppings.length * 2);
    }

    getOrder(id: string): Order {
        const order = this.orders.get(id);
        if (!order) {
            throw new OrderNotFoundError(`Order with id ${id} not found`);
        }
        return order;
    }

    createOrder(dto: CreateOrderDTO): Order {
        const totalPrice = dto.items.reduce((sum, item) => {
            return sum + this.calculatePrice(item.size, item.toppings);
        }, 0);

        const order: Order = {
            id: `ORDER-${this.idCounter++}`,
            items: dto.items,
            address: dto.address,
            totalPrice,
            createdAt: new Date()
        };

        this.orders.set(order.id, order);
        return order;
    }
}