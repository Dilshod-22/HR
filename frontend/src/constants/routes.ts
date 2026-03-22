export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_NEW: '/products/new',
  PRODUCT_EDIT: '/products/:id/edit',
  CUSTOMERS: '/customers',
  CUSTOMER_NEW: '/customers/new',
  CUSTOMER_EDIT: '/customers/:id/edit',
  ORDERS: '/orders',
  ORDER_NEW: '/orders/new',
  ORDER_EDIT: '/orders/:id/edit',
  EMPLOYEES: '/employees',
  EMPLOYEE_NEW: '/employees/new',
  EMPLOYEE_EDIT: '/employees/:id/edit',
  INTEREST_RATES: '/interest-rates',
  RECEIPTS: '/receipts',
  RECEIPT_NEW: '/receipts/new',
  RECEIPT_EDIT: '/receipts/:id/edit',
  CONTRACTS: '/contracts',
  CONTRACT_NEW: '/contracts/new',
  CONTRACT_EDIT: '/contracts/:id/edit',
} as const;

export function productEditPath(id: string): string {
  return `/products/${id}/edit`;
}
export function customerEditPath(id: string): string {
  return `/customers/${id}/edit`;
}

export function orderEditPath(id: string): string {
  return `/orders/${id}/edit`;
}
export function employeeEditPath(id: string): string {
  return `/employees/${id}/edit`;
}

export function receiptEditPath(id: string): string {
  return `/receipts/${id}/edit`;
}

export function contractEditPath(id: string): string {
  return `/contracts/${id}/edit`;
}

