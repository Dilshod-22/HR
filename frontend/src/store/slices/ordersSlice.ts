import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { Order, Paginated, OrderFilters } from '../../types';

interface OrdersState {
  list: Paginated<Order> | null;
  current: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  list: null,
  current: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchList',
  async (filters: OrderFilters = {}) => {
    const { data } = await api.get<Paginated<Order>>('/orders', { params: filters });
    return data;
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOne',
  async (id: string) => {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (body: {
    customerId: string;
    productId: string;
    quantity: number;
    status?: string;
    notes?: string;
  }) => {
    const { data } = await api.post<Order>('/orders', body);
    return data;
  }
);

export const updateOrder = createAsyncThunk(
  'orders/update',
  async (payload: {
    id: string;
    body: Partial<{ customerId: string; productId: string; quantity: number; status: string; notes: string }>;
  }) => {
    const { data } = await api.patch<Order>(`/orders/${payload.id}`, payload.body);
    return data;
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/delete',
  async (id: string) => {
    await api.delete(`/orders/${id}`);
    return id;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchOrders.fulfilled, (s, a) => { s.list = a.payload; s.loading = false; })
      .addCase(fetchOrders.rejected, (s, a) => { s.error = a.error.message || null; s.loading = false; })
      .addCase(fetchOrderById.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(createOrder.fulfilled, (s) => { s.current = null; })
      .addCase(updateOrder.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(deleteOrder.fulfilled, (s) => { s.current = null; });
  },
});

export const { clearCurrent } = ordersSlice.actions;
export default ordersSlice.reducer;
