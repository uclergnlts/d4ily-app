# Gündem Dedektörü Mimari Planı

## Amaç

Bu sistemin amacı Türkiye gündemindeki kritik gelişmeleri mümkün olduğunca erken yakalamak, aynı olaya ait dağınık sinyalleri tek başlık altında toplamak, teyit seviyesini belirlemek ve sonunda editoryal kalitede kısa bir özet üretmektir.

Hedef çıktı tek tek haber listesi değil, `gündem maddeleri`dir.

## Sistem Akışı

1. Kaynakları izle
2. Ham sinyalleri tek havuzda topla
3. Yinelenen ve aynı olaya ait kayıtları grupla
4. Her konu için önem ve teyit puanı hesapla
5. AI ile özet, önem ve izleme notu üret
6. `v1/agenda` üzerinden istemcilere sun

## Aşama 1: Kaynak Katmanı

Amaç kritik sinyalleri kaçırmamaktır.

### X Hesapları

Öncelikli kategoriler:

- resmi kurumlar
- bakanlıklar
- düzenleyici kurumlar
- belediyeler
- parti liderleri
- grup başkanvekilleri ve sözcüler
- milletvekilleri
- yüksek güvenilir gazeteciler
- ajanslar
- ekonomi ve piyasa hesapları

Her hesap için tutulacak alanlar:

- `username`
- `displayName`
- `category`
- `priority`
- `trustScore`
- `isOfficial`
- `fetchInterval`
- `showInLiveFeed`

### RSS Kaynakları

Öncelikli kategoriler:

- ajans
- ulusal medya
- bağımsız medya
- ekonomi
- dünya
- teknoloji
- spor

Her kaynak için tutulacak alanlar:

- `name`
- `url`
- `category`
- `priority`
- `trustScore`
- `isOfficial`
- `fetchInterval`

### Yardımcı Kaynaklar

- Resmi Gazete
- Merkez Bankası
- Borsa İstanbul
- bakanlık ve kurum duyuruları
- AFAD
- YSK
- valilik ve belediye duyuruları

## Aşama 2: Ham Veri Havuzu

Bu katmanda amaç yorum yapmak değil, temiz veri toplamaktır.

Her ham kayıt için ortak alanlar:

- `sourceType`
- `sourceName`
- `sourceUrl`
- `title`
- `content`
- `publishedAt`
- `fetchedAt`
- `category`
- `trustScore`
- `isOfficial`
- `rawPayload`
- `canonicalHash`

Not:

- `canonicalHash` duplicate tespiti için kullanılır
- aynı olayın farklı kaynaklarda tekrar edilmesi burada silinmez, sadece işaretlenir

## Aşama 3: Temizleme ve Normalizasyon

Bu katmanda veri tek biçime getirilir.

Yapılacaklar:

- HTML ve gereksiz karakter temizliği
- başlık ve içerik normalize etme
- dil tespiti
- tarih formatlarını tek biçime indirme
- URL canonicalization
- spam ve düşük değerli sinyalleri eleme
- tekrar tweet ve tekrar haber işaretleme

## Aşama 4: Dedup ve Cluster

Asıl gündem dedektörü bu katmandır.

Amaç:

- birebir aynı kayıtları silmek
- aynı olayı anlatan farklı kayıtları tek cluster altında toplamak

Cluster kararında kullanılacak sinyaller:

- başlık benzerliği
- içerik benzerliği
- ortak kişi/kurum/yer adları
- ortak anahtar kelimeler
- zaman yakınlığı
- kategori uyumu
- aynı link veya aynı kaynak referansı

Her cluster için üretilecek alanlar:

- `slug`
- `title`
- `summary`
- `category`
- `keywords`
- `signalCount`
- `sourceCount`
- `officialSourceCount`
- `newsCount`
- `tweetCount`
- `firstSeenAt`
- `lastUpdatedAt`
- `importanceScore`
- `verificationStatus`
- `verificationReason`

## Aşama 5: Teyit Mantığı

İlk sürüm için önerilen durumlar:

- `confirmed`
- `likelyConfirmed`
- `unverified`
- `conflicting`

İlk karar kuralları:

- resmi kaynak varsa `confirmed`
- iki veya daha fazla yüksek güvenilir bağımsız kaynak varsa `likelyConfirmed`
- tek kaynak veya sadece sosyal medya varsa `unverified`
- kaynaklar birbiriyle çelişiyorsa `conflicting`

Bu katman deterministik olmalı. AI son kararı uydurmamalı, sadece bu kararı açıklamalı.

## Aşama 6: Önem Skoru

Her cluster için önem puanı hesaplanır.

İlk sürüm puan bileşenleri:

- kaynak sayısı
- resmi kaynak sayısı
- yüksek güvenilir kaynak sayısı
- sosyal etkileşim
- güncellik
- kategori önceliği
- tekrar etme sıklığı
- piyasa veya kamu etkisi

Örnek yüksek öncelik kategorileri:

- siyaset
- ekonomi
- güvenlik
- afet
- hukuk
- diplomasi

## Aşama 7: AI Editoryal Katman

AI bu aşamada veri toplamaz, veri uydurmaz, karar verici tek sistem olmaz.

AI'nin görevi:

- cluster için net başlık yazmak
- kısa özet çıkarmak
- neden önemli olduğunu söylemek
- teyit gerekçesini açıklamak
- sırada ne izlenecek onu yazmak

AI çıktısı için önerilen şema:

- `title`
- `summary`
- `whyItMatters`
- `verificationStatus`
- `verificationReason`
- `watchNext`
- `confidenceNote`

AI kuralları:

- kaynakta olmayan bilgi ekleme
- belirsiz olan şeyi kesin anlatma
- teyitsiz içeriği teyitli gibi sunma
- görüş ile olguyu karıştırma

## Aşama 8: API Yüzeyi

İstemcinin ana yüzeyi `agenda` olmalıdır.

Önerilen endpointler:

- `GET /api/v1/agenda`
- `GET /api/v1/agenda/[slug]`
- `GET /api/v1/digests/today`
- `GET /api/v1/market`

`news`, `tweets`, `articles` destekleyici veri yüzeyleri olarak kalabilir ama ana ürün yüzeyi olmamalıdır.

## İlk Uygulama Sırası

1. Kaynak envanterini netleştir
2. X ve RSS kaynaklarını puanla
3. Ham veri şemasını sabitle
4. dedup kurallarını yaz
5. cluster mantığını güçlendir
6. teyit kurallarını kodla
7. AI prompt ve çıktı şemasını tanımla
8. `agenda` endpointlerini stabilize et

## Şu Anki Teknik Durum

Projede ilk `agenda` yüzeyi eklendi:

- `GET /api/v1/agenda`
- `GET /api/v1/agenda/[slug]`

Bu ilk sürüm canlı `processed_articles` ve `tweets_raw` verisinden türetilir. Henüz kalıcı `agenda_clusters` tablosu ve tam teyit motoru yoktur.

## Sonraki Teknik Adım

En doğru bir sonraki iş:

- kaynak matrisi oluşturmak
- `trustScore` ve `priority` sistemini netleştirmek
- ardından cluster ve verification katmanını iyileştirmek
