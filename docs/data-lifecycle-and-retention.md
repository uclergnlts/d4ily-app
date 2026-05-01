# Veri Yaşam Döngüsü ve Saklama Planı

## Amaç

Verinin sisteme girişinden istemciye teslimine kadar hangi aşamalardan geçtiğini tanımlamak.

## Yaşam Döngüsü

1. kaynakta oluşur
2. sisteme çekilir
3. ham olarak saklanır
4. normalize edilir
5. duplicate kontrolünden geçer
6. cluster katmanına bağlanır
7. verification ve ranking alır
8. AI editoryal çıktıya dönüşür
9. API yüzeyine çıkar

## Katmanlar

### Raw

Saklama amacı:

- geri izleme
- hata ayıklama
- parser iyileştirme

### Normalized

Saklama amacı:

- ortak model
- dedup ve cluster girişi

### Clustered

Saklama amacı:

- gündem maddesi üretimi
- önem ve teyit takibi

### Editorial

Saklama amacı:

- istemciye teslim
- geçmiş gündem gösterimi

## Retention Soruları

Henüz cevaplanması gerekenler:

- raw sinyaller ne kadar tutulacak
- duplicate kayıtlar ne kadar saklanacak
- geçmiş clusterlar ne kadar süre erişilebilir olacak
- AI çıktılarının versiyonları tutulacak mı

## İlk İlke

- ham veri erken silinmez
- editoryal çıktı tek gerçek kaynak kabul edilmez
- cluster geçmişi kalite analizi için korunur
