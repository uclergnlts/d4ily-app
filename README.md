# D4ily - Türkiye Gündem Özeti

Yapay zeka destekli günlük Türkiye gündem özeti platformu. Haber gürültüsünden uzak, sadece önemli gelişmeleri sunar.

## Özellikler

- **Günlük Gündem Özeti (AI):** Son 24 saatteki tweet ve haberlerden oluşturulan tarafsız özet.
- **Canlı Akış (X/Twitter):** Politikacılar ve gazetecilerin tweetleri (Saatlik güncellenir).
- **Resmi Gazete Özeti:** Her gece 00:00'da yayınlanan kararların AI özeti.
- **Piyasa Verileri:** BIST100, Dolar, Altın verileri ile zenginleştirilmiş içerik.
- **Sesli Okuma:** Günlük özetlerin sesli versiyonu (OpenAI TTS).
- **Haftalık Bülten:** Haftanın öne çıkan olayları.

## Yeni Özellikler (v1.1) 🚀

- **Canlı Akış İyileştirmesi:** Veriler artık **saatlik** olarak güncelleniyor (önceki: 2 saat).
- **Kapsamlı Kaynaklar:** 20+ yeni politikacı ve yerel yönetici hesabı eklendi.
- **Tam Metin:** Tweetler artık kısaltılmadan, tam metin olarak gösteriliyor.
- **Turso DB:** Veritabanı altyapısı Supabase'den Turso (LibSQL)'a taşındı.

## Kurulum

### Gereksinimler

- Node.js 18+
- pnpm (önerilen) veya npm

### Adımlar

1. **Depoyu klonlayın:**
   ```bash
   git clone https://github.com/uclergnlts/d4ily.git
   cd d4ily
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

```
d4ily/
├── app/                    # Next.js App Router
│   ├── api/               # Cron jobs & API endpoints
│   ├── akis/              # Canlı Akış sayfası
│   ├── istatistikler/     # İstatistik paneli
│   └── ...
├── components/            # UI Bileşenleri
├── lib/                   # Arka plan iş mantığı
│   ├── db/               # Turso/Drizzle şeması
│   ├── crons.ts          # Haber/Tweet çekme botları
│   └── ai.ts             # Gemini AI entegrasyonu
└── ...
```

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `pnpm dev` | Geliştirme sunucusunu başlat |
| `pnpm build` | Production build oluştur |
| `pnpm db:push` | Veritabanı şemasını güncelle |
| `pnpm db:studio` | Veritabanı yönetim paneli |

## Deployment

Vercel üzerinde barındırılmaktadır. `git push` yapıldığında otomatik deploy olur.
Cron joblar GitHub Actions tarafından tetiklenir (`.github/workflows`).

## Lisans

MIT License
