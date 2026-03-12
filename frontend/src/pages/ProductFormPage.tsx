import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchProductById,
  createProduct,
  updateProduct,
  clearCurrent,
} from '../store/slices/productsSlice';
import { ROUTES } from '../constants/routes';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { current, loading } = useAppSelector((s) => s.products);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => { dispatch(clearCurrent()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (current) {
      setName(current.name);
      setDescription(current.description || '');
      setPrice(String(current.price));
      setImagePreview(current.imageUrl || null);
    }
  }, [current]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (!name.trim() || isNaN(numPrice) || numPrice < 0) return;

    if (isEdit && id) {
      await dispatch(updateProduct({
        id,
        body: { name: name.trim(), description: description.trim() || undefined, price: numPrice },
        image: image ?? undefined,
      }));
    } else {
      await dispatch(createProduct({
        body: { name: name.trim(), description: description.trim() || undefined, price: numPrice },
        image: image ?? undefined,
      }));
    }
    navigate(ROUTES.PRODUCTS);
  };

  return (
    <div>
      <h1 className="page-title">{isEdit ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h1>
      <form onSubmit={handleSubmit} className="form-block">
        <label className="form-label">
          Nom *
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Tavsif
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>
        <label className="form-label">
          Narx (so‘m) *
          <input
            type="number"
            className="form-input input-number"
            min={0}
            step={0.01}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Rasm
          <input type="file" accept="image/*" onChange={handleFile} className="form-input" />
          {imagePreview && (
            <img src={imagePreview} alt="" className="img-preview" />
          )}
        </label>
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saqlanmoqda…' : isEdit ? 'Saqlash' : 'Yaratish'}
          </button>
          <button type="button" onClick={() => navigate(ROUTES.PRODUCTS)} className="btn-secondary">
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  );
}
