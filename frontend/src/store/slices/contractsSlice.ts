import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { Contract, Paginated, CreateContractDto } from '../../types';

interface ContractsState {
  list: Paginated<Contract> | null;
  current: Contract | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContractsState = {
  list: null,
  current: null,
  loading: false,
  error: null,
};

export const fetchContracts = createAsyncThunk(
  'contracts/fetchList',
  async (params: { page?: number; limit?: number; customerId?: string; status?: string } = {}) => {
    const { data } = await api.get<Paginated<Contract>>('/contracts', { params });
    return data;
  }
);

export const fetchContractById = createAsyncThunk(
  'contracts/fetchOne',
  async (id: string) => {
    const { data } = await api.get<Contract>(`/contracts/${id}`);
    return data;
  }
);

export const createContract = createAsyncThunk(
  'contracts/create',
  async (body: CreateContractDto) => {
    const { data } = await api.post<Contract>('/contracts', body);
    return data;
  }
);

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchContracts.fulfilled, (s, a) => { s.list = a.payload; s.loading = false; })
      .addCase(fetchContracts.rejected, (s, a) => { s.error = a.error.message || null; s.loading = false; })
      .addCase(fetchContractById.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(createContract.fulfilled, (s, a) => { s.current = a.payload; });
  },
});

export const { clearCurrent } = contractsSlice.actions;
export default contractsSlice.reducer;
