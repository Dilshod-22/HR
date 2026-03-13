import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchCustomers } from '../store/slices/customersSlice';
import Pagination from '../components/Pagination';
import type { CustomerFilters } from '../types';
import { ROUTES, customerEditPath } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.customers);
  const [filters, setFilters] = useState<CustomerFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers(filters));
    console.log(list);
  }, [dispatch, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput || undefined, page: 1 }));
  };

  const deleteHandler = async(id:any) => {

    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;

    try {
      const response = await fetch(`http://localhost:3001/customers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Serverdan muvaffaqiyatli o'chsa, UI-dan ham olib tashlaymiz
        dispatch(fetchCustomers(filters));
        console.log("Muvaffaqiyatli o'chirildi");
      } else {
        console.error("O'chirishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Tarmoq xatosi:", error);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mijozlar</h1>
        <Link to={ROUTES.CUSTOMER_NEW} className="btn-primary">+ Yangi mijoz</Link>
      </div>

      <form onSubmit={handleSearch} className="filters-row">
        <input
          type="text"
          placeholder="Qidirish (nom, email, tel)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input-text"
        />
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-') as [CustomerFilters['sortBy'], 'ASC' | 'DESC'];
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
          <option value="email-ASC">Email A–Z</option>
          <option value="email-DESC">Email Z–A</option>
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
                <th>Tug'ilgan sana</th>
                <th>Telefon</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((c) => (
                <tr key={c.id}>
                  <td>{c.fullName || `${c.firstName} ${c.lastName}`.trim() || '—'}</td>
                  <td>{c.birthDate || '—'}</td>
                  <td>{c.phone || '—'}</td>
                  <td className={"flex gap-2"}>
                    <Link to={customerEditPath(c.id)} className="link-action">✏️</Link>
                    <button onClick={()=>deleteHandler(c.id)} >🗑️</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          {list.data.length === 0 && (
            <p className="text-empty">Mijoz topilmadi.</p>
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
