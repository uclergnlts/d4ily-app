# AI Editoryal Katman Planı

## Amaç

AI bu sistemde gazetecilik refleksi olan bir editör gibi davranmalı, ama veri uyduran bir anlatıcı olmamalı.

## AI'nin Rolü

AI şu işleri yapar:

- cluster için temiz başlık yazar
- kısa özet çıkarır
- neden önemli olduğunu belirtir
- teyit statüsünü açıklar
- sırada hangi gelişmenin izleneceğini söyler
- resmi açıklama ile bağımsız kaynaklar arasında fark varsa bunu görünür kılar

AI şu işleri yapmaz:

- kaynakta olmayan bilgi üretmez
- teyitsiz bilgiyi kesin diye anlatmaz
- verification motorunu override etmez
- veri toplama işini üstlenmez
- resmi inkâr varsa ama güçlü bağımsız sinyal sürüyorsa bunu saklamaz

## Girdi

AI'ye verilecek paket:

- cluster title candidate
- related articles
- related tweets
- source counts
- official source counts
- verification status
- verification reason
- importance score

## Çıktı Şeması

- `title`
- `summary`
- `whyItMatters`
- `verificationStatus`
- `verificationReason`
- `watchNext`
- `confidenceNote`

## Stil Kuralları

- kısa
- doğrudan
- teyit dili net
- sansasyon yok
- yorum ile olgu ayrımı net

## Prompt İlkeleri

- önce kaynak gerçekliğini koru
- sonra sadeleştir
- sonra önem vurgusu yap
- belirsizliği gizleme

## Koruma Kuralları

- \"emin değilse emin değilim de\"
- \"tek kaynağa dayanıyorsa bunu açık söyle\"
- \"resmi teyit yoksa teyit varmış gibi konuşma\"
- \"çelişkili bilgi varsa bunu saklama\"
- \"resmi inkâr varsa ama bağımsız güçlü raporlama sürüyorsa bunu açık yaz\"

## Sonraki Çıktı

Bu dokümandan sonra hazırlanacaklar:

- system prompt
- output schema
- örnek few-shot seti
- kalite kontrol checklist'i
