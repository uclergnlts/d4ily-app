# Sinyal Hattı ve Veri Modeli

## Amaç

Tüm kaynaklardan gelen veriyi ortak bir sinyal modeline çevirmek.

## Ham Sinyal Modeli

Her kaynak tipi sonunda ortak bir kayda dönüşmelidir.

Önerilen alanlar:

- `sourceType`
- `sourceName`
- `sourceId`
- `sourceUrl`
- `title`
- `content`
- `publishedAt`
- `fetchedAt`
- `category`
- `trustScore`
- `isOfficial`
- `engagementScore`
- `canonicalHash`
- `rawPayload`

## sourceType Türleri

- `tweet`
- `rss`
- `officialBulletin`
- `market`
- `manual`

## İş Akışı

1. kaynaktan çek
2. ham payload sakla
3. normalize et
4. canonical hash üret
5. duplicate işaretle
6. cluster katmanına aktar

## Normalize Alanlar

Her sinyal için normalize edilmesi gerekenler:

- başlık
- içerik
- kişi adları
- kurum adları
- tarih
- URL

## CanonicalHash Mantığı

Amaç birebir aynı sinyali yeniden işlemekten kaçınmaktır.

Hash üretiminde aday alanlar:

- normalized title
- normalized content excerpt
- source url
- source type

## Havuz Politikası

- ham veri silinmez, işaretlenir
- duplicate olanlar ayrı tutulur
- aynı olayın farklı versiyonları kaybedilmez
- cluster katmanı için mümkün olduğunca zengin bağlam korunur

## Veri Saklama Katmanları

- `raw`: olduğu gibi gelen veri
- `normalized`: temizlenmiş sinyal
- `clustered`: konu altına bağlanmış sinyal
- `editorial`: AI ile özetlenmiş çıktı

## Sonraki Karar

Bu dokümandan sonra netleşmesi gereken:

- gerçek tablo yapıları
- hangi alanların mevcut şemaya ekleneceği
- geçmiş verinin ne kadar tutulacağı
