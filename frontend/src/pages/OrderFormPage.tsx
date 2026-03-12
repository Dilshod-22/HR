import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchOrderById,
  createOrder,
  updateOrder,
  clearCurrent,
} from '../store/slices/ordersSlice';
import { fetchAllCustomers } from '../store/slices/customersSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import type { OrderStatus } from '../types';
import { getCustomerDisplayName } from '../types';
import { ORDER_STATUS_OPTIONS } from '../constants/orders';
import { ROUTES } from '../constants/routes';
import { MAX_LIST_SIZE } from '../constants/pagination';

export default function OrderFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { current, loading } = useAppSelector((s) => s.orders);
  const { all: customers } = useAppSelector((s) => s.customers);
  const { list: productsList } = useAppSelector((s) => s.products);

  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [notes, setNotes] = useState('');

  const isEdit = Boolean(id);
  const products = productsList?.data ?? [];

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
    return () => { dispatch(clearCurrent()); };
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchProducts({ limit: MAX_LIST_SIZE }));
  }, [dispatch]);

  useEffect(() => {
    if (current) {
      setCustomerId(current.customerId);
      setProductId(current.productId);
      setQuantity(String(current.quantity));
      setStatus(current.status);
      setNotes(current.notes || '');
    }
  }, [current]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (!customerId || !productId || isNaN(qty) || qty < 1) return;

    if (isEdit && id) {
      await dispatch(updateOrder({
        id,
        body: { customerId, productId, quantity: qty, status, notes: notes.trim() || undefined },
      }));
    } else {
      await dispatch(createOrder({
        customerId,
        productId,
        quantity: qty,
        status,
        notes: notes.trim() || undefined,
      }));
    }
    navigate(ROUTES.ORDERS);
  };

  return (
    <div>
      <h1 className="page-title">{isEdit ? 'Buyurtmani tahrirlash' : 'Yangi buyurtma'}</h1>
      <form onSubmit={handleSubmit} className="form-block">
        <label className="form-label">
          Mijoz *
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Tanlang</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{getCustomerDisplayName(c)}</option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Mahsulot *
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Tanlang</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {Number(p.price).toLocaleString()} so‘m
              </option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Miqdor *
          <input
            type="number"
            className="form-input input-number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="form-select"
          >
            {ORDER_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Izoh
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </label>
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saqlanmoqda…' : isEdit ? 'Saqlash' : 'Yaratish'}
          </button>
          <button type="button" onClick={() => navigate(ROUTES.ORDERS)} className="btn-secondary">
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  );
}
