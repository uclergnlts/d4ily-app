# Uygulama Fazları

## Amaç

Bu doküman planı gerçek geliştirme sırasına çevirir.

## Faz 0: Plan ve Kapsam

Hedef:

- ürün tanımını sabitlemek
- kaynak stratejisini netleştirmek
- kalite kriterlerini yazmak

Teslimler:

- kaynak matrisi
- puanlama kuralları
- veri modeli kararı
- API hedef yüzeyi

Çıkış kriteri:

- ekip neyi neden yaptığını biliyor
- ilk implementasyon sırası tartışmasız net

## Faz 1: Kaynak Toplama Omurgası

Hedef:

- X kaynakları
- RSS kaynakları
- yardımcı resmi kaynaklar

Teslimler:

- seed listeleri
- fetch sıklıkları
- normalize kayıt formatı
- ham veri havuzu

Çıkış kriteri:

- sistem düzenli veri çekiyor
- aynı veri tipleri ortak modele düşüyor

## Faz 2: Dedup ve Cluster

Hedef:

- aynı sinyalleri temizlemek
- aynı olayı tek cluster altında toplamak

Teslimler:

- canonical hash mantığı
- duplicate kuralları
- cluster üretimi
- cluster kalite ölçümü

Çıkış kriteri:

- büyük gündem maddeleri ayrı ayrı ama tekil görünmeye başlıyor

## Faz 3: Verification ve Ranking

Hedef:

- teyit durumu üretmek
- konuları önem sırasına koymak

Teslimler:

- `verificationStatus`
- `verificationReason`
- `importanceScore`
- kategori öncelik kuralları

Çıkış kriteri:

- liste hem doğru hem editoryal olarak anlamlı sıralanıyor

## Faz 4: AI Editoryal Katman

Hedef:

- gündem maddelerini okunabilir hale getirmek

Teslimler:

- system prompt
- output schema
- özet üretimi
- watch-next üretimi

Çıkış kriteri:

- AI çıktısı kısa, doğru ve kontrollü

## Faz 5: API ve İstemci Tüketimi

Hedef:

- mobil istemci için temiz teslimat yüzeyi sağlamak

Teslimler:

- `GET /api/v1/agenda`
- `GET /api/v1/agenda/[slug]`
- stabil DTO şeması

Çıkış kriteri:

- mobil istemci yalnız `agenda` yüzeyiyle anlamlı ürün deneyimi kurabiliyor

## Faz 6: Sürekli İyileştirme

Hedef:

- kaçırma oranını azaltmak
- yanlış cluster ve yanlış teyitleri düşürmek

Teslimler:

- değerlendirme seti
- günlük kalite raporu
- kaynak revizyonları
- prompt revizyonları
