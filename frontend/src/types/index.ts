export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  purchasePrice: number;
  stockQty: number;
  groupId: string | null;
  group?: { id: string; name: string } | null;
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
  paymentSchedule?: {
    id: string;
    monthNumber: number;
    dueDate: string;
    amount: number;
    status: 'pending' | 'paid';
  }[];
}

/** Kvitansiya (to‘lov) */
export interface Receipt {
  id: string;
  contractId: string;
  paymentScheduleId: string;
  amount: number;
  receiptNumber: string;
  paidAt: string;
  paymentMethod: string | null;
  notes: string | null;
  createdAt: string;
  contract?: Contract;
  paymentSchedule?: {
    id: string;
    monthNumber: number;
    dueDate: string;
    amount: number;
    status: string;
  };
}

export interface CreateReceiptDto {
  contractId: string;
  paymentScheduleId: string;
  amount: number;
  paymentMethod?: 'cash' | 'card' | 'bank';
  notes?: string;
}

export interface UpdateReceiptDto {
  paymentMethod?: 'cash' | 'card' | 'bank' | null;
  notes?: string | null;
}

export const PAYMENT_METHOD_LABELS: Record<'cash' | 'card' | 'bank', string> = {
  cash: 'Naqd',
  card: 'Karta',
  bank: 'Bank o‘tkazmasi',
};

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

/** Shartnoma yangilash (mahsulotlar/summalar + filial, status, javobgar, kafil) */
export interface UpdateContractDto {
  branch?: string | null;
  status?: ContractStatus;
  employeeId?: string | null;
  guarantorCustomerId?: string;
  termMonths?: number;
  interestRateId?: string;
  items?: CreateContractItemDto[];
}

export interface ProductGroup {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Counterparty {
  id: string;
  name: string;
  phone: string | null;
  tin: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StockReceiptItem {
  id?: string;
  productId: string;
  product?: Product;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  lineTotal?: number;
}

export interface StockReceipt {
  id: string;
  counterpartyId: string;
  employeeId: string | null;
  receiptDate: string;
  note: string | null;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  counterparty?: Counterparty;
  employee?: Employee;
  items?: StockReceiptItem[];
}

export interface CreateStockReceiptDto {
  counterpartyId: string;
  employeeId?: string;
  receiptDate: string;
  note?: string;
  items: Array<{
    productId: string;
    quantity: number;
    purchasePrice: number;
    salePrice?: number;
  }>;
}

export interface StockReportRow {
  productId: string;
  productName: string;
  groupId: string | null;
  groupName: string | null;
  stockQty: number;
  currentPurchasePrice: number;
  currentSalePrice: number;
  incomingQtyInPeriod: number;
  incomingAmountInPeriod: number;
}
