# HW6 - Email and Images

Bu proje, Node.js kursunun altıncı ev ödevidir. Şifre sıfırlama işlevselliği ve resim yükleme özelliklerini içerir.

## Özellikler

- Kullanıcı kaydı ve girişi
- JWT token tabanlı kimlik doğrulama
- Şifre sıfırlama (e-posta ile)
- Kişi yönetimi (CRUD işlemleri)
- Resim yükleme (Cloudinary entegrasyonu)
- E-posta gönderimi (Brevo SMTP)

## Teknolojiler

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- bcryptjs (şifre hashleme)
- nodemailer (e-posta gönderimi)
- multer (dosya yükleme)
- cloudinary (resim depolama)
- Joi (veri doğrulama)

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd hw6-email-and-images
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

4. `.env` dosyasını düzenleyin:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/contacts-app

# JWT
JWT_SECRET=VOQjLdrpG1TWCHhDzv3o

# Server
PORT=3000

# App Domain
APP_DOMAIN=http://localhost:3000/auth

# Brevo SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-username
SMTP_PASSWORD=your-brevo-password
SMTP_FROM=your-email@brevo.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

5. Uygulamayı başlatın:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/logout` - Kullanıcı çıkışı
- `POST /auth/send-reset-email` - Şifre sıfırlama e-postası gönder
- `POST /auth/reset-pwd` - Şifre sıfırlama

### Contacts

- `GET /contacts` - Tüm kişileri getir
- `GET /contacts/:contactId` - Tek kişi getir
- `POST /contacts` - Yeni kişi oluştur (resim yükleme destekli)
- `PATCH /contacts/:contactId` - Kişi güncelle (resim yükleme destekli)
- `DELETE /contacts/:contactId` - Kişi sil

## Örnek Kullanım

### Kullanıcı Kaydı
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Kişi Oluşturma (Resim ile)
```bash
curl -X POST http://localhost:3000/contacts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone=+1234567890" \
  -F "photo=@/path/to/image.jpg"
```

## Dağıtım

Bu proje Render.com üzerinde dağıtılmıştır. Canlı versiyon için: [Render Link]

## Lisans

ISC 