import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { Customer, Paginated, CustomerFilters } from '../../types';
import { MAX_LIST_SIZE } from '../../constants/pagination';

interface CustomersState {
  list: Paginated<Customer> | null;
  current: Customer | null;
  all: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  list: null,
  current: null,
  all: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchList',
  async (filters: CustomerFilters = {}) => {
    const { data } = await api.get<Paginated<Customer>>('/customers', { params: filters });
    return data;
  }
);

export const fetchAllCustomers = createAsyncThunk(
  'customers/fetchAll',
  async () => {
    const { data } = await api.get<Paginated<Customer>>('/customers', {
      params: { limit: MAX_LIST_SIZE },
    });
    return data.data;
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchOne',
  async (id: string) => {
    const { data } = await api.get<Customer>(`/customers/${id}`);
    return data;
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (body: {
    firstName: string;
    lastName?: string;
    pnfl?: string;
    phone?: string;
    birthDate?: string;
    passportSeries?: string;
    passportNumber?: string;
    address?: string;
    region?: string;
    district?: string;
    workplace?: string;
  }) => {
    const { data } = await api.post<Customer>('/customers', body);
    return data;
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async (payload: {
    id: string;
    body: Partial<{
      firstName: string;
      lastName: string;
      pnfl: string;
      phone: string;
      birthDate: string;
      passportSeries: string;
      passportNumber: string;
      address: string;
      region: string;
      district: string;
      workplace: string;
    }>;
  }) => {
    const { data } = await api.patch<Customer>(`/customers/${payload.id}`, payload.body);
    return data;
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id: string) => {
    await api.delete(`/customers/${id}`);
    return id;
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCustomers.fulfilled, (s, a) => { s.list = a.payload; s.loading = false; })
      .addCase(fetchCustomers.rejected, (s, a) => { s.error = a.error.message || null; s.loading = false; })
      .addCase(fetchAllCustomers.fulfilled, (s, a) => { s.all = a.payload; })
      .addCase(fetchCustomerById.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(createCustomer.fulfilled, (s) => { s.current = null; })
      .addCase(updateCustomer.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(deleteCustomer.fulfilled, (s) => { s.current = null; });
  },
});

export const { clearCurrent } = customersSlice.actions;
export default customersSlice.reducer;
