import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { Counterparty } from '../../types';

interface CounterpartiesState {
  list: Counterparty[];
  loading: boolean;
  error: string | null;
}

const initialState: CounterpartiesState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchCounterparties = createAsyncThunk('counterparties/fetchAll', async () => {
  const { data } = await api.get<Counterparty[]>('/counterparties');
  return data;
});

export const createCounterparty = createAsyncThunk(
  'counterparties/create',
  async (body: { name: string; phone?: string; tin?: string; address?: string }) => {
    const { data } = await api.post<Counterparty>('/counterparties', body);
    return data;
  },
);

export const updateCounterparty = createAsyncThunk(
  'counterparties/update',
  async ({ id, body }: { id: string; body: Partial<Counterparty> }) => {
    const { data } = await api.patch<Counterparty>(`/counterparties/${id}`, body);
    return data;
  },
);

export const deleteCounterparty = createAsyncThunk('counterparties/delete', async (id: string) => {
  await api.delete(`/counterparties/${id}`);
  return id;
});

const counterpartiesSlice = createSlice({
  name: 'counterparties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCounterparties.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchCounterparties.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchCounterparties.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || null;
      })
      .addCase(createCounterparty.fulfilled, (s, a) => {
        s.list = [a.payload, ...s.list];
      })
      .addCase(updateCounterparty.fulfilled, (s, a) => {
        s.list = s.list.map((x) => (x.id === a.payload.id ? a.payload : x));
      })
      .addCase(deleteCounterparty.fulfilled, (s, a) => {
        s.list = s.list.filter((x) => x.id !== a.payload);
      });
  },
});

export default counterpartiesSlice.reducer;

