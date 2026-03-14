import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { Employee, Paginated, EmployeeFilters } from '../../types';

interface EmployeesState {
  list: Paginated<Employee> | null;
  current: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeesState = {
  list: null,
  current: null,
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchList',
  async (filters: EmployeeFilters = {}) => {
    const { data } = await api.get<Paginated<Employee>>('/employees', { params: filters });
    return data;
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchOne',
  async (id: string) => {
    const { data } = await api.get<Employee>(`/employees/${id}`);
    return data;
  }
);

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (body: {
    firstName: string;
    lastName?: string;
    login: string;
    password: string;
    phone?: string;
    pnfl?: string;
    birthDate?: string;
    passportSeries?: string;
    passportNumber?: string;
  }) => {
    const { data } = await api.post<Employee>('/employees', body);
    return data;
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async (payload: {
    id: string;
    body: Partial<{
      firstName: string;
      lastName: string;
      login: string;
      password: string;
      phone: string;
      pnfl: string;
      birthDate: string;
      passportSeries: string;
      passportNumber: string;
    }>;
  }) => {
    const { data } = await api.patch<Employee>(`/employees/${payload.id}`, payload.body);
    return data;
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: string) => {
    await api.delete(`/employees/${id}`);
    return id;
  }
);

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchEmployees.fulfilled, (s, a) => { s.list = a.payload; s.loading = false; })
      .addCase(fetchEmployees.rejected, (s, a) => { s.error = a.error.message || null; s.loading = false; })
      .addCase(fetchEmployeeById.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(createEmployee.fulfilled, (s) => { s.current = null; })
      .addCase(updateEmployee.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(deleteEmployee.fulfilled, (s) => { s.current = null; });
  },
});

export const { clearCurrent } = employeesSlice.actions;
export default employeesSlice.reducer;
