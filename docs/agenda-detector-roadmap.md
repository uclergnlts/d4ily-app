# Gündem Dedektörü Yol Haritası

## Ürün Tanımı

Bu ürün bir haber listesi değil, `gündem dedektörü`dür.

Sistemin ana sorumlulukları:

- kritik sinyalleri kaçırmamak
- aynı olaya ait içerikleri tek başlıkta toplamak
- konuları önem sırasına koymak
- hangi bilginin teyitli olduğunu ayırmak
- sonunda kısa ve güvenilir özet üretmek

## Başarı Kriterleri

İlk sürüm için başarı ölçütleri:

- büyük gündem maddelerini kaçırmama
- aynı olayın gereksiz tekrarını azaltma
- teyitsiz bilgi ile teyitli bilgiyi ayırma
- mobil istemciye temiz `agenda` çıktısı verme

## Aşamalar

### Aşama 1

Kaynak envanteri ve kaynak puanlama sistemi.

Çıktılar:

- X hesap listesi
- RSS kaynak listesi
- resmi ve yardımcı kaynak listesi
- `priority` ve `trustScore` kuralları

### Aşama 2

Ham veri havuzu ve ortak sinyal modeli.

Çıktılar:

- normalize veri sözleşmesi
- `sourceType` bazlı kayıt şeması
- duplicate kontrolüne hazırlık

### Aşama 3

Dedup, cluster ve gündem maddesi üretimi.

Çıktılar:

- cluster kuralları
- topic slug üretimi
- önem puanı
- teyit statüsü

### Aşama 4

AI editoryal katman.

Çıktılar:

- özet
- neden önemli
- teyit açıklaması
- izlenecek sonraki adım

### Aşama 5

API teslimatı ve kalite ölçümü.

Çıktılar:

- `v1/agenda`
- `v1/agenda/[slug]`
- değerlendirme seti
- günlük kalite kontrolü

## İlk Uygulama Önceliği

1. Kaynak kapsamı
2. Güven skoru
3. Ham sinyal modeli
4. Dedup
5. Cluster
6. Verification
7. AI summary
8. API stabilization

## Karar Prensipleri

- önce veri kapsamı, sonra AI
- önce deterministik teyit, sonra dil üretimi
- önce kaçırmama, sonra estetik özet
- önce kaynak güveni, sonra engagement
