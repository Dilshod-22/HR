# Product Create API — Postman / cURL

**Endpoint:** `POST http://localhost:3001/products`  
**Content-Type:** `multipart/form-data` (rasm ixtiyoriy)

---

## 1. cURL — rasm **siz** (faqat matn)

```bash
curl -X POST http://localhost:3001/products \
  -F "name=Olma" \
  -F "price=15000" \
  -F "description=Yashil olma, 1 kg"
```

---

## 2. cURL — rasm **bilan**

```bash
curl -X POST http://localhost:3001/products \
  -F "name=Olma" \
  -F "price=15000" \
  -F "description=Yashil olma, 1 kg" \
  -F "image=@/path/to/rasm.jpg"
```

Windows (PowerShell) da rasm yo‘li:

```powershell
curl -X POST http://localhost:3001/products -F "name=Olma" -F "price=15000" -F "description=Yashil olma" -F "image=@C:\Users\Phoenix\Pictures\product.jpg"
```

---

## 3. Postman sozlashi

1. **Method:** `POST`
2. **URL:** `http://localhost:3001/products`
3. **Body** → **form-data** tanlang.
4. Key qatorlar:

| Key      | Type   | Value / Description |
|----------|--------|----------------------|
| `name`   | Text   | Mahsulot nomi (majburiy) |
| `price`  | Text   | Narx, raqam (majburiy), masalan `15000` |
| `description` | Text | Tavsif (ixtiyoriy) |
| `image`  | File   | Rasm fayl (ixtiyoriy); key nomi aynan **image** bo‘lishi kerak |

5. **Send** bosing.

---

## 4. Postmandan olingan cURL (namuna)

Postmanda so‘rov yuborganingizdan keyin **Code** (</> ) → **cURL** tanlasangiz, tayyor cURL buyrug‘ini ko‘rasiz va kerak bo‘lsa shu buyruqni terminalda ishlatishingiz mumkin.
