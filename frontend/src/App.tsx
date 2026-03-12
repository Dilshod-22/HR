import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ProductFormPage from './pages/ProductFormPage';
import CustomersPage from './pages/CustomersPage';
import CustomerFormPage from './pages/CustomerFormPage';
import OrdersPage from './pages/OrdersPage';
import OrderFormPage from './pages/OrderFormPage';
import HomePage from './pages/HomePage';
import EmployeesPage from './pages/EmployeesPage';
import InterestRatesPage from './pages/InterestRatesPage';
import ReceiptsPage from './pages/ReceiptsPage';
import ContractsPage from './pages/ContractsPage';
import ContractFormPage from './pages/ContractFormPage';

const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  {
    path: ROUTES.HOME,
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/new', element: <ProductFormPage /> },
      { path: 'products/:id/edit', element: <ProductFormPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'customers/new', element: <CustomerFormPage /> },
      { path: 'customers/:id/edit', element: <CustomerFormPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/new', element: <OrderFormPage /> },
      { path: 'orders/:id/edit', element: <OrderFormPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'interest-rates', element: <InterestRatesPage /> },
      { path: 'receipts', element: <ReceiptsPage /> },
      { path: 'contracts', element: <ContractsPage /> },
      { path: 'contracts/new', element: <ContractFormPage /> },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.HOME} replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
