import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDeleteOutline } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchProducts, deleteProduct } from '../store/slices/productsSlice';
import Pagination from '../components/Pagination';
import type { ProductFilters } from '../types';
import { ROUTES, productEditPath } from '../constants/routes';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { FiEdit2 } from 'react-icons/fi';
import DataTable from '../components/DataTable';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`«${name}» mahsulotini o‘chirishni tasdiqlaysizmi?`)) return;
    setDeletingId(id);
    try {
      await dispatch(deleteProduct(id)).unwrap();
      dispatch(fetchProducts(filters));
    } catch {
      window.alert('Mahsulotni o‘chirib bo‘lmadi. Boshqa joyda ishlatilayotgan bo‘lishi mumkin.');
    } finally {
      setDeletingId(null);
    }
  };

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
          <DataTable
            data={list.data}
            rowKey={(p) => p.id}
            emptyMessage="Mahsulot topilmadi."
            columns={[
              {
                key: 'image',
                header: 'Rasm',
                render: (p) =>
                  p.imageUrl ? (
                    <img src={p.imageUrl} alt="" className="td-img" />
                  ) : (
                    <span className="text-muted">—</span>
                  ),
              },
              { key: 'name', header: 'Nom', render: (p) => p.name },
              { key: 'group', header: 'Guruh', render: (p) => p.group?.name || '—' },
              { key: 'stock', header: 'Qoldiq', render: (p) => p.stockQty ?? 0 },
              {
                key: 'price',
                header: 'Narx',
                render: (p) => `${Number(p.price).toLocaleString()} so‘m`,
              },
              {
                key: 'actions',
                header: 'Amallar',
                render: (p) => (
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link to={productEditPath(p.id)} className="link-action">
                      <FiEdit2 size={18} />
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-red-600 hover:opacity-80 bg-transparent border-0 cursor-pointer p-0"
                      title="O‘chirish"
                      disabled={deletingId === p.id}
                      onClick={() => handleDelete(p.id, p.name)}
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </div>
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
