import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { ProductGroup } from '../../types';

interface ProductGroupsState {
  list: ProductGroup[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductGroupsState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchProductGroups = createAsyncThunk('productGroups/fetchAll', async () => {
  const { data } = await api.get<ProductGroup[]>('/product-groups');
  return data;
});

export const createProductGroup = createAsyncThunk(
  'productGroups/create',
  async (body: { name: string; description?: string }) => {
    const { data } = await api.post<ProductGroup>('/product-groups', body);
    return data;
  },
);

export const updateProductGroup = createAsyncThunk(
  'productGroups/update',
  async ({ id, body }: { id: string; body: Partial<ProductGroup> }) => {
    const { data } = await api.patch<ProductGroup>(`/product-groups/${id}`, body);
    return data;
  },
);

export const deleteProductGroup = createAsyncThunk('productGroups/delete', async (id: string) => {
  await api.delete(`/product-groups/${id}`);
  return id;
});

const productGroupsSlice = createSlice({
  name: 'productGroups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductGroups.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProductGroups.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchProductGroups.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || null;
      })
      .addCase(createProductGroup.fulfilled, (s, a) => {
        s.list = [...s.list, a.payload].sort((x, y) => x.name.localeCompare(y.name));
      })
      .addCase(updateProductGroup.fulfilled, (s, a) => {
        s.list = s.list.map((x) => (x.id === a.payload.id ? a.payload : x));
      })
      .addCase(deleteProductGroup.fulfilled, (s, a) => {
        s.list = s.list.filter((x) => x.id !== a.payload);
      });
  },
});

export default productGroupsSlice.reducer;

