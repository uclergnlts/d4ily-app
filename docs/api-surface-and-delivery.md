# API Yüzeyi ve Teslimat Planı

## Amaç

Mobil istemci ve diğer istemciler için temiz, stabil ve ürün odaklı bir veri yüzeyi tanımlamak.

## Ana Ürün Yüzeyi

Bir gündem dedektörü için ana istemci yüzeyi `agenda` olmalıdır.

Önerilen endpointler:

- `GET /api/v1/agenda`
- `GET /api/v1/agenda/[slug]`
- `GET /api/v1/digests/today`
- `GET /api/v1/market`

## Destekleyici Endpointler

- `GET /api/v1/news`
- `GET /api/v1/articles`
- `GET /api/v1/tweets`
- `GET /api/v1/topics`

Bu endpointler ana ürün çıktısı değil, debug veya destek katmanı olarak düşünülmelidir.

## agenda Liste Çıktısı

Her kayıt için hedef alanlar:

- `id`
- `slug`
- `title`
- `summary`
- `whyItMatters`
- `category`
- `importanceScore`
- `verificationStatus`
- `sourceCount`
- `officialSourceCount`
- `newsCount`
- `tweetCount`
- `firstSeenAt`
- `lastUpdatedAt`

## agenda Detay Çıktısı

Liste alanlarına ek olarak:

- `verificationReason`
- `watchNext`
- `keywords`
- `relatedArticles`
- `relatedTweets`
- `representativeSignals`

## API İlkeleri

- response shape sabit olmalı
- alan adları `camelCase` olmalı
- tarih alanları ISO formatta olmalı
- ham payload istemciye açılmamalı
- verification dili deterministik katmanla uyumlu olmalı

## Kalite Kriterleri

- istemciye gereksiz ham veri taşınmamalı
- tek olay tek madde gibi görünmeli
- teyitsiz konu açık işaretlenmeli
- eski ve bayat konu yeni gibi gösterilmemeli

## Sonraki Karar

Bu dokümandan sonra netleşecek:

- kesin DTO şeması
- pagination ihtiyacı
- filtreleme seçenekleri
- istemci sürümleme politikası
