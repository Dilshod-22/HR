import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2 } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchReceipts } from '../store/slices/receiptsSlice';
import Pagination from '../components/Pagination';
import { ROUTES, receiptEditPath } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { getCustomerDisplayName, PAYMENT_METHOD_LABELS } from '../types';
import DataTable from '../components/DataTable';

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
          <DataTable
            data={list.data}
            rowKey={(r) => r.id}
            emptyMessage="Kvitansiya yo‘q."
            columns={[
              {
                key: 'date',
                header: 'Sana',
                render: (r) => (r.paidAt ? new Date(r.paidAt).toLocaleDateString('uz-UZ') : '—'),
              },
              { key: 'num', header: 'Raqam', render: (r) => r.receiptNumber },
              {
                key: 'contract',
                header: 'Shartnoma',
                className: 'text-muted',
                render: (r) => {
                  const c = r.contract;
                  return `${(c?.id ?? r.contractId).slice(0, 8)}…`;
                },
              },
              {
                key: 'customer',
                header: 'Mijoz',
                render: (r) =>
                  r.contract?.customer ? getCustomerDisplayName(r.contract.customer) : '—',
              },
              {
                key: 'month',
                header: 'Oy',
                render: (r) => (r.paymentSchedule ? `${r.paymentSchedule.monthNumber}-oy` : '—'),
              },
              {
                key: 'pm',
                header: 'To‘lov turi',
                render: (r) => {
                  const pm = r.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS | null;
                  return pm && PAYMENT_METHOD_LABELS[pm] ? PAYMENT_METHOD_LABELS[pm] : '—';
                },
              },
              {
                key: 'amount',
                header: 'Summa',
                render: (r) => `${Number(r.amount).toLocaleString()} so‘m`,
              },
              {
                key: 'branch',
                header: 'Filial',
                render: (r) => r.contract?.branch || '—',
              },
              {
                key: 'emp',
                header: 'Javobgar',
                render: (r) => employeeLabel(r.contract?.employee),
              },
              {
                key: 'actions',
                header: 'Harakat',
                render: (r) => (
                  <Link
                    to={receiptEditPath(r.id)}
                    className="text-blue-600 inline-flex items-center gap-1"
                    title="Tahrirlash"
                  >
                    <FiEdit2 size={18} />
                  </Link>
                ),
              },
            ]}
          />
          <Pagination page={list.page} totalPages={list.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
