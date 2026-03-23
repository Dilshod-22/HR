import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchProductGroups,
  createProductGroup,
  updateProductGroup,
  deleteProductGroup,
} from '../store/slices/productGroupsSlice';
import DataTable, { TableRowActions } from '../components/DataTable';
import { FiEdit2 } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';

export default function ProductGroupsPage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.productGroups);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchProductGroups());
  }, [dispatch]);

  const reset = () => {
    setEditingId(null);
    setName('');
    setDescription('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const body = { name: name.trim(), description: description.trim() || undefined };
    if (editingId) await dispatch(updateProductGroup({ id: editingId, body }));
    else await dispatch(createProductGroup(body));
    reset();
  };

  return (
    <div>
      <h1 className="page-title">Mahsulot guruhlari</h1>
      <form onSubmit={submit} className="form-block" style={{ maxWidth: 680, marginBottom: '1rem' }}>
        <div className="form-row-grid">
          <label className="form-label">
            Nomi *
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="form-label">
            Izoh
            <input className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
        </div>
        <div className="form-actions">
          <button className="btn-primary" disabled={loading} type="submit">
            {editingId ? 'Saqlash' : 'Qo‘shish'}
          </button>
          {editingId && (
            <button className="btn-secondary" type="button" onClick={reset}>
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      <DataTable
        data={list}
        rowKey={(x) => x.id}
        emptyMessage="Guruh topilmadi."
        columns={[
          { key: 'name', header: 'Nomi', render: (x) => x.name },
          { key: 'desc', header: 'Izoh', render: (x) => x.description || '—' },
          {
            key: 'actions',
            header: 'Amallar',
            render: (x) => (
              <TableRowActions>
                <button
                  type="button"
                  className="text-blue-600 bg-transparent border-0 p-0"
                  onClick={() => {
                    setEditingId(x.id);
                    setName(x.name);
                    setDescription(x.description || '');
                  }}
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  type="button"
                  className="text-red-600 bg-transparent border-0 p-0"
                  onClick={async () => {
                    if (!window.confirm('O‘chirasizmi?')) return;
                    await dispatch(deleteProductGroup(x.id));
                  }}
                >
                  <MdDeleteOutline size={18} />
                </button>
              </TableRowActions>
            ),
          },
        ]}
      />
    </div>
  );
}

