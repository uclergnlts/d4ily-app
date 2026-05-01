# Değerlendirme ve Kalite Planı

## Amaç

Gündem dedektörü iyi çalışıyor mu sorusunu ölçülebilir hale getirmek.

## Ana Sorular

- büyük gündem maddelerini yakalıyor mu
- aynı olayı gereksiz çoğaltıyor mu
- teyitsiz içeriği yanlış işaretliyor mu
- önemsiz sinyalleri aşırı yukarı taşıyor mu
- geç kalıyor mu

## Ölçüm Başlıkları

### Coverage

Sistemin günün büyük olaylarını yakalama oranı.

Sorular:

- manuel olarak seçtiğimiz 10 önemli olayın kaçı listede var
- olay ne kadar gecikmeyle listede göründü

### Dedup Quality

Sistemin aynı olayı tek başlık altında toplayabilme başarısı.

Sorular:

- tek olay kaç ayrı cluster oldu
- alakasız olaylar birleşti mi

### Verification Quality

Teyit kararlarının doğruluğu.

Sorular:

- `confirmed` olan gerçekten teyitli mi
- `unverified` olan erken mi bırakıldı
- `conflicting` kararı doğru yerde mi çıktı

### Ranking Quality

Önem sıralamasının kalitesi.

Sorular:

- üst sıralardaki maddeler gerçekten günün ana gündemi mi
- düşük etkili ama yüksek etkileşimli sinyaller sistemi bozuyor mu

### Summary Quality

AI özetlerinin editoryal kalitesi.

Sorular:

- kısa ve doğru mu
- kaynak dışı bilgi ekliyor mu
- belirsizlikleri doğru ifade ediyor mu

## İlk Test Prosedürü

1. örnek gün seç
2. o günün elle hazırlanmış gerçek gündem listesini oluştur
3. sistem çıktısıyla karşılaştır
4. eksik, fazla ve yanlış cluster'ları not al
5. nedenlerini sınıflandır

## Hata Türleri

- `missed_major_topic`
- `duplicate_cluster`
- `wrong_merge`
- `wrong_verification`
- `bad_ranking`
- `hallucinated_summary`

## Kalite Notu

AI katmanı ayrı, toplama/cluster kalitesi ayrı ölçülmeli. Zayıf veri kalitesi güçlü prompt ile çözülemez.
