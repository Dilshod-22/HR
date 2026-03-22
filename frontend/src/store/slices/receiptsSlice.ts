import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { Receipt, Paginated, CreateReceiptDto, UpdateReceiptDto } from '../../types';

interface ReceiptsState {
  list: Paginated<Receipt> | null;
  current: Receipt | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReceiptsState = {
  list: null,
  current: null,
  loading: false,
  error: null,
};

export const fetchReceipts = createAsyncThunk(
  'receipts/fetchList',
  async (params: { page?: number; limit?: number; contractId?: string } = {}) => {
    const { data } = await api.get<Paginated<Receipt>>('/receipts', { params });
    return data;
  }
);

export const fetchReceiptById = createAsyncThunk('receipts/fetchOne', async (id: string) => {
  const { data } = await api.get<Receipt>(`/receipts/${id}`);
  return data;
});

export const createReceipt = createAsyncThunk('receipts/create', async (body: CreateReceiptDto) => {
  const { data } = await api.post<Receipt>('/receipts', body);
  return data;
});

export const updateReceipt = createAsyncThunk(
  'receipts/update',
  async ({ id, body }: { id: string; body: UpdateReceiptDto }) => {
    const { data } = await api.patch<Receipt>(`/receipts/${id}`, body);
    return data;
  }
);

const receiptsSlice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {
    clearCurrentReceipt: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceipts.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchReceipts.fulfilled, (s, a) => {
        s.list = a.payload;
        s.loading = false;
      })
      .addCase(fetchReceipts.rejected, (s, a) => {
        s.error = a.error.message || null;
        s.loading = false;
      })
      .addCase(fetchReceiptById.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchReceiptById.fulfilled, (s, a) => {
        s.current = a.payload;
        s.loading = false;
      })
      .addCase(fetchReceiptById.rejected, (s, a) => {
        s.error = a.error.message || null;
        s.loading = false;
      })
      .addCase(createReceipt.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createReceipt.fulfilled, (s, a) => {
        s.current = a.payload;
        s.loading = false;
      })
      .addCase(createReceipt.rejected, (s, a) => {
        s.error = a.error.message || null;
        s.loading = false;
      })
      .addCase(updateReceipt.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateReceipt.fulfilled, (s, a) => {
        s.current = a.payload;
        s.loading = false;
      })
      .addCase(updateReceipt.rejected, (s, a) => {
        s.error = a.error.message || null;
        s.loading = false;
      });
  },
});

export const { clearCurrentReceipt } = receiptsSlice.actions;
export default receiptsSlice.reducer;
