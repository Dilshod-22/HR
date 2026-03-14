import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import customersReducer from './slices/customersSlice';
import ordersReducer from './slices/ordersSlice';
import employeesReducer from './slices/employeesSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    customers: customersReducer,
    orders: ordersReducer,
    employees: employeesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { useAppDispatch, useAppSelector } from './hooks';
