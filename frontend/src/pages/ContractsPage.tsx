import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2 } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchContracts, deleteContract } from '../store/slices/contractsSlice';
import Pagination from '../components/Pagination';
import { ROUTES, contractEditPath } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { getCustomerDisplayName } from '../types';
import DataTable, { TableRowActions } from '../components/DataTable';

export default function ContractsPage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.contracts);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [status, setStatus] = useState('');

  const handleDelete = async (contractId: string) => {
    if (!window.confirm("Haqiqatan ham shartnomani o'chirmoqchimisiz? Bog'liq kvitansiyalar ham o'chadi.")) return;
    try {
      await dispatch(deleteContract(contractId)).unwrap();
      dispatch(
        fetchContracts({
          page,
          limit: DEFAULT_PAGE_SIZE,
          status: status || undefined,
        })
      );
    } catch {
      window.alert("Shartnomani o'chirib bo'lmadi.");
    }
  };

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
          <DataTable
            data={list.data}
            rowKey={(c) => c.id}
            emptyMessage="Shartnoma topilmadi."
            columns={[
              {
                key: 'client',
                header: 'Klient',
                className: 'text-[12px]',
                render: (c) => (c.customer ? getCustomerDisplayName(c.customer) : c.customerId),
              },
              {
                key: 'guarantor',
                header: 'Kafil',
                className: 'text-[12px]',
                render: (c) =>
                  c.guarantor ? getCustomerDisplayName(c.guarantor) : (c.guarantorName ?? '—'),
              },
              { key: 'term', header: 'Muddati', className: 'text-[12px]', render: (c) => `${c.termMonths} oy` },
              {
                key: 'emp',
                header: 'Javobgar',
                className: 'text-[12px]',
                render: (c) => employeeName(c.employee),
              },
              { key: 'branch', header: 'Filial', className: 'text-[12px]', render: (c) => c.branch || '—' },
              {
                key: 'total',
                header: 'Jami',
                className: 'text-[12px]',
                render: (c) => `${Number(c.totalAmount).toLocaleString()} so‘m`,
              },
              {
                key: 'created',
                header: 'Yaratilgan',
                className: 'text-[12px]',
                render: (c) =>
                  c.createdAt ? new Date(c.createdAt).toLocaleDateString('uz-UZ') : '—',
              },
              {
                key: 'status',
                header: 'Status',
                render: (c) => <span className={`status-badge status-${c.status}`}>{c.status}</span>,
              },
              {
                key: 'actions',
                header: 'Amallar',
                render: (c) => (
                  <TableRowActions>
                    <Link
                      className="text-blue-600 rounded-lg transition-colors"
                      title="Tahrirlash"
                      to={contractEditPath(c.id)}
                    >
                      <FiEdit2 size={18} />
                    </Link>
                    <button
                      type="button"
                      className="text-red-600 rounded-lg transition-colors bg-transparent border-0 cursor-pointer p-0"
                      title="O'chirish"
                      onClick={() => handleDelete(c.id)}
                    >
                      <MdDeleteOutline size={18} />
                    </button>
                  </TableRowActions>
                ),
              },
            ]}
          />
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
