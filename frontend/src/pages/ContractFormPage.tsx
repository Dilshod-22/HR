import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { createContract } from '../store/slices/contractsSlice';
import { fetchAllCustomers } from '../store/slices/customersSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchEmployees } from '../store/slices/employeesSlice';
import { api } from '../api/client';
import { ROUTES } from '../constants/routes';
import { getCustomerDisplayName } from '../types';
import { MAX_LIST_SIZE } from '../constants/pagination';
import type { CreateContractItemDto } from '../types';

const TERM_OPTIONS = [6, 12] as const;
const INITIAL_ITEM: CreateContractItemDto = { productId: '', quantity: 1, unitPrice: 0 };

export default function ContractFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { all: customers } = useAppSelector((s) => s.customers);
  const { list: productsList } = useAppSelector((s) => s.products);
  const { list: employeesList } = useAppSelector((s) => s.employees);
  const { loading } = useAppSelector((s) => s.contracts);

  const [customerId, setCustomerId] = useState('');
  const [guarantorCustomerId, setGuarantorCustomerId] = useState('');
  const [termMonths, setTermMonths] = useState<number>(6);
  const [interestRateId, setInterestRateId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [branch, setBranch] = useState('');
  const [items, setItems] = useState<CreateContractItemDto[]>([{ ...INITIAL_ITEM }]);
  const [interestRate, setInterestRate] = useState<{ id: string; termMonths: number; percentage: number } | null>(null);

  const products = useMemo(() => productsList?.data ?? [], [productsList?.data]);
  const employees = useMemo(() => employeesList?.data ?? [], [employeesList?.data]);

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchProducts({ limit: MAX_LIST_SIZE }));
    dispatch(fetchEmployees({ limit: MAX_LIST_SIZE }));
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ id: string; termMonths: number; percentage: number } | null>(`/interest-rates/latest/${termMonths}`)
      .then(({ data }) => {
        if (!cancelled) {
          setInterestRate(data);
          setInterestRateId(data?.id ?? '');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setInterestRate(null);
          setInterestRateId('');
        }
      });
    return () => { cancelled = true; };
  }, [termMonths]);

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, { ...INITIAL_ITEM }]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }, []);

  const updateItem = useCallback(
    (index: number, field: keyof CreateContractItemDto, value: string | number) => {
      setItems((prev) => {
        const next = [...prev];
        const row = { ...next[index], [field]: value };
        if (field === 'productId' && typeof value === 'string') {
          const product = products.find((p) => p.id === value);
          if (product) row.unitPrice = Number(product.price);
        }
        next[index] = row;
        return next;
      });
    },
    [products]
  );

  const productTotal = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.unitPrice || 0), 0),
    [items]
  );

  const validItems = useMemo(
    () => items.filter((i) => i.productId && i.quantity > 0 && Number(i.unitPrice) >= 0),
    [items]
  );

  const canSubmit = Boolean(
    customerId.trim() &&
      guarantorCustomerId.trim() &&
      interestRateId &&
      validItems.length > 0 &&
      !loading
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      await dispatch(
        createContract({
          customerId,
          employeeId: employeeId || undefined,
          guarantorCustomerId,
          termMonths,
          interestRateId,
          branch: branch.trim() || undefined,
          items: validItems.map((i) => ({
            productId: i.productId,
            quantity: Number(i.quantity),
            unitPrice: Number(i.unitPrice),
          })),
        })
      );
      navigate(ROUTES.CONTRACTS);
    },
    [
      canSubmit,
      customerId,
      employeeId,
      guarantorCustomerId,
      termMonths,
      interestRateId,
      branch,
      validItems,
      dispatch,
      navigate,
    ]
  );

  return (
    <div>
      <h1 className="page-title">Shartnoma yaratish</h1>
      <form onSubmit={handleSubmit} className="form-block" style={{ maxWidth: 640 }}>
        <label className="form-label">
          Klient (mijoz) *
          <select
            className="form-select"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Tanlang</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {getCustomerDisplayName(c)}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          Kafil (mijoz) *
          <select
            className="form-select"
            value={guarantorCustomerId}
            onChange={(e) => setGuarantorCustomerId(e.target.value)}
            required
          >
            <option value="">Tanlang</option>
            {customers
              .filter((c) => c.id !== customerId)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {getCustomerDisplayName(c)}
                </option>
              ))}
          </select>
        </label>
        <p className="text-muted form-meta">Kafil ham mijoz bo‘lib, uning ma’lumotlari tizimda mavjud.</p>

        <h3 className="form-section-title">Mahsulotlar</h3>
        {items.map((item, index) => (
          <div key={index} className="form-row-grid" style={{ alignItems: 'end', marginBottom: '0.75rem' }}>
            <label className="form-label">
              Mahsulot
              <select
                className="form-select"
                value={item.productId}
                onChange={(e) => updateItem(index, 'productId', e.target.value)}
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
              Soni
              <input
                type="number"
                min={1}
                className="form-input"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value, 10) || 0)}
              />
            </label>
            <label className="form-label">
              Narx (so‘m)
              <input
                type="number"
                min={0}
                step={0.01}
                className="form-input"
                value={item.unitPrice || ''}
                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
              />
            </label>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => removeItem(index)}
              disabled={items.length <= 1}
            >
              O‘chirish
            </button>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={addItem} style={{ marginBottom: '1rem' }}>
          + Mahsulot qo‘shish
        </button>
        <p className="text-muted form-meta">Jami mahsulot: {productTotal.toLocaleString()} so‘m</p>

        <label className="form-label">
          Necha oyga rasrochka *
          <select
            className="form-select"
            value={termMonths}
            onChange={(e) => setTermMonths(Number(e.target.value) as 6 | 12)}
            required
          >
            {TERM_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t} oy
              </option>
            ))}
          </select>
        </label>
        {interestRate && (
          <p className="text-muted form-meta">
            Foiz: {interestRate.percentage}% ({termMonths} oy)
          </p>
        )}
        {!interestRate && termMonths > 0 && (
          <p className="form-meta" style={{ color: 'var(--status-cancelled, #ef4444)' }}>
            Ustanovka foizda {termMonths} oy uchun foiz belgilanmagan.
          </p>
        )}

        <label className="form-label">
          Javobgar (shartnomani kim yaratadi)
          <select
            className="form-select"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          >
            <option value="">Joriy foydalanuvchi</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fullName || [e.firstName, e.lastName].filter(Boolean).join(' ').trim() || e.login}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          Filial (branch)
          <input
            className="form-input"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Masalan: Toshkent 1"
          />
        </label>

        <p className="text-muted form-meta">Yaratilgan sana: server tomonidan avtomatik belgilanadi.</p>

        <div className="form-actions">
          <button type="submit" disabled={!canSubmit || !interestRateId} className="btn-primary">
            {loading ? 'Yaratilmoqda…' : 'Shartnoma yaratish'}
          </button>
          <button type="button" onClick={() => navigate(ROUTES.CONTRACTS)} className="btn-secondary">
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  );
}
