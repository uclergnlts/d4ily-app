# D4ily - Türkiye Gündem Özeti

Yapay zeka destekli günlük Türkiye gündem özeti platformu.

## Özellikler

- Günlük haber özetleri
- Sesli podcast (Spotify entegrasyonu)
- Önemli tweet'ler
- Konu bazlı arşiv
- Tepki sistemi
- Newsletter aboneliği
- Sosyal medya paylaşım kartları

## Kurulum

### Gereksinimler

- Node.js 18+
- pnpm (önerilen) veya npm/yarn

### Adımlar

1. **Depoyu klonlayın:**
   ```bash
   git clone https://github.com/uclergnlts/d4ily.git
   cd d4ily
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   pnpm install
   # veya
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   `.env.local` dosyasını açın ve Supabase bilgilerinizi girin:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   pnpm dev
   # veya
   npm run dev
   ```

5. **Tarayıcınızda açın:**
   ```
   http://localhost:3000
   ```

## Supabase Veritabanı Yapısı

### digests tablosu

```sql
CREATE TABLE digests (
  id SERIAL PRIMARY KEY,
  digest_date DATE NOT NULL UNIQUE,
  title TEXT,
  summary TEXT,
  content JSONB,
  audio_url TEXT,
  audio_status TEXT DEFAULT 'pending',
  audio_duration INTEGER,
  spotify_url TEXT,
  important_tweets JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster date queries
CREATE INDEX idx_digests_date ON digests(digest_date DESC);
```

### reactions tablosu

```sql
CREATE TABLE reactions (
  id SERIAL PRIMARY KEY,
  digest_id INTEGER REFERENCES digests(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(digest_id, visitor_id, reaction_type)
);

-- Index for faster reaction lookups
CREATE INDEX idx_reactions_digest ON reactions(digest_id);
CREATE INDEX idx_reactions_visitor ON reactions(visitor_id);
```

### subscribers tablosu (opsiyonel)

```sql
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

## Proje Yapısı

```
d4ily/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── arsiv/             # Arşiv sayfaları
│   ├── bugun/             # Bugünün özeti
│   ├── konu/              # Konu bazlı sayfalar
│   ├── share-preview/     # Sosyal medya kartı önizleme
│   └── ...
├── components/            # React bileşenleri
│   ├── ui/               # shadcn/ui bileşenleri
│   └── ...
├── lib/                   # Yardımcı fonksiyonlar
│   ├── supabase/         # Supabase client
│   └── ...
├── public/               # Statik dosyalar
└── ...
```

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `pnpm dev` | Geliştirme sunucusunu başlat |
| `pnpm build` | Production build oluştur |
| `pnpm start` | Production sunucusunu başlat |
| `pnpm lint` | Kod kalitesi kontrolü |

## Teknolojiler

- **Framework:** Next.js 16
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Deployment:** Vercel

## API Endpoints

| Endpoint | Açıklama |
|----------|----------|
| `GET /api/daily-digest/today` | Bugünün özeti |
| `GET /api/daily-digest/[date]` | Belirli bir tarihin özeti |
| `GET /api/anchor-rss` | Podcast RSS feed |
| `GET /api/reactions` | Tepki sistemi |
| `GET /rss.xml` | Site RSS feed |

## Deployment

Vercel üzerinde deploy etmek için:

1. [Vercel](https://vercel.com)'e gidin
2. GitHub repo'nuzu bağlayın
3. Environment variables ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy edin

## Lisans

MIT License
