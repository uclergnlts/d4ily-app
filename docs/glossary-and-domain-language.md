# Sözlük ve Alan Dili

## Amaç

Projede herkesin aynı kelimelerle aynı şeyi kastetmesini sağlamak.

## Temel Kavramlar

### Signal

Sisteme dış kaynaktan gelen tekil veri girdisi.

Örnek:

- bir tweet
- bir RSS kaydı
- bir resmi açıklama

### Raw Signal

İlk geldiği haliyle saklanan sinyal.

İçerir:

- ham payload
- kaynağa özel alanlar

### Normalized Signal

Ortak veri modeline çevrilmiş sinyal.

İçerir:

- ortak başlık
- içerik
- yayın zamanı
- kaynak puanı

### Duplicate

Birebir aynı veya neredeyse aynı sinyal.

### Cluster

Aynı olaya ait birden fazla sinyalin toplandığı grup.

### Agenda Topic

İstemciye gösterilecek gündem maddesi. Cluster'ın kullanıcıya sunulan ürün halidir.

### Verification

Bir gündem maddesinin teyit durumu.

### Importance Score

Bir gündem maddesinin ne kadar yukarıda görünmesi gerektiğini belirleyen puan.

### Official Source

Doğrudan olayın birincil sahibi veya kurumsal açıklama kaynağı.

### Editorial Layer

AI veya insan editörün kullanıcıya gösterilecek nihai anlatımı üretme katmanı.

## Durum Alanları

### Verification Status

- `confirmed`
- `likelyConfirmed`
- `unverified`
- `conflicting`

### Source Priority

Kaynağın ne kadar sık izleneceğini belirler.

### TrustScore

Kaynağın doğruluk ve teyit değerini belirler.

## Dikkat Edilecek Dil Kuralları

- `haber` ile `gündem maddesi` aynı şey değildir
- `signal` ile `topic` aynı şey değildir
- `priority` ile `trustScore` aynı şey değildir
- `AI summary` ile `verification decision` aynı katman değildir
