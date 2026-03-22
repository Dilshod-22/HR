import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchEmployees, deleteEmployee } from '../store/slices/employeesSlice';
import Pagination from '../components/Pagination';
import type { EmployeeFilters } from '../types';
import { ROUTES, employeeEditPath } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { FiEdit2 } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import DataTable, { TableRowActions } from '../components/DataTable';

export default function EmployeesPage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.employees);
  const [filters, setFilters] = useState<EmployeeFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees(filters));
  }, [dispatch, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput || undefined, page: 1 }));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    await dispatch(deleteEmployee(id));
    dispatch(fetchEmployees(filters));
  };

  const fullName = (e: { fullName: string | null; firstName: string; lastName: string }) =>
    e.fullName?.trim() || [e.firstName, e.lastName].filter(Boolean).join(' ').trim() || '—';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hodimlar</h1>
        <Link to={ROUTES.EMPLOYEE_NEW} className="btn-primary">+ Yangi hodim</Link>
      </div>

      <form onSubmit={handleSearch} className="filters-row">
        <input
          type="text"
          placeholder="Qidirish (ism, login, telefon, PNFL, passport)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input-text"
        />
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-') as [EmployeeFilters['sortBy'], 'ASC' | 'DESC'];
            setFilters((f) => ({ ...f, sortBy, sortOrder, page: 1 }));
          }}
          className="select-field"
        >
          <option value="createdAt-DESC">Yangi avval</option>
          <option value="createdAt-ASC">Eski avval</option>
          <option value="firstName-ASC">Ism A–Z</option>
          <option value="firstName-DESC">Ism Z–A</option>
          <option value="fullName-ASC">To‘liq nom A–Z</option>
          <option value="fullName-DESC">To‘liq nom Z–A</option>
          <option value="login-ASC">Login A–Z</option>
          <option value="login-DESC">Login Z–A</option>
        </select>
        <button type="submit" className="btn-search">Qidirish</button>
      </form>

      {loading && <p className="text-loading">Yuklanmoqda…</p>}
      {!loading && list && (
        <>
          <DataTable
            data={list.data}
            rowKey={(e) => e.id}
            emptyMessage="Hodim topilmadi."
            columns={[
              { key: 'name', header: 'Ism / Familiya', render: (e) => fullName(e) },
              { key: 'login', header: 'Login', render: (e) => e.login },
              { key: 'phone', header: 'Telefon', render: (e) => e.phone || '—' },
              { key: 'pnfl', header: 'PNFL', render: (e) => e.pnfl || '—' },
              { key: 'birth', header: 'Tug‘ilgan sana', render: (e) => e.birthDate || '—' },
              {
                key: 'passport',
                header: 'Passport',
                render: (e) => [e.passportSeries, e.passportNumber].filter(Boolean).join(' ') || '—',
              },
              {
                key: 'created',
                header: 'Yaratilgan',
                render: (e) => (e.createdAt ? new Date(e.createdAt).toLocaleDateString('uz-UZ') : '—'),
              },
              {
                key: 'actions',
                header: 'Amallar',
                render: (e) => (
                  <TableRowActions>
                    <Link
                      className="text-blue-600 rounded-lg transition-colors"
                      title="Tahrirlash"
                      to={employeeEditPath(e.id)}
                    >
                      <FiEdit2 size={18} />
                    </Link>
                    <button
                      type="button"
                      className="text-red-600 rounded-lg transition-colors bg-transparent border-0 cursor-pointer p-0"
                      title="O'chirish"
                      onClick={() => handleDelete(e.id)}
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
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </>
      )}
    </div>
  );
}
