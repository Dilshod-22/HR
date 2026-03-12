export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  imageKitId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  passportSeries: string | null;
  passportNumber: string | null;
  address: string | null;
  region: string | null;
  district: string | null;
  workplace: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  status: OrderStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  product?: Product;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'firstName' | 'lastName' | 'fullName' | 'email' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

/** Mijoz uchun ko‘rsatish matni (ism + email yoki id) */
export function getCustomerDisplayName(c: Customer): string {
  const name = c.fullName?.trim() || [c.firstName, c.lastName].filter(Boolean).join(' ').trim() || '—';
  return c.email ? `${name} — ${c.email}` : name;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  customerId?: string;
  productId?: string;
  sortBy?: 'createdAt' | 'status' | 'quantity';
  sortOrder?: 'ASC' | 'DESC';
}
