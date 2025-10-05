import { InvalidPizzaError, PizzaSize, CreateOrderDTO, Order } from "../types/types";

export class OrderService {

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

    createOrder(dto: CreateOrderDTO): Order {
        return {} as Order;
    }
}