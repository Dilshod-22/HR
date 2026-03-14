import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchEmployees, deleteEmployee } from '../store/slices/employeesSlice';
import Pagination from '../components/Pagination';
import type { EmployeeFilters } from '../types';
import { ROUTES, employeeEditPath } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';

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
          <table className="data-table">
            <thead>
              <tr>
                <th>Ism / Familiya</th>
                <th>Login</th>
                <th>Telefon</th>
                <th>PNFL</th>
                <th>Tug‘ilgan sana</th>
                <th>Passport</th>
                <th>Yaratilgan</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((e) => (
                <tr key={e.id}>
                  <td>{fullName(e)}</td>
                  <td>{e.login}</td>
                  <td>{e.phone || '—'}</td>
                  <td>{e.pnfl || '—'}</td>
                  <td>{e.birthDate || '—'}</td>
                  <td>{[e.passportSeries, e.passportNumber].filter(Boolean).join(' ') || '—'}</td>
                  <td>{e.createdAt ? new Date(e.createdAt).toLocaleDateString('uz-UZ') : '—'}</td>
                  <td className="flex gap-2">
                    <Link to={employeeEditPath(e.id)} className="link-action">✏️</Link>
                    <button type="button" onClick={() => handleDelete(e.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.data.length === 0 && (
            <p className="text-empty">Hodim topilmadi.</p>
          )}
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
