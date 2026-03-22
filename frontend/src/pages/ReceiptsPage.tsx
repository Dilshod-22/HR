import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2 } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchReceipts } from '../store/slices/receiptsSlice';
import Pagination from '../components/Pagination';
import { ROUTES, receiptEditPath } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { getCustomerDisplayName, PAYMENT_METHOD_LABELS } from '../types';

function employeeLabel(e: { fullName?: string | null; firstName?: string; lastName?: string; login?: string } | undefined) {
  if (!e) return '—';
  return e.fullName || [e.firstName, e.lastName].filter(Boolean).join(' ').trim() || e.login || '—';
}

export default function ReceiptsPage() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s) => s.receipts);
  const [page, setPage] = useState(DEFAULT_PAGE);

  useEffect(() => {
    dispatch(fetchReceipts({ page, limit: DEFAULT_PAGE_SIZE }));
  }, [dispatch, page]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Kvitansiyalar</h1>
        <Link to={ROUTES.RECEIPT_NEW} className="btn-primary">
          + Yangi kvitansiya
        </Link>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}
      {loading && <p className="text-loading">Yuklanmoqda…</p>}

      {!loading && list && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Sana</th>
                <th>Raqam</th>
                <th>Shartnoma</th>
                <th>Mijoz</th>
                <th>Oy</th>
                <th>To‘lov turi</th>
                <th>Summa</th>
                <th>Filial</th>
                <th>Javobgar</th>
                <th>Harakat</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((r) => {
                const c = r.contract;
                const pm = r.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS | null;
                return (
                  <tr key={r.id}>
                    <td>{r.paidAt ? new Date(r.paidAt).toLocaleDateString('uz-UZ') : '—'}</td>
                    <td>{r.receiptNumber}</td>
                    <td className="text-muted">{c?.id?.slice(0, 8) ?? r.contractId.slice(0, 8)}…</td>
                    <td>{c?.customer ? getCustomerDisplayName(c.customer) : '—'}</td>
                    <td>{r.paymentSchedule ? `${r.paymentSchedule.monthNumber}-oy` : '—'}</td>
                    <td>{pm && PAYMENT_METHOD_LABELS[pm] ? PAYMENT_METHOD_LABELS[pm] : '—'}</td>
                    <td>{Number(r.amount).toLocaleString()} so‘m</td>
                    <td>{c?.branch || '—'}</td>
                    <td>{employeeLabel(c?.employee)}</td>
                    <td>
                      <Link
                        to={receiptEditPath(r.id)}
                        className="text-blue-600 inline-flex items-center gap-1"
                        title="Tahrirlash"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {list.data.length === 0 && <p className="text-empty">Kvitansiya yo‘q.</p>}
          <Pagination page={list.page} totalPages={list.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
