# 🚀 Hızlı Başlangıç

## ✅ Yapılanlar

Projeniz Firebase backend ile Vercel'e deploy edilmeye hazır! Yapılan değişiklikler:

### Backend Değişiklikleri
- ✅ MongoDB -> Firebase Firestore'a geçiş
- ✅ Firebase Authentication entegrasyonu
- ✅ Firebase Storage (dosya yükleme için)
- ✅ Tüm route'lar Firebase ile çalışacak şekilde güncellendi
- ✅ Middleware'ler Firebase için yapılandırıldı
- ✅ Mongoose bağımlılığı kaldırıldı

### Deployment Hazırlıkları
- ✅ `vercel.json` konfigürasyonu oluşturuldu
- ✅ Environment variables template hazırlandı
- ✅ Detaylı deployment kılavuzu oluşturuldu

## 🎯 Şimdi Yapmanız Gerekenler

### 1. Firebase Projesi Oluşturma (10 dakika)

1. https://console.firebase.google.com/ adresine gidin
2. "Add project" ile yeni proje oluşturun
3. Aktifleştirmeniz gereken servisler:
   - **Firestore Database** (production mode, europe-west location)
   - **Authentication** (Email/Password enable)
   - **Storage** (production mode, europe-west location)

### 2. Service Account Key İndirme (2 dakika)

1. Firebase Console > ⚙️ Settings > Project settings > Service accounts
2. "Generate new private key" butonuna tıklayın
3. İndirilen JSON dosyasını kaydedin

### 3. Local Test (5 dakika)

```bash
# Backend klasörüne gidin
cd backend

# Service account key'i yerleştirin
# İndirdiğiniz JSON dosyasını şuraya kopyalayın:
# backend/config/serviceAccountKey.json

# .env dosyası oluşturun
cp .env.example .env

# .env dosyasını düzenleyin:
# FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
# (Firebase Console > Storage'dan bucket adını alın)

# Backend'i başlatın
npm install
npm run dev
```

Başka bir terminalde:

```bash
# Frontend klasörüne gidin
cd frontend

# Frontend'i başlatın
npm install
npm run dev
```

### 4. Vercel'e Deploy (10 dakika)

1. https://vercel.com adresine gidin
2. GitHub ile giriş yapın
3. "Add New Project" > Repository'nizi seçin
4. **Environment Variables ekleyin:**

```
PORT=5000
NODE_ENV=production
JWT_SECRET=güçlü-random-bir-key-oluşturun
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

**FIREBASE_SERVICE_ACCOUNT nasıl hazırlanır:**
- İndirdiğiniz service account JSON dosyasını açın
- https://jsonformatter.org/json-minify sitesine gidin
- JSON içeriğini yapıştırın ve "Minify" yapın
- Tek satır halindeki JSON'u Vercel'e yapıştırın

5. "Deploy" butonuna tıklayın

### 5. Firebase Security Rules Ayarlama (5 dakika)

**Firestore Rules** (Firebase Console > Firestore > Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

**Storage Rules** (Firebase Console > Storage > Rules):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 📚 Daha Fazla Bilgi

Detaylı bilgi için `DEPLOYMENT.md` dosyasına bakın.

## 🎉 Tamamlandı!

Artık siteniz Firebase backend ile Vercel'de çalışıyor olmalı!

**Test etmek için:**
- Vercel'in verdiği URL'i açın
- Admin kaydı yapın: `POST /api/auth/register`
- Kategori ekleyin: `POST /api/categories`
- Ürün ekleyin: `POST /api/products`

## ⚠️ Önemli Notlar

1. Firebase **Spark Plan** (ücretsiz) kullanıyorsanız bazı limitler var:
   - Storage: 5GB
   - Firestore: 1GB
   - Günlük okuma: 50K

2. Production'da mutlaka güvenlik kurallarını aktif edin

3. JWT_SECRET'ı güçlü bir değer yapın (örn: 64 karakterlik random string)

4. Service account key'i asla GitHub'a pushlamamaya dikkat edin (.gitignore'da zaten var)
