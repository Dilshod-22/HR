import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchCounterparties,
  createCounterparty,
  updateCounterparty,
  deleteCounterparty,
} from '../store/slices/counterpartiesSlice';
import DataTable, { TableRowActions } from '../components/DataTable';
import { FiEdit2 } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';

export default function CounterpartiesPage() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s) => s.counterparties);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tin, setTin] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    dispatch(fetchCounterparties());
  }, [dispatch]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setTin('');
    setAddress('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const body = {
      name: name.trim(),
      phone: phone.trim() || undefined,
      tin: tin.trim() || undefined,
      address: address.trim() || undefined,
    };
    if (editingId) await dispatch(updateCounterparty({ id: editingId, body }));
    else await dispatch(createCounterparty(body));
    resetForm();
  };

  return (
    <div>
      <h1 className="page-title">Kontragentlar (yuk beruvchilar)</h1>
      <form onSubmit={handleSubmit} className="form-block" style={{ maxWidth: 680, marginBottom: '1rem' }}>
        <div className="form-row-grid">
          <label className="form-label">
            Nomi *
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="form-label">
            Telefon
            <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
        </div>
        <div className="form-row-grid">
          <label className="form-label">
            STIR
            <input className="form-input" value={tin} onChange={(e) => setTin(e.target.value)} />
          </label>
          <label className="form-label">
            Manzil
            <input className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
        </div>
        <div className="form-actions">
          <button className="btn-primary" disabled={loading} type="submit">
            {editingId ? 'Saqlash' : 'Qo‘shish'}
          </button>
          {editingId && (
            <button className="btn-secondary" type="button" onClick={resetForm}>
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      {error && <p className="form-error">{error}</p>}
      {loading && <p className="text-loading">Yuklanmoqda…</p>}
      {!loading && (
        <DataTable
          data={list}
          rowKey={(x) => x.id}
          emptyMessage="Kontragent topilmadi."
          columns={[
            { key: 'name', header: 'Nomi', render: (x) => x.name },
            { key: 'phone', header: 'Telefon', render: (x) => x.phone || '—' },
            { key: 'tin', header: 'STIR', render: (x) => x.tin || '—' },
            { key: 'address', header: 'Manzil', render: (x) => x.address || '—' },
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
                      setPhone(x.phone || '');
                      setTin(x.tin || '');
                      setAddress(x.address || '');
                    }}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    type="button"
                    className="text-red-600 bg-transparent border-0 p-0"
                    onClick={async () => {
                      if (!window.confirm('O‘chirasizmi?')) return;
                      await dispatch(deleteCounterparty(x.id));
                    }}
                  >
                    <MdDeleteOutline size={18} />
                  </button>
                </TableRowActions>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}

