# Resmi Kurumlar Genişleme Planı

## Amaç

`v1 verified core` çekirdeğini yalnız birkaç kurumla bırakmamak. İkinci halkada hangi resmi kurumların zorunlu olarak izleneceğini netleştirmek.

Not:

- bu doküman kurum bazlıdır
- X hesap adları kurumlara göre ayrıca doğrulanacaktır
- burada önce `hangi kurum neden izleniyor` sorusunu netliyoruz

## Birinci Halka

Bunlar zaten çekirdek seviyede düşünülmesi gereken kurumlar:

- Resmi Gazete
- AFAD
- T.C. Merkez Bankası
- T.C. İçişleri Bakanlığı
- T.C. Adalet Bakanlığı

## İkinci Halka

### Sağlık

| Kurum | Neden Kritik | İzlenecek Yüzeyler | Öncelik |
| --- | --- | --- | --- |
| T.C. Sağlık Bakanlığı | salgın, ilaç, kamu sağlığı, acil duyurular | resmi site, duyurular, X hesabı | 5 |

### Savunma ve Güvenlik

| Kurum | Neden Kritik | İzlenecek Yüzeyler | Öncelik |
| --- | --- | --- | --- |
| T.C. Milli Savunma Bakanlığı | sınır ötesi gelişmeler, askeri açıklamalar | resmi site, basın açıklamaları, X hesabı | 5 |
| Milli Güvenlik Kurulu ile ilişkili resmi açıklamalar | güvenlik ve strateji gündemi | resmi açıklama metinleri | 4 |

### Ekonomi Yönetimi

| Kurum | Neden Kritik | İzlenecek Yüzeyler | Öncelik |
| --- | --- | --- | --- |
| T.C. Hazine ve Maliye Bakanlığı | bütçe, vergi, ekonomi politikası | resmi site, basın açıklamaları, X hesabı | 5 |
| T.C. Ticaret Bakanlığı | ithalat, ihracat, yaptırım, gümrük | resmi site, duyurular, X hesabı | 4 |
| Borsa İstanbul | piyasa ve endeks tarafı | resmi site, duyurular | 4 |
| SPK | düzenleyici piyasa kararları | resmi site, bültenler, X hesabı | 4 |
| BDDK | bankacılık düzenlemeleri | resmi site, duyurular, X hesabı | 4 |

### Dış Politika ve Diplomasi

| Kurum | Neden Kritik | İzlenecek Yüzeyler | Öncelik |
| --- | --- | --- | --- |
| T.C. Dışişleri Bakanlığı | diplomatik krizler, uluslararası açıklamalar | resmi site, basın açıklamaları, X hesabı | 5 |

### Eğitim ve Toplumsal Alan

| Kurum | Neden Kritik | İzlenecek Yüzeyler | Öncelik |
| --- | --- | --- | --- |
| T.C. Milli Eğitim Bakanlığı | sınav, müfredat, okul kapanışı gibi kitlesel etkili kararlar | resmi site, duyurular, X hesabı | 4 |
| YÖK | üniversite sistemini etkileyen kararlar | resmi site, açıklamalar, X hesabı | 3 |
| ÖSYM | sınav takvimi ve anlık sınav duyuruları | resmi site, duyurular, X hesabı | 4 |

### Enerji ve Altyapı

| Kurum | Neden Kritik | İzlenecek Yüzeyler | Öncelik |
| --- | --- | --- | --- |
| T.C. Enerji ve Tabii Kaynaklar Bakanlığı | enerji arzı, maden, doğal gaz ve elektrik gündemi | resmi site, haberler, X hesabı | 4 |
| T.C. Ulaştırma ve Altyapı Bakanlığı | ulaşım, haberleşme, altyapı krizleri | resmi site, duyurular, X hesabı | 4 |

### Seçim ve Hukuki Süreçler

| Kurum | Neden Kritik | İzlenecek Yüzeyler | Öncelik |
| --- | --- | --- | --- |
| YSK | seçim güvenliği ve resmi seçim kararları | resmi site, duyurular | 5 |
| Anayasa Mahkemesi | kritik hukuk ve siyaset etkili kararlar | resmi site, karar duyuruları | 3 |

### Afet ve Yerel Yönetim

| Kurum | Neden Kritik | İzlenecek Yüzeyler | Öncelik |
| --- | --- | --- | --- |
| İstanbul Valiliği | kriz anlarında doğrudan kamu açıklamaları | resmi site, duyurular, X hesabı | 4 |
| Ankara Valiliği | güvenlik ve kamu düzeni duyuruları | resmi site, duyurular, X hesabı | 4 |
| büyükşehir belediyeleri | altyapı, ulaşım, kriz, yerel afet | resmi site, duyurular, X hesabı | 3 |

## Önceliklendirme Mantığı

### Priority 5

- ulusal çapta anlık etki yaratabilecek kurumlar
- resmi teyit için birincil kaynaklar

### Priority 4

- güçlü ikincil resmi kaynaklar
- sektör veya bölge bazında geniş etki yaratabilecek kurumlar

### Priority 3

- tamamlayıcı ama kritik günlerde yükselebilecek kurumlar

## Kurum Bazlı İzleme Yüzeyleri

Her kurum için ideal olarak 3 yüzey düşünülmeli:

- resmi web sitesi
- resmi duyuru veya basın açıklaması alanı
- resmi X hesabı

Bazı kurumlarda ek yüzeyler:

- RSS
- PDF bülten
- veri tablosu
- basın odası

## Sonraki İş

1. bu listedeki kurumları `zorunlu`, `ikinci halka`, `opsiyonel` diye ayırmak
2. her kurum için gerçek X hesabını doğrulamak
3. her kurum için varsa RSS veya duyuru yüzeyini çıkarmak
4. sonra bunu gerçek seed listesine indirmek
