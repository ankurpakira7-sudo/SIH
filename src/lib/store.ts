import type { Order, OrderStatus } from './types';
import { orders as seedOrders } from './mockData';

// In-memory store so mutations persist across portal switches during a session.
let store: Order[] = seedOrders.map((o) => ({ ...o, lines: [...o.lines] }));

export function getAllOrders(): Order[] {
  return [...store];
}

export function getOrdersForHospital(hospitalId: string): Order[] {
  return store.filter((o) => o.requesterId === hospitalId);
}

export function getOrdersForBank(bankId: string): Order[] {
  return store.filter((o) => o.supplierId === bankId);
}

export function addOrder(order: Order): void {
  store = [order, ...store];
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const at = new Date().toISOString();
  store = store.map((o) =>
    o.id === orderId
      ? { ...o, status, updatedAt: at, history: [...o.history, { status, at }] }
      : o
  );
}

export function nextOrderCode(): string {
  const n = store.length + 43;
  return `RS-2408-${String(n).padStart(4, '0')}`;
}
