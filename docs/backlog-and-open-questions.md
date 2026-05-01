# Backlog ve Açık Sorular

## Amaç

Henüz karar verilmemiş noktaları kaybetmeden takip etmek.

## Açık Sorular

- X veri çekimi tam olarak hangi yöntemle yapılacak
- resmi kurum siteleri için scraping mi API mi kullanılacak
- clusterlar kalıcı tabloda mı tutulacak, yoksa canlı mı üretilecek
- verification tamamen kurallı mı olacak, yoksa AI destekli ikinci katman olacak mı
- mobil istemci eski gündemleri nasıl gezecek
- kategori taksonomisi sabit mi, dinamik mi olacak

## Teknik Backlog

- kaynak seed listelerinin hazırlanması
- `trustScore` ve `priority` alanlarının mevcut veri yapısına uyarlanması
- canonical hash tasarımı
- entity extraction stratejisi
- cluster depolama modeli
- evaluation dataset oluşturma

## Ürün Backlog

- kullanıcıya teyit rozeti gösterimi
- son güncellenme bilgisi
- yükselen gündem görünümü
- yalnız resmi kaynak filtresi
- yalnız ekonomi / siyaset / afet görünümü

## Operasyon Backlog

- kalite paneli
- kaynak sağlık paneli
- cron başarısızlık uyarıları
- yanlış cluster işaretleme akışı

## Karar Günlüğü

Burada şu tür kararlar tutulmalı:

- neden bazı kaynaklar dışarıda bırakıldı
- neden bazı kategoriler birleştirildi
- neden bazı verification kuralları değişti
