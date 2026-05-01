# Kaynak ve İstihbarat Stratejisi

## Amaç

Gündemi kaçırmamak için sistemin beslendiği kaynaklar rastgele değil, bilinçli seçilmiş ve puanlanmış olmalıdır.

Bu strateji iki ayrı rolü ayırır:

- `keşif kaynakları`
- `teyit kaynakları`

## Kaynak Grupları

### X Hesapları

Kategoriler:

- resmi kurumlar
- bakanlıklar
- belediyeler
- düzenleyici kurumlar
- siyasi liderler
- parti sözcüleri
- milletvekilleri
- gazeteciler
- ajanslar
- ekonomi ve piyasa hesapları
- yerel muhabirler
- bağımsız gazeteciler

Her hesap için tutulacak alanlar:

- `username`
- `displayName`
- `category`
- `priority`
- `trustScore`
- `isOfficial`
- `isActive`
- `fetchInterval`

### RSS Kaynakları

Kategoriler:

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
- AFAD
- valilik duyuruları
- belediye duyuruları
- bakanlık basın açıklamaları

## Rol Ayrımı

### Keşif Kaynakları

- ajanslar
- bağımsız medya
- saha gazetecileri
- yerel kaynaklar
- yüksek hızda bilgi geçen uzman hesaplar

### Teyit Kaynakları

- resmi kurumlar
- düzenleyici kurumlar
- resmi açıklama yüzeyleri
- mevzuat ve bülten yüzeyleri

## Puanlama Modeli

### Priority

Kaynağın ne kadar sık ve ne kadar öncelikli izleneceğini belirler.

Önerilen aralık:

- `1`: düşük öncelik
- `2`: normal
- `3`: yüksek
- `4`: kritik
- `5`: anlık izleme

### TrustScore

Kaynağın güvenilirliğini belirler.

Önerilen aralık:

- `1`: düşük güven
- `2`: sınırlı güven
- `3`: orta güven
- `4`: yüksek güven
- `5`: resmi veya çok yüksek güven

## Fetch Stratejisi

Örnek fetch sıklıkları:

- `priority 5`: 2-5 dakika
- `priority 4`: 5-10 dakika
- `priority 3`: 10-20 dakika
- `priority 2`: 20-60 dakika
- `priority 1`: 60+ dakika

## İlk Envanter Kuralları

- önce resmi ve yüksek güvenilir kaynaklar eklenir
- sonra kapsama genişliği için medya ve yorumcu katmanı eklenir
- her kaynak kategoriye zorunlu atanır
- kategori boş bırakılmaz

## Riskler

- tek platform bağımlılığı
- düşük kaliteli hesapların gündemi kirletmesi
- clickbait kaynakların cluster kalitesini bozması
- aynı siyasi ekosistemin yankı odası etkisi

## Kritik Denge

- sadece resmi kaynaklara bakmak sistemi geç bırakır
- sadece bağımsız kaynağa bakmak teyit kalitesini düşürür
- doğru yaklaşım: bağımsız kaynaklarla keşfet, resmi kaynaklarla teyit veya çelişkiyi işle

## Sonraki Çıktı

Bu dokümandan sonra oluşturulacak dosya:

- ilk aday X hesap listesi
- ilk aday RSS listesi
- hangi kaynakların seed edileceği
