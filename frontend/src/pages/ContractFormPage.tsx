import { useEffect, useState } from 'react';
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

export default function ContractFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { all: customers } = useAppSelector((s) => s.customers);
  const { list: productsList } = useAppSelector((s) => s.products);
  const { list: employeesList } = useAppSelector((s) => s.employees);
  const { loading } = useAppSelector((s) => s.contracts);

  const [customerId, setCustomerId] = useState('');
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [termMonths, setTermMonths] = useState<number>(6);
  const [interestRateId, setInterestRateId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [branch, setBranch] = useState('');
  const [items, setItems] = useState<CreateContractItemDto[]>([
    { productId: '', quantity: 1, unitPrice: 0 },
  ]);
  const [interestRatesByTerm, setInterestRatesByTerm] = useState<{ id: string; termMonths: number; percentage: number } | null>(null);

  const products = productsList?.data ?? [];
  const employees = employeesList?.data ?? [];

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchProducts({ limit: MAX_LIST_SIZE }));
    dispatch(fetchEmployees({ limit: MAX_LIST_SIZE }));
  }, [dispatch]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<{ id: string; termMonths: number; percentage: number } | null>(
          `/interest-rates/latest/${termMonths}`
        );
        setInterestRatesByTerm(data);
        if (data) setInterestRateId(data.id);
        else setInterestRateId('');
      } catch {
        setInterestRatesByTerm(null);
        setInterestRateId('');
      }
    };
    load();
  }, [termMonths]);

  const addItem = () => {
    setItems((prev) => [...prev, { productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof CreateContractItemDto, value: string | number) => {
    setItems((prev) => {
      const next = [...prev];
      (next[index] as Record<string, string | number>)[field] = value;
      if (field === 'productId') {
        const product = products.find((p) => p.id === value);
        if (product) next[index].unitPrice = Number(product.price);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId.trim() || !guarantorName.trim()) return;
    if (!interestRateId) {
      alert(`Ustanovka foiz: ${termMonths} oy uchun foiz belgilanmagan. Avval "Ustanovka foiz" bo‘limida qo‘shing.`);
      return;
    }
    const validItems = items.filter((i) => i.productId && i.quantity > 0 && Number(i.unitPrice) >= 0);
    if (validItems.length === 0) {
      alert('Kamida bitta mahsulot tanlang.');
      return;
    }

    await dispatch(
      createContract({
        customerId,
        employeeId: employeeId || undefined,
        guarantorName: guarantorName.trim(),
        guarantorPhone: guarantorPhone.trim() || undefined,
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
  };

  const productTotal = items.reduce(
    (sum, i) => sum + Number(i.quantity || 0) * Number(i.unitPrice || 0),
    0
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
              <option key={c.id} value={c.id}>{getCustomerDisplayName(c)}</option>
            ))}
          </select>
        </label>

        <h3 className="form-section-title">Kafil</h3>
        <label className="form-label">
          Kafil ismi *
          <input
            className="form-input"
            value={guarantorName}
            onChange={(e) => setGuarantorName(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Kafil telefon
          <input
            type="tel"
            className="form-input"
            value={guarantorPhone}
            onChange={(e) => setGuarantorPhone(e.target.value)}
          />
        </label>

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
            <button type="button" className="btn-secondary" onClick={() => removeItem(index)} disabled={items.length <= 1}>
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
              <option key={t} value={t}>{t} oy</option>
            ))}
          </select>
        </label>
        {interestRatesByTerm && (
          <p className="text-muted form-meta">
            Foiz: {interestRatesByTerm.percentage}% ({termMonths} oy)
          </p>
        )}
        {!interestRatesByTerm && termMonths && (
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
                {e.fullName || `${e.firstName} ${e.lastName}`.trim() || e.login}
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
          <button type="submit" disabled={loading || !interestRateId} className="btn-primary">
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
