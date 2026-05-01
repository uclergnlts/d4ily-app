# D4ily Backend API

Yapay zeka destekli gündem işleme ve içerik dağıtım backend'i. Bu servis mobil uygulamalar, admin araçları ve harici istemciler için API sağlar.

## Hedef

- `backend-first` mimari
- mobil istemciler için stabil JSON API
- cron tabanlı veri toplama ve içerik işleme
- admin ve ingest araçlarını aynı kod tabanında koruma

## Özellikler

- **Günlük Gündem Özeti (AI):** Son 24 saatteki tweet ve haberlerden oluşturulan tarafsız özet.
- **Canlı Akış (X/Twitter):** Politikacılar ve gazetecilerin tweetleri.
- **Resmi Gazete Özeti:** Her gece 00:00'da yayınlanan kararların AI özeti.
- **Piyasa Verileri:** BIST100, Dolar, Altın verileri ile zenginleştirilmiş içerik.
- **Sesli Okuma:** Günlük özetlerin sesli versiyonu (OpenAI TTS).
- **Haftalık Bülten:** Haftanın öne çıkan olayları.

## API Yüzeyi

Yeni istemci entegrasyonları için versiyonlu endpointler:

- `GET /api/v1`
- `GET /api/v1/health`
- `GET /api/v1/agenda`
- `GET /api/v1/agenda/:slug`
- `GET /api/v1/digests/today`
- `GET /api/v1/digests/:date`
- `GET /api/v1/news`
- `GET /api/v1/articles`
- `GET /api/v1/topics`
- `GET /api/v1/market`
- `GET /api/v1/tweets`

## Kurulum

### Gereksinimler

- Node.js 18+
- pnpm (önerilen) veya npm

### Adımlar

1. **Depoyu klonlayın:**
   ```bash
   git clone https://github.com/uclergnlts/d4ily-app.git
   cd d4ily-app
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   pnpm install
   ```

3. **Ortam değişkenlerini ayarlayın:**
   `.env.local` dosyasını oluşturun:
   ```
   TURSO_DATABASE_URL=your-turso-url
   TURSO_AUTH_TOKEN=your-turso-token
   GEMINI_API_KEY=your-gemini-key
   TWITTER_API_KEY=your-twitter-api-key
   CRON_SECRET=your-cron-secret
   ```

4. **Veritabanını Hazırlayın:**
   ```bash
   pnpm db:push
   ```

5. **Geliştirme sunucusunu başlatın:**
   ```bash
   pnpm dev
   ```

## Proje Yapısı

```text
d4ily-app/
├── app/
│   ├── api/               # Route handlers and versioned API
│   │   └── v1/            # Mobile-facing API surface
├── lib/
│   ├── api/               # API response helpers and shared queries
│   ├── db/                # Turso/Drizzle schema and connection
│   ├── services/          # Domain services
│   └── crons.ts           # Scheduled ingestion jobs
├── scripts/               # Source seeding, schema repair, and cron runners
├── migrations/            # Database migrations
└── .github/workflows/     # Scheduled automation and deploy jobs
```

## Geçiş Notu

Eski route'lar geriye dönük uyumluluk için korunabilir. Yeni mobil istemciler yalnızca `/api/v1` endpointlerini kullanmalıdır.

## Gündem Dedektörü Planı

Bu backend artık klasik bir haber listesi değil, `gündem dedektörü` olarak evriliyor.

Ana hedef:

- kritik kaynakları izlemek
- ham sinyalleri tek havuzda toplamak
- aynı olayı tek başlık altında birleştirmek
- teyit seviyesini belirlemek
- AI ile kısa ve güvenilir özet üretmek

Detaylı mimari plan için:

- [docs/agenda-detector-architecture.md](docs/agenda-detector-architecture.md)
