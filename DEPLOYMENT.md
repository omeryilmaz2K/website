# Firebase + Vercel Deployment Kılavuzu

Bu proje Firebase backend (Firestore, Authentication, Storage) ve Vercel hosting kullanacak şekilde yapılandırılmıştır.

## 🔥 Firebase Kurulumu

### 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. "Add project" ile yeni bir proje oluşturun
3. Proje adını girin (örn: "ecommerce-site")

### 2. Firebase Services Aktifleştirme

#### Firestore Database
1. Firebase Console'da "Firestore Database" sekmesine gidin
2. "Create database" butonuna tıklayın
3. "Start in production mode" seçin (güvenlik kurallarını sonra ayarlayacağız)
4. Location seçin (Türkiye için "europe-west" uygun)

#### Authentication
1. "Authentication" sekmesine gidin
2. "Get started" butonuna tıklayın
3. "Email/Password" metodunu enable edin

#### Storage
1. "Storage" sekmesine gidin
2. "Get started" butonuna tıklayın
3. "Start in production mode" seçin
4. Location'ı Firestore ile aynı seçin

### 3. Service Account Key Oluşturma

1. Firebase Console'da ⚙️ (Settings) > "Project settings" > "Service accounts"
2. "Generate new private key" butonuna tıklayın
3. İndirilen JSON dosyasını kaydedin

**İki kullanım yöntemi var:**

#### Yöntem 1: Local Development İçin
- İndirilen JSON dosyasını `backend/config/serviceAccountKey.json` olarak kaydedin
- `.gitignore` dosyası bunu otomatik olarak ignore edecek

#### Yöntem 2: Production/Vercel İçin (Önerilen)
- JSON dosyasını açın ve **tüm içeriği tek satıra** dönüştürün
- Vercel'de environment variable olarak kullanacağız

### 4. Storage Bucket Adını Bulma

1. Firebase Console'da "Storage" sekmesine gidin
2. Bucket adını kopyalayın (genelde `your-project-id.appspot.com` formatında)

## 🚀 Vercel Deployment

### 1. Vercel Account ve Proje Kurulumu

1. [Vercel](https://vercel.com)'e gidin ve GitHub hesabınızla giriş yapın
2. "Add New Project" butonuna tıklayın
3. GitHub repository'nizi seçin
4. "Import" edin

### 2. Project Settings

**Framework Preset:** Other (manuel olarak yapılandırdık)

**Build & Development Settings:**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`

### 3. Environment Variables Ekleme

Vercel dashboard'da **Settings > Environment Variables** kısmına aşağıdaki değişkenleri ekleyin:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=güçlü-bir-secret-key-buraya-yazın
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"..."}
```

**FIREBASE_SERVICE_ACCOUNT nasıl hazırlanır:**
1. İndirdiğiniz service account JSON dosyasını açın
2. Tüm içeriği kopyalayın
3. Online bir JSON minifier kullanarak tek satıra çevirin (örn: [jsonformatter.org](https://jsonformatter.org/json-minify))
4. Tek satır halindeki JSON'u Vercel'e yapıştırın

### 4. Deploy

1. "Deploy" butonuna tıklayın
2. Deployment tamamlandığında siteniz yayında olacak!

## 🔒 Firebase Security Rules

### Firestore Rules

Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - sadece kendi verilerini okuyabilir
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Backend'den yönetilecek
    }

    // Categories - herkes okuyabilir, sadece admin yazabilir
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false; // Backend'den yönetilecek
    }

    // Products - herkes okuyabilir, sadece admin yazabilir
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Backend'den yönetilecek
    }
  }
}
```

### Storage Rules

Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Backend'den yönetilecek
    }
  }
}
```

## 🧪 Local Development

### 1. Dependencies Yükleme

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

`backend/.env` dosyası oluşturun:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=test-secret-key
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

Service account key dosyasını `backend/config/serviceAccountKey.json` olarak yerleştirin.

### 3. Servisleri Başlatma

```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş

### Products
- `GET /api/products` - Tüm ürünler (filtreleme destekli)
- `GET /api/products/featured` - Öne çıkan ürünler
- `GET /api/products/:id` - Tek ürün
- `POST /api/products` - Ürün oluştur (admin)
- `PUT /api/products/:id` - Ürün güncelle (admin)
- `DELETE /api/products/:id` - Ürün sil (admin)

### Categories
- `GET /api/categories` - Tüm kategoriler
- `GET /api/categories/:id` - Tek kategori
- `POST /api/categories` - Kategori oluştur (admin)
- `PUT /api/categories/:id` - Kategori güncelle (admin)
- `DELETE /api/categories/:id` - Kategori sil (admin)

## 🔍 Troubleshooting

### Vercel'de "Module not found" hatası
- `vercel.json` dosyasının doğru yapılandırıldığından emin olun
- Build command'ın doğru olduğundan emin olun

### Firebase connection hatası
- Environment variable'ların doğru girildiğinden emin olun
- Service account JSON'un doğru format olduğundan emin olun
- Firebase projesinde gerekli servislerin aktif olduğundan emin olun

### CORS hatası
- Backend'de CORS aktif (server.js'de `app.use(cors())`)
- Gerekirse specific origin ekleyebilirsiniz

## 📞 İletişim

Herhangi bir sorun yaşarsanız:
1. Firebase Console > Usage kısmından API kullanımını kontrol edin
2. Vercel Dashboard > Logs kısmından hataları inceleyin
3. Browser console'da frontend hatalarını kontrol edin
