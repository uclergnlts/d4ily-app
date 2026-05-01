# Admin ve Operasyon Planı

## Amaç

Sistem tamamen otomatik olsa bile insan operatör müdahalesi için net yüzeyler gerekir.

## Admin Panelinin Sorumlulukları

- kaynak ekleme ve düzenleme
- kaynak aktif/pasif yönetimi
- priority ve trustScore ayarı
- cluster gözlemi
- yanlış birleştirmeleri işaretleme
- yanlış teyit statülerini işaretleme
- digest ve özet geçmişi görüntüleme

## İhtiyaç Duyulan Admin Ekranları

### Kaynak Yönetimi

- X hesap listesi
- RSS kaynak listesi
- yardımcı resmi kaynak listesi
- kategori filtresi
- aktif/pasif durumu

### Gündem İzleme

- son oluşan clusterlar
- yüksek importanceScore alan konular
- teyitsiz ama yükselen konular
- çelişkili sinyaller

### Kalite İncelemesi

- yanlış cluster birleşmeleri
- duplicate clusterlar
- verification hataları
- düşük kaliteli özetler

### Operasyon Geçmişi

- son fetch zamanı
- hata logları
- kaynak bazlı başarısızlıklar
- cron çalışma geçmişi

## Manuel Müdahale Noktaları

- kaynağı geçici durdur
- kaynağın puanını güncelle
- clusterı elle böl
- clusterları elle birleştir
- verification durumunu not düş

## Operasyonel Riskler

- kırık RSS kaynakları
- rate limit
- sosyal medya scraping sorunları
- resmi kaynak yapısının değişmesi
- aynı olayın aşırı tekrar edilmesi

## İlk Operasyon Prensibi

- otomasyon her şeyi yapmalı
- ama operatör her kritik katmana müdahale edebilmeli
