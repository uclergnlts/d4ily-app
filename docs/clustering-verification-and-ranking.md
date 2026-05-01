# Cluster, Teyit ve Sıralama Planı

## Amaç

Ham sinyalleri anlamlı gündem başlıklarına dönüştürmek.

## Dedup

İki seviye dedup gerekir:

- birebir duplicate
- aynı olaya ait farklı anlatımlar

İlk seviye kurallar:

- aynı URL
- aynı tweet ID
- aynı canonical hash

## Cluster Mantığı

Cluster kararında kullanılacak sinyaller:

- başlık benzerliği
- içerik benzerliği
- ortak anahtar kelime
- ortak kişi/kurum/yer adı
- zaman yakınlığı
- kategori uyumu
- resmi kaynak eşleşmesi

## Cluster Çıktısı

Her cluster için:

- `slug`
- `title`
- `summary`
- `keywords`
- `category`
- `signalCount`
- `newsCount`
- `tweetCount`
- `sourceCount`
- `officialSourceCount`
- `firstSeenAt`
- `lastUpdatedAt`

## Verification Status

İlk sürüm statüleri:

- `confirmed`
- `likelyConfirmed`
- `widelyReported`
- `unverified`
- `officiallyDenied`
- `conflicting`

## Verification Kuralları

- resmi kaynak varsa `confirmed`
- iki veya daha fazla yüksek güvenilir bağımsız kaynak varsa `likelyConfirmed`
- çok sayıda bağımsız kaynak ve gazeteci tarafından geçiliyor ama resmi teyit yoksa `widelyReported`
- yalnız zayıf sosyal sinyal varsa `unverified`
- resmi kurum açıkça reddediyor ama sahada güçlü sinyal devam ediyorsa `officiallyDenied`
- çelişkili güçlü kaynak varsa `conflicting`

## Kritik Kural

- `resmi yalanlama = olay yok` kabul edilmemelidir
- resmi yalanlama ayrı veri noktasıdır
- bağımsız güçlü sinyal ayrı veri noktasıdır

## ImportanceScore

Puan bileşenleri:

- kaynak sayısı
- resmi kaynak sayısı
- güven puanı
- etkileşim
- güncellik
- kategori önceliği
- kamu etkisi

## Kategori Öncelik Örneği

Yüksek öncelik:

- siyaset
- ekonomi
- güvenlik
- afet
- diplomasi

Orta öncelik:

- teknoloji
- spor
- kültür

## Hatalı Cluster Riskleri

- aynı kişiye ait farklı olayların birleşmesi
- farklı bağlamdaki başlıkların tek gündem olması
- clickbait başlıkların yanlış eşleştirme yaratması
- çok genel anahtar kelimelerin gürültü üretmesi

## İlk Değerlendirme Soruları

- büyük olayları yakaladı mı
- tek olayı gereksiz çoğalttı mı
- ilgisiz sinyalleri birleştirdi mi
- teyit seviyesini doğru verdi mi
