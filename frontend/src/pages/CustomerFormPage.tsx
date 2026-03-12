import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchCustomerById,
  createCustomer,
  updateCustomer,
  clearCurrent,
} from '../store/slices/customersSlice';
import { ROUTES } from '../constants/routes';

export default function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { current, loading } = useAppSelector((s) => s.customers);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passportSeries, setPassportSeries] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) dispatch(fetchCustomerById(id));
    return () => { dispatch(clearCurrent()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (current) {
      setFirstName(current.firstName);
      setLastName(current.lastName ?? '');
      setEmail(current.email ?? '');
      setPhone(current.phone ?? '');
      setPassportSeries(current.passportSeries ?? '');
      setPassportNumber(current.passportNumber ?? '');
      setRegion(current.region ?? '');
      setDistrict(current.district ?? '');
      setAddress(current.address ?? '');
      setWorkplace(current.workplace ?? '');
      setBirthDate(current.birthDate ?? '');
    }
  }, [current]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) return;

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      passportSeries: passportSeries.trim() || undefined,
      passportNumber: passportNumber.trim() || undefined,
      region: region.trim() || undefined,
      district: district.trim() || undefined,
      address: address.trim() || undefined,
      workplace: workplace.trim() || undefined,
      birthDate: birthDate || undefined,
    };

    if (isEdit && id) {
      await dispatch(updateCustomer({ id, body: payload }));
    } else {
      await dispatch(createCustomer(payload));
    }
    navigate(ROUTES.CUSTOMERS);
  };

  return (
    <div>
      <h1 className="page-title">{isEdit ? 'Mijozni tahrirlash' : 'Yangi mijoz (klient)'}</h1>
      <form onSubmit={handleSubmit} className="form-block">
        <div className="form-row-grid">
          <label className="form-label">
            Ism *
            <input
              className="form-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            Familiya
            <input
              className="form-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <h3 className="form-section-title">Passport</h3>
        <div className="form-row-grid">
          <label className="form-label">
            Seriya
            <input
              className="form-input"
              value={passportSeries}
              onChange={(e) => setPassportSeries(e.target.value)}
            />
          </label>
          <label className="form-label">
            Raqam
            <input
              className="form-input"
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
            />
          </label>
        </div>
        <label className="form-label">
          Viloyat
          <input
            className="form-input"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </label>
        <label className="form-label">
          Shahar / tuman
          <input
            className="form-input"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </label>
        <label className="form-label">
          Manzil
          <textarea
            className="form-textarea"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
          />
        </label>
        <label className="form-label">
          Ish joyi
          <input
            className="form-input"
            value={workplace}
            onChange={(e) => setWorkplace(e.target.value)}
          />
        </label>
        <label className="form-label">
          Tug‘ilgan sana
          <input
            type="date"
            className="form-input"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </label>
        <label className="form-label">
          Email
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="form-label">
          Telefon
          <input
            className="form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        {isEdit && current?.createdAt && (
          <p className="text-muted form-meta">
            Yaratilgan sana: {new Date(current.createdAt).toLocaleDateString('uz-UZ')}
          </p>
        )}
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saqlanmoqda…' : isEdit ? 'Saqlash' : 'Yaratish'}
          </button>
          <button type="button" onClick={() => navigate(ROUTES.CUSTOMERS)} className="btn-secondary">
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  );
}
