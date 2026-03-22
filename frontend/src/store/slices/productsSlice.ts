import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, apiForm } from '../../api/client';
import type { Product, Paginated, ProductFilters } from '../../types';

interface ProductsState {
  list: Paginated<Product> | null;
  current: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  list: null,
  current: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchList',
  async (filters: ProductFilters = {}) => {
    const { data } = await api.get<Paginated<Product>>('/products', { params: filters });
    return data;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchOne',
  async (id: string) => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (payload: { body: { name: string; description?: string; price: number }; image?: File }) => {
    const form = new FormData();
    form.append('name', payload.body.name);
    form.append('price', String(payload.body.price));
    if (payload.body.description) form.append('description', payload.body.description);
    if (payload.image) form.append('image', payload.image);
    const { data } = await apiForm('/products', form, 'post');
    return data as Product;
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async (payload: {
    id: string;
    body: { name?: string; description?: string; price?: number };
    image?: File;
  }) => {
    const form = new FormData();
    if (payload.body.name !== undefined) form.append('name', payload.body.name);
    if (payload.body.price !== undefined) form.append('price', String(payload.body.price));
    if (payload.body.description !== undefined) form.append('description', payload.body.description);
    if (payload.image) form.append('image', payload.image);
    const { data } = await apiForm(`/products/${payload.id}`, form, 'patch');
    return data as Product;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: string) => {
    await api.delete(`/products/${id}`);
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.list = a.payload; s.loading = false; })
      .addCase(fetchProducts.rejected, (s, a) => { s.error = a.error.message || null; s.loading = false; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(createProduct.fulfilled, (s) => { s.current = null; })
      .addCase(updateProduct.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(deleteProduct.pending, (s) => { s.error = null; })
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.current = s.current?.id === a.payload ? null : s.current;
      })
      .addCase(deleteProduct.rejected, (s, a) => {
        s.error = a.error.message || 'O‘chirishda xato';
      });
  },
});

export const { clearCurrent } = productsSlice.actions;
export default productsSlice.reducer;
