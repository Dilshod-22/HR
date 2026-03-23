import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { CreateStockReceiptDto, Paginated, StockReceipt, StockReportRow } from '../../types';

interface StockState {
  receipts: Paginated<StockReceipt> | null;
  report: StockReportRow[];
  loading: boolean;
  error: string | null;
}

const initialState: StockState = {
  receipts: null,
  report: [],
  loading: false,
  error: null,
};

export const fetchStockReceipts = createAsyncThunk(
  'stock/fetchReceipts',
  async (params: { page?: number; limit?: number; fromDate?: string; toDate?: string; productId?: string } = {}) => {
    const { data } = await api.get<Paginated<StockReceipt>>('/stock-receipts', { params });
    return data;
  },
);

export const createStockReceipt = createAsyncThunk('stock/createReceipt', async (body: CreateStockReceiptDto) => {
  const { data } = await api.post<StockReceipt>('/stock-receipts', body);
  return data;
});

export const fetchStockReport = createAsyncThunk(
  'stock/fetchReport',
  async (params: { fromDate?: string; toDate?: string; productId?: string; groupId?: string } = {}) => {
    const { data } = await api.get<{ data: StockReportRow[] }>('/stock-receipts/report/stock', { params });
    return data.data;
  },
);

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockReceipts.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchStockReceipts.fulfilled, (s, a) => {
        s.loading = false;
        s.receipts = a.payload;
      })
      .addCase(fetchStockReceipts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || null;
      })
      .addCase(createStockReceipt.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createStockReceipt.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(createStockReceipt.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || null;
      })
      .addCase(fetchStockReport.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchStockReport.fulfilled, (s, a) => {
        s.loading = false;
        s.report = a.payload;
      })
      .addCase(fetchStockReport.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || null;
      });
  },
});

export default stockSlice.reducer;

