import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchContracts } from '../store/slices/contractsSlice';
import Pagination from '../components/Pagination';
import { ROUTES } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { getCustomerDisplayName } from '../types';

export default function ContractsPage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.contracts);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [status, setStatus] = useState('');

  useEffect(() => {
    dispatch(
      fetchContracts({
        page,
        limit: DEFAULT_PAGE_SIZE,
        status: status || undefined,
      })
    );
  }, [dispatch, page, status]);

  const employeeName = (e: { fullName?: string | null; firstName?: string; lastName?: string; login?: string } | undefined) =>
    e ? (e.fullName || [e.firstName, e.lastName].filter(Boolean).join(' ').trim() || e.login || '—') : '—';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Shartnomalar</h1>
        <Link to={ROUTES.CONTRACT_NEW} className="btn-primary">+ Yangi shartnoma</Link>
      </div>

      <div className="filters-row">
        <select
          className="select-field"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">Barcha statuslar</option>
          <option value="draft">Qoralama</option>
          <option value="active">Aktiv</option>
          <option value="completed">Yakunlangan</option>
          <option value="cancelled">Bekor qilindi</option>
        </select>
        <button type="button" className="btn-search" onClick={() => setPage(1)}>
          Filtrlash
        </button>
      </div>

      {loading && <p className="text-loading">Yuklanmoqda…</p>}
      {!loading && list && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Klient</th>
                <th>Kafil</th>
                <th>Muddati</th>
                <th>Javobgar</th>
                <th>Filial</th>
                <th>Jami</th>
                <th>Yaratilgan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((c) => (
                <tr key={c.id}>
                  <td className={"text-[12px]"}>{c.customer ? getCustomerDisplayName(c.customer) : c.customerId}</td>
                  <td className={"text-[12px]"}>{c.guarantor ? getCustomerDisplayName(c.guarantor) : (c.guarantorName ?? '—')}</td>
                  <td className={"text-[12px]"}>{c.termMonths} oy</td>
                  <td className={"text-[12px]"}>{employeeName(c.employee)}</td>
                  <td className={"text-[12px]"}>{c.branch || '—'}</td>
                  <td className={"text-[12px]"}>{Number(c.totalAmount).toLocaleString()} so‘m</td>
                  <td className={"text-[12px]"}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('uz-UZ') : '—'}</td>
                  <td>
                    <span className={`status-badge status-${c.status}`}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.data.length === 0 && (
            <p className="text-empty">Shartnoma topilmadi.</p>
          )}
          <Pagination
            page={list.page}
            totalPages={list.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
