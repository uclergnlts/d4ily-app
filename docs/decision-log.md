# Karar Günlüğü

## Amaç

Önemli mimari ve ürün kararlarını zaman içinde kaybetmemek.

## Kayıt Formatı

Her karar için:

- tarih
- karar başlığı
- neden
- etkisi
- açık risk

## Kararlar

### Karar 1

Başlık:

- ürün `haber listesi` değil `gündem dedektörü` olarak konumlanacak

Neden:

- kullanıcıya tek tek içerik değil, anlamlandırılmış gündem sunmak isteniyor

Etkisi:

- ana veri birimi `agenda topic` olacak
- `news` ve `tweets` destek katmanı olacak

Risk:

- cluster ve verification kalitesi ürün başarısını belirler

### Karar 2

Başlık:

- önce plan ve dokümantasyon, sonra implementasyon

Neden:

- veri kapsamı ve ürün mantığı netleşmeden erken kod üretmek kırılganlık yaratır

Etkisi:

- ilk aşamada `.md` dokümanları hazırlanıyor

Risk:

- dokümanlar düzenli güncellenmezse hızla eskiyebilir

### Karar 3

Başlık:

- AI tek karar verici olmayacak

Neden:

- teyit ve önem kararlarının deterministik ve denetlenebilir olması gerekiyor

Etkisi:

- AI editoryal katmanda kalacak

Risk:

- kurallı katman zayıf olursa AI kalitesi tek başına yeterli olmaz
