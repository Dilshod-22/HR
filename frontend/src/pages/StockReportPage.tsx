import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchStockReport } from '../store/slices/stockSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchProductGroups } from '../store/slices/productGroupsSlice';
import { MAX_LIST_SIZE } from '../constants/pagination';
import DataTable from '../components/DataTable';

export default function StockReportPage() {
  const dispatch = useAppDispatch();
  const { report, loading } = useAppSelector((s) => s.stock);
  const { list: productsList } = useAppSelector((s) => s.products);
  const { list: groups } = useAppSelector((s) => s.productGroups);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [productId, setProductId] = useState('');
  const [groupId, setGroupId] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ limit: MAX_LIST_SIZE }));
    dispatch(fetchProductGroups());
    dispatch(fetchStockReport({}));
  }, [dispatch]);

  const products = productsList?.data ?? [];

  const grouped = useMemo(() => {
    const map = new Map<string, { qty: number; amount: number }>();
    for (const row of report) {
      const key = row.groupName || 'Guruhsiz';
      const prev = map.get(key) || { qty: 0, amount: 0 };
      prev.qty += Number(row.stockQty);
      prev.amount += Number(row.stockQty) * Number(row.currentPurchasePrice);
      map.set(key, prev);
    }
    return Array.from(map.entries()).map(([groupName, val]) => ({
      groupName,
      stockQty: val.qty,
      stockAmount: val.amount,
    }));
  }, [report]);

  const applyFilters = () => {
    dispatch(fetchStockReport({ fromDate: fromDate || undefined, toDate: toDate || undefined, productId: productId || undefined, groupId: groupId || undefined }));
  };

  return (
    <div>
      <h1 className="page-title">Sklad report</h1>
      <div className="filters-row">
        <input type="date" className="input-text" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" className="input-text" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <select className="select-field" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
          <option value="">Barcha guruhlar</option>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select className="select-field" value={productId} onChange={(e) => setProductId(e.target.value)}>
          <option value="">Barcha mahsulotlar</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button className="btn-search" type="button" onClick={applyFilters}>Filtrlash</button>
      </div>

      {loading && <p className="text-loading">Yuklanmoqda…</p>}
      {!loading && (
        <>
          <h3 className="form-section-title">Guruh bo‘yicha qoldiq</h3>
          <DataTable
            data={grouped}
            rowKey={(x) => x.groupName}
            emptyMessage="Ma’lumot yo‘q."
            columns={[
              { key: 'group', header: 'Guruh', render: (x) => x.groupName },
              { key: 'qty', header: 'Qoldiq soni', render: (x) => x.stockQty },
              { key: 'amount', header: 'Qoldiq summasi', render: (x) => `${x.stockAmount.toLocaleString()} so‘m` },
            ]}
          />
          <h3 className="form-section-title" style={{ marginTop: '1rem' }}>Mahsulot bo‘yicha qoldiq</h3>
          <DataTable
            data={report}
            rowKey={(x) => x.productId}
            emptyMessage="Ma’lumot yo‘q."
            columns={[
              { key: 'name', header: 'Mahsulot', render: (x) => x.productName },
              { key: 'group', header: 'Guruh', render: (x) => x.groupName || '—' },
              { key: 'stock', header: 'Qoldiq', render: (x) => x.stockQty },
              { key: 'purchase', header: 'Kirim narxi', render: (x) => `${Number(x.currentPurchasePrice).toLocaleString()} so‘m` },
              { key: 'sale', header: 'Sotuv narxi', render: (x) => `${Number(x.currentSalePrice).toLocaleString()} so‘m` },
              { key: 'inQty', header: 'Davrda kirim soni', render: (x) => x.incomingQtyInPeriod },
            ]}
          />
        </>
      )}
    </div>
  );
}

