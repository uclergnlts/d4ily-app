# Resmi Kaynak Yüzey Eşleme Tablosu

## Amaç

`must-have` kurumların hangi somut yüzeylerden izleneceğini netleştirmek.

Bu doküman:

- kurum bazlı düşünceden
- seed edilebilir yüzey bazlı düşünceye

geçiş katmanıdır.

## Kullanım Notu

Her kurum için mümkün olduğunda üç yüzey hedeflenir:

- resmi web ana yüzeyi
- resmi duyuru / basın açıklaması yüzeyi
- resmi X hesabı

RSS varsa ayrıca işaretlenir.

## Çekirdek Eşleme

| Kurum | Resmi Web | Duyuru / Basın Yüzeyi | Resmi X | RSS | Not |
| --- | --- | --- | --- | --- | --- |
| Resmi Gazete | `https://www.resmigazete.gov.tr/` | ana yayın yüzeyi aynı | yok | yok | mevzuat ve resmi kararlar için zorunlu |
| T.C. İçişleri Bakanlığı | `https://www.icisleri.gov.tr/` | `https://www.icisleri.gov.tr/haberler` ve kurum haber/detay sayfaları | birincil açıklama yüzeyi olarak çoğu içerikte `@AliYerlikaya` referanslanıyor | yok | kurum hesabı ayrıca doğrulanmalı, ama pratikte bakan hesabı ana sinyal kaynağı gibi kullanılıyor |
| AFAD | `https://www.afad.gov.tr/` | duyuru ve afet bilgilendirme sayfaları | `@AFADBaskanlik` | yok | afet teyidi için birincil kaynak |
| T.C. Merkez Bankası | `https://www.tcmb.gov.tr/` | basın duyuruları ve karar metinleri | `@Merkez_Bankasi`, `@CentralBank_TR`, `@TCMBBlog`, `@TCMB_Arastirma` | yok | TCMB duyurusunda resmi X hesapları açıkça belirtiliyor |
| T.C. Adalet Bakanlığı | `https://www.adalet.gov.tr/` | haberler ve basın yüzeyi | `@adalet_bakanlik` | yok | Adalet Bakanlığı resmi sosyal medya sayfasında X hesabı geçiyor |
| T.C. Milli Savunma Bakanlığı | `https://www.msb.gov.tr/` | basın ve duyuru alanı | doğrulanacak | varsa sonra | kurum kritik ama X eşleşmesi ayrıca netleştirilmeli |
| T.C. Hazine ve Maliye Bakanlığı | `https://www.hmb.gov.tr/` | basın duyuruları ve haberler | doğrulanacak | varsa sonra | ekonomi yönetimi için zorunlu |
| T.C. Ticaret Bakanlığı | `https://ticaret.gov.tr/` | duyurular ve basın açıklamaları | doğrulanacak | varsa sonra | ticaret ve yaptırım etkisi yüksek |
| T.C. Dışişleri Bakanlığı | `https://www.mfa.gov.tr/` | açıklamalar / no'lu duyurular | doğrulanacak | varsa sonra | diplomasi teyidi için kritik |
| T.C. Sağlık Bakanlığı | `https://www.saglik.gov.tr/` | duyuru ve açıklama yüzeyleri | doğrulanacak | varsa sonra | kamu sağlığı açısından zorunlu |
| T.C. Milli Eğitim Bakanlığı | `https://www.meb.gov.tr/` | duyurular ve basın açıklamaları | doğrulanacak | varsa sonra | milyonlarca kişiyi etkileyen kararlar |
| ÖSYM | `https://www.osym.gov.tr/` | duyurular yüzeyi | doğrulanacak | varsa sonra | sınav kararı ve acil duyurular |
| YSK | `https://www.ysk.gov.tr/` | kurul karar ve duyuru sayfaları | doğrulanacak | varsa sonra | seçim dönemlerinde kritik |
| Borsa İstanbul | `https://www.borsaistanbul.com/` | duyuru ve veri yüzeyleri | doğrulanacak | varsa sonra | piyasa etkisi |
| SPK | `https://www.spk.gov.tr/` | bülten ve duyurular | doğrulanacak | varsa sonra | sermaye piyasası düzenlemeleri |
| BDDK | `https://www.bddk.org.tr/` | basın açıklamaları ve duyurular | doğrulanacak | varsa sonra | bankacılık sistemi etkisi |

## Doğrulama Durumu

### Yüzeyi netleşenler

- Resmi Gazete
- AFAD
- TCMB
- Adalet Bakanlığı
- İçişleri Bakanlığı ana web ve haber yüzeyi

### Kurum düzeyi net ama hesap düzeyi tamamlanmayanlar

- Milli Savunma Bakanlığı
- Hazine ve Maliye Bakanlığı
- Ticaret Bakanlığı
- Dışişleri Bakanlığı
- Sağlık Bakanlığı
- Milli Eğitim Bakanlığı
- ÖSYM
- YSK
- Borsa İstanbul
- SPK
- BDDK

## Seed Öncesi Kontrol Listesi

Her kurum için:

1. ana domain doğru mu
2. duyuru veya basın yüzeyi hangisi
3. resmi X hesabı doğrulandı mı
4. RSS varsa kaydedildi mi
5. fetch sıklığı verildi mi

## Sonraki İş

Bu dosyadan sonra yapılacak en doğru adım:

- `doğrulanacak` olarak işaretlenen kurumların gerçek X hesaplarını ve duyuru yüzeylerini tek tek kesinleştirmek
- ardından seed'e hazır `final official surfaces` listesi çıkarmak
