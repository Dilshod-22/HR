import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function HomePage() {
  return (
    <div className="home-wrap">
      <h1 className="home-title">HR</h1>
      <p className="home-desc">
        Mahsulotlar, mijozlar va buyurtmalarni boshqarish. Har bir bo‘limda filter va sahifalash mavjud.
      </p>
      <div className="cards-grid">
        <Link to={ROUTES.PRODUCTS} className="card-link">
          <span className="card-title">Mahsulotlar</span>
          <span className="card-desc">Mahsulot qo‘shish, rasm yuklash, tahrirlash</span>
        </Link>
        <Link to={ROUTES.CUSTOMERS} className="card-link">
          <span className="card-title">Mijozlar</span>
          <span className="card-desc">Mijoz yaratish va boshqarish</span>
        </Link>
        <Link to={ROUTES.ORDERS} className="card-link">
          <span className="card-title">Buyurtmalar</span>
          <span className="card-desc">Mijozga mahsulot bog‘lash, status</span>
        </Link>
      </div>
    </div>
  );
}
