# AI Prompt ve Çıktı Tasarımı

## Amaç

AI katmanını rastgele promptlardan çıkarıp kontrollü üretim sistemine dönüştürmek.

## Prompt Katmanları

### 1. System Prompt

AI'nin rolünü tanımlar:

- editoryal yardımcı
- veri uydurmayan özetleyici
- teyit kararını açıklayan anlatıcı

### 2. Task Prompt

O anda işlenen cluster için görevi tanımlar:

- başlık üret
- özet üret
- neden önemli açıkla
- watch-next üret

### 3. Structured Input

AI'ye ham metin yerine yapılandırılmış veri verilmelidir.

Örnek giriş parçaları:

- cluster title candidate
- article bullets
- tweet bullets
- verification status
- verification reason
- importance score

## Çıktı Alanları

- `title`
- `summary`
- `whyItMatters`
- `verificationStatus`
- `verificationReason`
- `watchNext`
- `confidenceNote`

## Yazım İlkeleri

- kısa
- doğrudan
- teyit dili net
- yorum ile olgu ayrımı açık
- korku veya sansasyon üretmeyen ton

## Yasaklar

- kaynakta olmayan bilgi eklemek
- belirsiz bilgiyi kesin diye anlatmak
- verification sonucunu değiştirmek
- clickbait başlık üretmek

## Prompt Revizyon Döngüsü

1. örnek cluster seç
2. AI çıktısını incele
3. hata tipini sınıflandır
4. system veya task promptu revize et
5. aynı örneklerle yeniden ölç

## Sonraki Çıktı

Bu dokümandan sonra üretilecek:

- gerçek system prompt
- gerçek JSON output schema
- few-shot örnek seti
