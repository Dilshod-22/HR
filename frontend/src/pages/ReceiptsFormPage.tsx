import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchContracts } from '../store/slices/contractsSlice';
import {
  createReceipt,
  fetchReceiptById,
  updateReceipt,
  clearCurrentReceipt,
} from '../store/slices/receiptsSlice';
import { api } from '../api/client';
import { ROUTES } from '../constants/routes';
import { MAX_LIST_SIZE } from '../constants/pagination';
import type { Contract } from '../types';
import { getCustomerDisplayName, PAYMENT_METHOD_LABELS } from '../types';

const PAYMENT_OPTIONS = [
  { value: '', label: 'Tanlang' },
  { value: 'cash', label: PAYMENT_METHOD_LABELS.cash },
  { value: 'card', label: PAYMENT_METHOD_LABELS.card },
  { value: 'bank', label: PAYMENT_METHOD_LABELS.bank },
] as const;

export default function ReceiptsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list: contractsList } = useAppSelector((s) => s.contracts);
  const { current: receipt, loading, error } = useAppSelector((s) => s.receipts);

  const [contractId, setContractId] = useState('');
  const [paymentScheduleId, setPaymentScheduleId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank' | ''>('');
  const [notes, setNotes] = useState('');
  const [contractDetail, setContractDetail] = useState<Contract | null>(null);
  const [editLoading, setEditLoading] = useState(isEdit);

  useEffect(() => {
    dispatch(fetchContracts({ limit: MAX_LIST_SIZE }));
  }, [dispatch]);

  useEffect(() => {
    if (!isEdit || !id) {
      setEditLoading(false);
      return;
    }
    setEditLoading(true);
    dispatch(fetchReceiptById(id))
      .unwrap()
      .catch(() => {})
      .finally(() => setEditLoading(false));
    return () => {
      dispatch(clearCurrentReceipt());
    };
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (!isEdit || !receipt) return;
    setPaymentMethod(
      receipt.paymentMethod === 'cash' || receipt.paymentMethod === 'card' || receipt.paymentMethod === 'bank'
        ? receipt.paymentMethod
        : ''
    );
    setNotes(receipt.notes ?? '');
  }, [isEdit, receipt]);

  useEffect(() => {
    if (isEdit) return;
    if (!contractId) {
      setContractDetail(null);
      setPaymentScheduleId('');
      setAmount(0);
      return;
    }
    let cancelled = false;
    api
      .get<Contract>(`/contracts/${contractId}`)
      .then(({ data }) => {
        if (!cancelled) setContractDetail(data);
      })
      .catch(() => {
        if (!cancelled) setContractDetail(null);
      });
    return () => {
      cancelled = true;
    };
  }, [contractId, isEdit]);

  const pendingSchedules = useMemo(() => {
    if (!contractDetail?.paymentSchedule) return [];
    return contractDetail.paymentSchedule.filter((s) => s.status === 'pending');
  }, [contractDetail]);

  const onScheduleChange = useCallback(
    (scheduleId: string) => {
      setPaymentScheduleId(scheduleId);
      const row = contractDetail?.paymentSchedule?.find((s) => s.id === scheduleId);
      if (row) setAmount(Number(row.amount));
    },
    [contractDetail]
  );

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!contractId || !paymentScheduleId || amount <= 0) return;
      try {
        await dispatch(
          createReceipt({
            contractId,
            paymentScheduleId,
            amount,
            paymentMethod: paymentMethod || undefined,
            notes: notes.trim() || undefined,
          })
        ).unwrap();
        navigate(ROUTES.RECEIPTS);
      } catch {
        /* error in slice */
      }
    },
    [contractId, paymentScheduleId, amount, paymentMethod, notes, dispatch, navigate]
  );

  const handleUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!id) return;
      try {
        await dispatch(
          updateReceipt({
            id,
            body: {
              paymentMethod: paymentMethod || null,
              notes: notes.trim() || null,
            },
          })
        ).unwrap();
        navigate(ROUTES.RECEIPTS);
      } catch {
        /* error in slice */
      }
    },
    [id, paymentMethod, notes, dispatch, navigate]
  );

  const contracts = contractsList?.data ?? [];

  if (isEdit && editLoading) {
    return <p className="text-loading">Yuklanmoqda…</p>;
  }

  if (isEdit && id && !receipt && !editLoading) {
    return (
      <div>
        <p className="form-error">Kvitansiya topilmadi.</p>
        <Link to={ROUTES.RECEIPTS}>Ro‘yxatga qaytish</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">{isEdit ? 'Kvitansiyani tahrirlash' : 'Yangi kvitansiya'}</h1>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {!isEdit && (
        <form onSubmit={handleCreate} className="form-block" style={{ maxWidth: 640 }}>
          <label className="form-label">
            Shartnoma *
            <select
              className="form-select"
              value={contractId}
              onChange={(e) => {
                setContractId(e.target.value);
                setPaymentScheduleId('');
                setAmount(0);
              }}
              required
            >
              <option value="">Tanlang</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer ? getCustomerDisplayName(c.customer) : c.id} — {c.termMonths} oy
                  {c.branch ? ` (${c.branch})` : ''}
                </option>
              ))}
            </select>
          </label>

          {contractDetail && (
            <>
              <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <p className="text-muted form-meta">
                  <strong>Mijoz:</strong>{' '}
                  {contractDetail.customer ? getCustomerDisplayName(contractDetail.customer) : '—'}
                </p>
                <p className="text-muted form-meta">
                  <strong>Filial:</strong> {contractDetail.branch || '—'}
                </p>
              </div>

              <label className="form-label">
                To‘lov grafigi (kutilayotgan oy) *
                <select
                  className="form-select"
                  value={paymentScheduleId}
                  onChange={(e) => onScheduleChange(e.target.value)}
                  required
                  disabled={pendingSchedules.length === 0}
                >
                  <option value="">
                    {pendingSchedules.length === 0 ? 'Kutilayotgan to‘lov yo‘q' : 'Tanlang'}
                  </option>
                  {pendingSchedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.monthNumber}-oy — {new Date(s.dueDate).toLocaleDateString('uz-UZ')} —{' '}
                      {Number(s.amount).toLocaleString()} so‘m
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-label">
                Summa (so‘m) *
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="form-input"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                />
              </label>
            </>
          )}

          <div className="border border-gray-200 rounded-lg p-4 mb-6" style={{ borderColor: 'var(--border-color, #e5e7eb)' }}>
            <h2 className="form-section-title">To‘lov tafsilotlari</h2>
            <label className="form-label">
              To‘lov turi
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
              >
                {PAYMENT_OPTIONS.map((o) => (
                  <option key={o.value || 'empty'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-label">
              Izoh
              <textarea
                className="form-input"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ixtiyoriy"
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading || !contractId || !paymentScheduleId || amount <= 0}
              className="btn-primary"
            >
              {loading ? 'Saqlanmoqda…' : 'Yaratish'}
            </button>
            <Link to={ROUTES.RECEIPTS} className="btn-secondary">
              Bekor qilish
            </Link>
          </div>
        </form>
      )}

      {isEdit && receipt && (
        <form onSubmit={handleUpdate} className="form-block" style={{ maxWidth: 640 }}>
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <label className="form-label">
              Kvitansiya raqami
              <input className="form-input" readOnly value={receipt.receiptNumber} />
            </label>
            <label className="form-label">
              To‘langan sana
              <input
                className="form-input"
                readOnly
                value={receipt.paidAt ? new Date(receipt.paidAt).toLocaleString('uz-UZ') : ''}
              />
            </label>
          </div>

          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <p className="text-muted form-meta">
              <strong>Mijoz:</strong>{' '}
              {receipt.contract?.customer
                ? getCustomerDisplayName(receipt.contract.customer)
                : '—'}
            </p>
            <p className="text-muted form-meta">
              <strong>Filial:</strong> {receipt.contract?.branch || '—'}
            </p>
          </div>

          <label className="form-label">
            Summa (so‘m)
            <input className="form-input" readOnly value={Number(receipt.amount).toLocaleString()} />
          </label>

          <label className="form-label">
            Oy
            <input
              className="form-input"
              readOnly
              value={
                receipt.paymentSchedule
                  ? `${receipt.paymentSchedule.monthNumber}-oy (${receipt.paymentSchedule.dueDate})`
                  : '—'
              }
            />
          </label>

          <div className="border border-gray-200 rounded-lg p-4 mb-6" style={{ borderColor: 'var(--border-color, #e5e7eb)' }}>
            <h2 className="form-section-title">Tahrirlanadigan maydonlar</h2>
            <label className="form-label">
              To‘lov turi
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
              >
                {PAYMENT_OPTIONS.map((o) => (
                  <option key={o.value || 'empty'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-label">
              Izoh
              <textarea
                className="form-input"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saqlanmoqda…' : 'Saqlash'}
            </button>
            <Link to={ROUTES.RECEIPTS} className="btn-secondary">
              Bekor qilish
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
