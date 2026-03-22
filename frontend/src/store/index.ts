import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import customersReducer from './slices/customersSlice';
import ordersReducer from './slices/ordersSlice';
import employeesReducer from './slices/employeesSlice';
import contractsReducer from './slices/contractsSlice';
import receiptsReducer from './slices/receiptsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    customers: customersReducer,
    orders: ordersReducer,
    employees: employeesReducer,
    contracts: contractsReducer,
    receipts: receiptsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { useAppDispatch, useAppSelector } from './hooks';
