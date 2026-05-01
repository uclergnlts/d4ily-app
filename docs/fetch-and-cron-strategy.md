# Fetch ve Cron Stratejisi

## Amaç

Hangi kaynakların ne sıklıkta ve hangi sırayla çekileceğini tanımlamak.

## Temel İlke

Her kaynağı aynı sıklıkta çekmek doğru değildir.

Sıklık şunlara göre değişir:

- priority
- kaynak tipi
- güven seviyesi
- kırılma anlarında önem

## Cron Katmanları

### Fast Lane

Amaç:

- anlık ve kritik sinyalleri toplamak

Kaynaklar:

- priority 5 X hesapları
- ajans RSS kaynakları
- afet ve güvenlik kaynakları

Örnek sıklık:

- 2-5 dakika

### Standard Lane

Amaç:

- genel gündem akışını toplamak

Kaynaklar:

- büyük medya RSS kaynakları
- priority 3-4 hesaplar
- ekonomi kaynakları

Örnek sıklık:

- 10-20 dakika

### Slow Lane

Amaç:

- arka plan ve tamamlayıcı kapsam

Kaynaklar:

- düşük öncelikli medya
- uzman yorumcular
- yavaş güncellenen resmi sayfalar

Örnek sıklık:

- 30-60+ dakika

## Fetch Başarısızlık Politikası

- geçici hata ise yeniden dene
- sürekli hata veren kaynağı işaretle
- admin tarafında görünür yap
- kaynak kalıcı bozulduysa incelemeye al

## Rate Limit Riski

Özellikle sosyal medya tarafında:

- kaynakları priority'ye göre sırala
- kritik hesapları garantiye al
- düşük öncelikli kaynakları düşür

## Sonraki Karar

Bu dokümandan sonra netleşecek:

- mevcut workflow'ların hangisi korunacak
- hangileri yeniden adlandırılacak
- master cron akışı nasıl sadeleşecek
