import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchCounterparties } from '../store/slices/counterpartiesSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchEmployees } from '../store/slices/employeesSlice';
import { createStockReceipt, fetchStockReceipts } from '../store/slices/stockSlice';
import { MAX_LIST_SIZE, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import type { CreateStockReceiptDto } from '../types';

const newRow = () => ({ productId: '', quantity: 1, purchasePrice: 0, salePrice: 0 });

export default function StockReceiptsPage() {
  const dispatch = useAppDispatch();
  const { list: counterparties } = useAppSelector((s) => s.counterparties);
  const { list: productsList } = useAppSelector((s) => s.products);
  const { list: employeesList } = useAppSelector((s) => s.employees);
  const { receipts, loading, error } = useAppSelector((s) => s.stock);
  const [page, setPage] = useState(DEFAULT_PAGE);

  const [counterpartyId, setCounterpartyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number; purchasePrice: number; salePrice: number }>>([
    newRow(),
  ]);

  useEffect(() => {
    dispatch(fetchCounterparties());
    dispatch(fetchProducts({ limit: MAX_LIST_SIZE }));
    dispatch(fetchEmployees({ limit: MAX_LIST_SIZE }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStockReceipts({ page, limit: DEFAULT_PAGE_SIZE }));
  }, [dispatch, page]);

  const products = productsList?.data ?? [];
  const employees = employeesList?.data ?? [];
  const total = useMemo(
    () => items.reduce((acc, x) => acc + Number(x.quantity) * Number(x.purchasePrice), 0),
    [items],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter((x) => x.productId && x.quantity > 0 && x.purchasePrice >= 0);
    if (!counterpartyId || !receiptDate || validItems.length === 0) return;
    const payload: CreateStockReceiptDto = {
      counterpartyId,
      employeeId: employeeId || undefined,
      receiptDate,
      note: note || undefined,
      items: validItems,
    };
    await dispatch(createStockReceipt(payload)).unwrap();
    setCounterpartyId('');
    setEmployeeId('');
    setReceiptDate(new Date().toISOString().slice(0, 10));
    setNote('');
    setItems([newRow()]);
    dispatch(fetchStockReceipts({ page, limit: DEFAULT_PAGE_SIZE }));
    dispatch(fetchProducts({ limit: MAX_LIST_SIZE }));
  };

  return (
    <div>
      <h1 className="page-title">Prihod (kirim)</h1>
      <form onSubmit={submit} className="form-block" style={{ maxWidth: 900, marginBottom: '1rem' }}>
        <div className="form-row-grid">
          <label className="form-label">
            Kontragent *
            <select className="form-select" value={counterpartyId} onChange={(e) => setCounterpartyId(e.target.value)} required>
              <option value="">Tanlang</option>
              {counterparties.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Sana *
            <input type="date" className="form-input" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} required />
          </label>
        </div>
        <div className="form-row-grid">
          <label className="form-label">
            Javobgar
            <select className="form-select" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
              <option value="">—</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.fullName || `${e.firstName} ${e.lastName}`.trim() || e.login}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Izoh
            <input className="form-input" value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
        </div>

        <h3 className="form-section-title">Mahsulotlar</h3>
        {items.map((row, idx) => (
          <div key={idx} className="form-row-grid" style={{ alignItems: 'end' }}>
            <label className="form-label">
              Mahsulot
              <select
                className="form-select"
                value={row.productId}
                onChange={(e) => {
                  const product = products.find((p) => p.id === e.target.value);
                  setItems((prev) => prev.map((x, i) => i === idx ? {
                    ...x,
                    productId: e.target.value,
                    salePrice: product ? Number(product.price) : x.salePrice,
                  } : x));
                }}
              >
                <option value="">Tanlang</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className="form-label">
              Soni
              <input type="number" min={1} className="form-input" value={row.quantity} onChange={(e) => setItems((prev) => prev.map((x, i) => i === idx ? { ...x, quantity: parseInt(e.target.value, 10) || 0 } : x))} />
            </label>
            <label className="form-label">
              Kirim narxi
              <input type="number" min={0} step={0.01} className="form-input" value={row.purchasePrice || ''} onChange={(e) => setItems((prev) => prev.map((x, i) => i === idx ? { ...x, purchasePrice: parseFloat(e.target.value) || 0 } : x))} />
            </label>
            <label className="form-label">
              Sotuv narxi
              <input type="number" min={0} step={0.01} className="form-input" value={row.salePrice || ''} onChange={(e) => setItems((prev) => prev.map((x, i) => i === idx ? { ...x, salePrice: parseFloat(e.target.value) || 0 } : x))} />
            </label>
            <button type="button" className="btn-secondary" onClick={() => setItems((prev) => prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx))}>O‘chirish</button>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={() => setItems((prev) => [...prev, newRow()])}>+ Qator qo‘shish</button>
        <p className="text-muted form-meta">Jami kirim: {total.toLocaleString()} so‘m</p>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>Saqlash</button>
        </div>
      </form>

      {error && <p className="form-error">{error}</p>}
      {receipts && (
        <>
          <DataTable
            data={receipts.data}
            rowKey={(x) => x.id}
            emptyMessage="Prihod topilmadi."
            columns={[
              { key: 'date', header: 'Sana', render: (x) => x.receiptDate },
              { key: 'cp', header: 'Kontragent', render: (x) => x.counterparty?.name || '—' },
              { key: 'sum', header: 'Jami', render: (x) => `${Number(x.totalAmount).toLocaleString()} so‘m` },
              { key: 'items', header: 'Qatorlar', render: (x) => x.items?.length || 0 },
            ]}
          />
          <Pagination page={receipts.page} totalPages={receipts.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

