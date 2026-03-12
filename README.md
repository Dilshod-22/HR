# CRUD Full — Mahsulotlar, Mijozlar, Buyurtmalar

Full-stack loyiha: **React** (frontend) + **NestJS** (backend) + **PostgreSQL**. Mahsulotga rasm yuklash **ImageKit** orqali.

## Tarkib

- **Backend (NestJS):** Products, Customers, Orders modullari; PostgreSQL; filter va pagination; mahsulot rasmi ImageKit ga yuklanadi.
- **Frontend (React):** Redux Toolkit (state management), React Router; har bir bo‘limda filter va pagination.

## Talablar

- Node.js 18+
- PostgreSQL 14+
- ImageKit hisob (https://imagekit.io) — mahsulot rasmlari uchun

## Backend ishga tushirish

```bash
cd backend
cp .env.example .env
# .env da DB_* va IMAGEKIT_* to‘ldiring
npm install
npm run migration:run   # PostgreSQL jadvalarini yaratadi
npm run start:dev
```

Backend: **http://localhost:3001**

### PostgreSQL migrationlar

Jadvalar `synchronize` orqali emas, **migration** orqali yaratiladi.

| Buyruq | Vazifa |
|--------|--------|
| `npm run migration:run` | Barcha pending migrationlarni ishga tushiradi |
| `npm run migration:revert` | Oxirgi migrationni bekor qiladi |
| `npm run migration:generate -- -n MigrationName` | Entity o‘zgarishlaridan yangi migration generatsiya qiladi (nomni `MigrationName` o‘rniga yozing) |

Migration fayllari: `backend/src/migrations/`.

## Frontend ishga tushirish

```bash
cd frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173**

## API asosiy endpointlar

| Method | URL | Tavsif |
|--------|-----|--------|
| GET    | /products?page=1&limit=10&search=...&sortBy=...&sortOrder=... | Mahsulotlar (filter, pagination) |
| POST   | /products (form-data: name, price, description?, image?) | Yangi mahsulot (rasm ixtiyoriy) |
| GET    | /customers?page=1&limit=10&search=... | Mijozlar |
| POST   | /customers | Yangi mijoz |
| GET    | /orders?page=1&limit=10&status=...&search=... | Buyurtmalar |
| POST   | /orders | Yangi buyurtma (customerId, productId, quantity, status?) |

Order status: `pending` | `processing` | `shipped` | `delivered` | `cancelled`

## Loyiha strukturasi

```
crud_full/
├── backend/          # NestJS, TypeORM, PostgreSQL, ImageKit
│   ├── src/
│   │   ├── products/  # CRUD + rasm yuklash
│   │   ├── customers/
│   │   ├── orders/
│   │   ├── common/    # Pagination DTO
│   │   ├── migrations # PostgreSQL migrationlar
│   │   └── data-source.ts
│   └── .env.example
├── frontend/          # React, Vite, Redux Toolkit, React Router
│   └── src/
│       ├── store/     # products, customers, orders slices
│       ├── pages/     # Mahsulotlar, Mijozlar, Buyurtmalar
│       └── api/
└── README.md
```
