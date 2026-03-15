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
  pnfl: string | null;
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
  return c.pnfl ? `${name} — ${c.pnfl}` : name;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  login: string;
  phone: string | null;
  pnfl: string | null;
  birthDate: string | null;
  passportSeries: string | null;
  passportNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'firstName' | 'lastName' | 'fullName' | 'login' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
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

// Shartnoma
export type ContractStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export interface ContractItem {
  id?: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
}

export interface Contract {
  id: string;
  customerId: string;
  employeeId: string | null;
  guarantorCustomerId: string | null;
  guarantorName: string | null;
  termMonths: number;
  interestRateId: string;
  productTotal: number;
  interestAmount: number;
  totalAmount: number;
  monthlyAmount: number;
  status: ContractStatus;
  branch: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  employee?: Employee;
  guarantor?: Customer;
  interestRate?: { id: string; termMonths: number; percentage: number; year: number };
  items?: ContractItem[];
  paymentSchedule?: { monthNumber: number; dueDate: string; amount: number; status: string }[];
}

export interface CreateContractItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateContractDto {
  customerId: string;
  employeeId?: string;
  guarantorCustomerId: string;
  termMonths: number;
  interestRateId: string;
  branch?: string;
  items: CreateContractItemDto[];
}
