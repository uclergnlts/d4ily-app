# Kaynak Puanlama Kuralları

## Amaç

Tüm kaynakların aynı seviyede değerlendirilmesini engellemek. Sistem hangi kaynağı ne kadar sık izleyeceğini ve hangi kaynağa ne kadar güveneceğini açık kurallarla bilmeli.

## Priority

`priority` fetch sıklığını ve olay algılama ağırlığını etkiler.

### Priority 5

- anlık veya kritik izleme
- resmi kurumlar
- ajanslar
- afet ve güvenlik kaynakları
- büyük siyasi aktörler

Örnek fetch:

- 2-5 dakika

### Priority 4

- yüksek değerli ama biraz daha az kritik kaynaklar
- büyük ekonomi hesapları
- yüksek güvenilir gazeteciler
- düzenleyici kurumlar

Örnek fetch:

- 5-10 dakika

### Priority 3

- normal gündem akışını besleyen kaynaklar
- büyük medya kuruluşları
- uzman hesaplar

Örnek fetch:

- 10-20 dakika

### Priority 2

- tamamlayıcı kapsam kaynakları

Örnek fetch:

- 20-60 dakika

### Priority 1

- düşük sıklıkla kontrol edilen, arka plan kapsama kaynakları

Örnek fetch:

- 60+ dakika

## TrustScore

`trustScore` verification ve cluster güvenini etkiler.

### TrustScore 5

- resmi kurum
- birincil kaynak
- doğrudan karar veya açıklama sahibi

### TrustScore 4

- yüksek güvenilir ajans
- güçlü editoryal süreç
- birincil kaynağa çok yakın çalışan hesap veya kurum

### TrustScore 3

- çoğu zaman güvenilir ama doğrudan teyit kaynağı olmayan medya veya uzman

### TrustScore 2

- erken sinyal verebilen ama sık hata yapabilen kaynak

### TrustScore 1

- gürültü üretme riski yüksek, ancak bazen erken alarm değeri taşıyan kaynak

## İki Skor Arasındaki Fark

- `priority` sık izleme kararıdır
- `trustScore` doğruluk ve teyit kararıdır

Bir kaynak:

- yüksek priority, düşük trust olabilir
- düşük priority, yüksek trust olabilir

## Resmi Kaynak Kuralı

`isOfficial = true` olan bir kaynak otomatik olarak yüksek trust alır ama her zaman en yüksek priority almak zorunda değildir.

## Kullanım Prensibi

- yüksek trust, teyit için önemlidir
- yüksek priority, erken yakalama için önemlidir
- sistem bu iki kavramı karıştırmamalı
