import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchCustomers } from '../store/slices/customersSlice';
import Pagination from '../components/Pagination';
import type { CustomerFilters } from '../types';
import { ROUTES, customerEditPath } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { FiEdit2 } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import DataTable, { TableRowActions } from '../components/DataTable';

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
          <DataTable
            data={list.data}
            rowKey={(c) => c.id}
            emptyMessage="Mijoz topilmadi."
            columns={[
              {
                key: 'name',
                header: 'Ism / Familiya',
                render: (c) => c.fullName || `${c.firstName} ${c.lastName}`.trim() || '—',
              },
              { key: 'birth', header: "Tug'ilgan sana", render: (c) => c.birthDate || '—' },
              { key: 'phone', header: 'Telefon', render: (c) => c.phone || '—' },
              {
                key: 'actions',
                header: 'Amallar',
                render: (c) => (
                  <TableRowActions>
                    <Link
                      className="text-blue-600 rounded-lg transition-colors"
                      title="Tahrirlash"
                      to={customerEditPath(c.id)}
                    >
                      <FiEdit2 size={18} />
                    </Link>
                    <button
                      type="button"
                      className="text-red-600 rounded-lg transition-colors bg-transparent border-0 cursor-pointer p-0"
                      title="O'chirish"
                      onClick={() => deleteHandler(c.id)}
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
