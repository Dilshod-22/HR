import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchOrders } from '../store/slices/ordersSlice';
import Pagination from '../components/Pagination';
import type { OrderFilters, OrderStatus } from '../types';
import { getCustomerDisplayName } from '../types';
import { ORDER_STATUS_LABELS } from '../constants/orders';
import { ROUTES, orderEditPath } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';

function statusClass(s: OrderStatus): string {
  return `status-badge status-${s}`;
}

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.orders);
  const [filters, setFilters] = useState<OrderFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    search: '',
    status: undefined,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput || undefined, page: 1 }));
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Buyurtmalar</h1>
        <Link to={ROUTES.ORDER_NEW} className="btn-primary">+ Yangi buyurtma</Link>
      </div>

      <form onSubmit={handleSearch} className="filters-row">
        <input
          type="text"
          placeholder="Qidirish (mijoz, mahsulot)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input-text"
        />
        <select
          value={filters.status ?? ''}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status: (e.target.value || undefined) as OrderStatus | undefined,
              page: 1,
            }))
          }
          className="select-field"
        >
          <option value="">Barcha statuslar</option>
          {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-') as [OrderFilters['sortBy'], 'ASC' | 'DESC'];
            setFilters((f) => ({ ...f, sortBy, sortOrder, page: 1 }));
          }}
          className="select-field"
        >
          <option value="createdAt-DESC">Yangi avval</option>
          <option value="createdAt-ASC">Eski avval</option>
          <option value="status-ASC">Status</option>
          <option value="quantity-DESC">Miqdor kamayish</option>
          <option value="quantity-ASC">Miqdor o‘sish</option>
        </select>
        <button type="submit" className="btn-search">Qidirish</button>
      </form>

      {loading && <p className="text-loading">Yuklanmoqda…</p>}
      {!loading && list && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mijoz</th>
                <th>Mahsulot</th>
                <th>Miqdor</th>
                <th>Status</th>
                <th>Sana</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((o) => (
                <tr key={o.id}>
                  <td>{o.customer ? getCustomerDisplayName(o.customer) : o.customerId}</td>
                  <td>{o.product ? o.product.name : o.productId}</td>
                  <td>{o.quantity}</td>
                  <td>
                    <span className={statusClass(o.status)}>{ORDER_STATUS_LABELS[o.status]}</span>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString('uz')}</td>
                  <td>
                    <Link to={orderEditPath(o.id)} className="link-action">Tahrirlash</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.data.length === 0 && (
            <p className="text-empty">Buyurtma topilmadi.</p>
          )}
          <Pagination
            page={list.page}
            totalPages={list.totalPages}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </>
      )}
    </div>
  );
}
