import type { OrderStatus } from '../types';

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Kutilmoqda' },
  { value: 'processing', label: 'Qayta ishlanmoqda' },
  { value: 'shipped', label: 'Yuborilgan' },
  { value: 'delivered', label: 'Yetkazilgan' },
  { value: 'cancelled', label: 'Bekor qilindi' },
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Kutilmoqda',
  processing: 'Qayta ishlanmoqda',
  shipped: 'Yuborilgan',
  delivered: 'Yetkazilgan',
  cancelled: 'Bekor qilindi',
};
