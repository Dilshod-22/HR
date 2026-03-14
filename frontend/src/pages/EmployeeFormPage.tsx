import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  clearCurrent,
} from '../store/slices/employeesSlice';
import { ROUTES } from '../constants/routes';

export default function EmployeeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { current, loading } = useAppSelector((s) => s.employees);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [pnfl, setPnfl] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [passportSeries, setPassportSeries] = useState('');
  const [passportNumber, setPassportNumber] = useState('');

  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) dispatch(fetchEmployeeById(id));
    return () => { dispatch(clearCurrent()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (current) {
      setFirstName(current.firstName);
      setLastName(current.lastName ?? '');
      setLogin(current.login);
      setPhone(current.phone ?? '');
      setPnfl(current.pnfl ?? '');
      setBirthDate(current.birthDate ?? '');
      setPassportSeries(current.passportSeries ?? '');
      setPassportNumber(current.passportNumber ?? '');
    }
  }, [current]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !login.trim()) return;
    if (!isEdit && !password.trim()) return;

    if (isEdit && id) {
      await dispatch(updateEmployee({
        id,
        body: {
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          login: login.trim(),
          password: password.trim() || undefined,
          phone: phone.trim() || undefined,
          pnfl: pnfl.trim() || undefined,
          birthDate: birthDate || undefined,
          passportSeries: passportSeries.trim() || undefined,
          passportNumber: passportNumber.trim() || undefined,
        },
      }));
    } else {
      await dispatch(createEmployee({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        login: login.trim(),
        password: password.trim(),
        phone: phone.trim() || undefined,
        pnfl: pnfl.trim() || undefined,
        birthDate: birthDate || undefined,
        passportSeries: passportSeries.trim() || undefined,
        passportNumber: passportNumber.trim() || undefined,
      }));
    }
    navigate(ROUTES.EMPLOYEES);
  };

  return (
    <div>
      <h1 className="page-title">{isEdit ? 'Hodimni tahrirlash' : 'Yangi hodim'}</h1>
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
        <label className="form-label">
          Login *
          <input
            className="form-input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        {!isEdit && (
          <label className="form-label">
            Parol *
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEdit}
              minLength={4}
              autoComplete="new-password"
            />
          </label>
        )}
        {isEdit && (
          <label className="form-label">
            Yangi parol (bo‘sh qoldirsangiz o‘zgarmaydi)
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={4}
              autoComplete="new-password"
            />
          </label>
        )}
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
          PNFL
          <input
            className="form-input"
            value={pnfl}
            onChange={(e) => setPnfl(e.target.value)}
          />
        </label>
        <label className="form-label">
          Telefon
          <input
            type="tel"
            className="form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
        {isEdit && current?.createdAt && (
          <p className="text-muted form-meta">
            Yaratilgan sana: {new Date(current.createdAt).toLocaleDateString('uz-UZ')}
          </p>
        )}
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saqlanmoqda…' : isEdit ? 'Saqlash' : 'Yaratish'}
          </button>
          <button type="button" onClick={() => navigate(ROUTES.EMPLOYEES)} className="btn-secondary">
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  );
}
