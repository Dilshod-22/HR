import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchProducts } from '../store/slices/productsSlice';
import Pagination from '../components/Pagination';
import type { ProductFilters } from '../types';
import { ROUTES, productEditPath } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.products);
  const [filters, setFilters] = useState<ProductFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput || undefined, page: 1 }));
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mahsulotlar</h1>
        <Link to={ROUTES.PRODUCT_NEW} className="btn-primary">+ Yangi mahsulot</Link>
      </div>

      <form onSubmit={handleSearch} className="filters-row">
        <input
          type="text"
          placeholder="Qidirish (nom, tavsif)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input-text"
        />
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-') as [ProductFilters['sortBy'], 'ASC' | 'DESC'];
            setFilters((f) => ({ ...f, sortBy, sortOrder, page: 1 }));
          }}
          className="select-field"
        >
          <option value="createdAt-DESC">Yangi avval</option>
          <option value="createdAt-ASC">Eski avval</option>
          <option value="name-ASC">Nom A–Z</option>
          <option value="name-DESC">Nom Z–A</option>
          <option value="price-ASC">Arzon qimmat</option>
          <option value="price-DESC">Qimmat arzon</option>
        </select>
        <button type="submit" className="btn-search">Qidirish</button>
      </form>

      {loading && <p className="text-loading">Yuklanmoqda…</p>}
      {!loading && list && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rasm</th>
                <th>Nom</th>
                <th>Narx</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt="" className="td-img" />
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{Number(p.price).toLocaleString()} so‘m</td>
                  <td>
                    <Link to={productEditPath(p.id)} className="link-action">Tahrirlash</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.data.length === 0 && (
            <p className="text-empty">Mahsulot topilmadi.</p>
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
