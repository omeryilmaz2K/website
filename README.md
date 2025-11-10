# E-Ticaret Web Sitesi

Profesyonel, turuncu temalı e-ticaret web sitesi. React, Node.js, Express ve MongoDB kullanılarak geliştirilmiştir.

## Özellikler

### Frontend (Kullanıcı Tarafı)
- Modern ve responsive tasarım
- Turuncu renk teması
- Ürün listeleme ve arama
- Kategori ve platform filtreleme
- Ürün detay sayfası
- WhatsApp ve telefon ile iletişim
- Sıralama (fiyat, isim, yeni)

### Backend (API)
- RESTful API
- JWT ile authentication
- MongoDB veritabanı
- Dosya yükleme (multer)
- CORS desteği

### Admin Paneli
- Güvenli giriş sistemi
- Ürün ekleme, düzenleme, silme
- Kategori yönetimi
- Dashboard ve istatistikler
- Resim yükleme

## Kategoriler
- Filmler
- Diziler
- PS Oyunları (PS3, PS4, PS5)
- Konsollar
- Xbox
- Oyuncaklar

## Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- MongoDB (yerel veya MongoDB Atlas)
- npm veya yarn

### Backend Kurulumu

1. Backend klasörüne gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyası oluşturun:
```bash
cp .env.example .env
```

4. `.env` dosyasını düzenleyin ve gerekli bilgileri girin:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

5. MongoDB'nin çalıştığından emin olun

6. Backend'i başlatın:
```bash
npm run dev
```

Backend http://localhost:5000 adresinde çalışacak.

### Frontend Kurulumu

1. Yeni bir terminal açın ve frontend klasörüne gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Frontend'i başlatın:
```bash
npm run dev
```

Frontend http://localhost:3000 adresinde çalışacak.

## İlk Admin Kullanıcısı Oluşturma

Backend çalışırken, aşağıdaki komutu kullanarak ilk admin kullanıcısını oluşturabilirsiniz:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123456"
  }'
```

Veya Postman/Insomnia gibi bir API test aracı kullanabilirsiniz.

## Kategorileri Oluşturma

Admin paneline giriş yaptıktan sonra aşağıdaki kategorileri oluşturun:

1. Filmler (slug: filmler)
2. Diziler (slug: diziler)
3. PS Oyunları (slug: ps-oyunlari)
4. Konsollar (slug: konsollar)
5. Xbox (slug: xbox)
6. Oyuncaklar (slug: oyuncaklar)

## İletişim Bilgilerini Güncelleme

Ürün detay sayfasındaki WhatsApp ve telefon numaralarını güncellemek için:

1. `frontend/src/pages/ProductDetail.jsx` dosyasını açın
2. 11-12. satırlardaki telefon numaralarını güncelleyin:
```javascript
const phoneNumber = '905XXXXXXXXX';  // Gerçek numaranız
const whatsappNumber = '905XXXXXXXXX';  // Gerçek numaranız
```

## Kullanım

1. Ana sayfa: Tüm ürünleri görüntüleyin, arayın ve filtreleyin
2. Ürün Detay: Ürün hakkında detaylı bilgi, WhatsApp ve telefon ile iletişim
3. Admin Paneli: `/admin` - Ürün ve kategori yönetimi

## Teknolojiler

### Frontend
- React 18
- React Router v6
- Axios
- React Icons
- Vite

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Multer (dosya yükleme)
- CORS

## Proje Yapısı

```
website/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── categoryRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Önemli Notlar

1. **MongoDB**: Projeyi çalıştırmadan önce MongoDB'nin çalıştığından emin olun
2. **Resim Yükleme**: Resimler `backend/uploads/` klasörüne kaydedilir
3. **JWT Secret**: Production'da `.env` dosyasındaki JWT_SECRET'ı değiştirin
4. **CORS**: Backend tüm originlere açık. Production'da bunu sınırlandırın
5. **Telefon Numaraları**: ProductDetail.jsx'teki telefon numaralarını güncelleyin

## API Endpoints

### Authentication
- POST `/api/auth/register` - Kullanıcı kaydı
- POST `/api/auth/login` - Kullanıcı girişi

### Products
- GET `/api/products` - Tüm ürünleri listele (query params: category, search, platform, sort)
- GET `/api/products/:id` - Tek ürün detayı
- POST `/api/products` - Yeni ürün ekle (Admin)
- PUT `/api/products/:id` - Ürün güncelle (Admin)
- DELETE `/api/products/:id` - Ürün sil (Admin)

### Categories
- GET `/api/categories` - Tüm kategorileri listele
- GET `/api/categories/:id` - Tek kategori detayı
- POST `/api/categories` - Yeni kategori ekle (Admin)
- PUT `/api/categories/:id` - Kategori güncelle (Admin)
- DELETE `/api/categories/:id` - Kategori sil (Admin)

## Lisans

MIT

## Destek

Herhangi bir sorun yaşarsanız, lütfen issue açın.
