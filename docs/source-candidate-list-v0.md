# Kaynak Aday Listesi v0

## Amaç

Bu dosya mevcut repo içindeki seed ve config listelerinden türetilmiş ilk aday kaynak havuzudur.

Bu liste:

- başlangıç için kullanılır
- sonra tek tek doğrulanır
- `priority` ve `trustScore` revize edilir

Not:

- bu sürüm büyük ölçüde mevcut `lib/config/sources.ts` ve `app/api/admin/seed-sources/route.ts` içeriğinden türetildi
- yani bu bir `çekirdek başlangıç havuzu`, son hali değildir

## Çekirdek X Hesapları

### Resmi ve Kurumsal Hesaplar

| Username | Kategori | Priority | TrustScore | Resmi mi | Fetch Interval | Neden İzleniyor |
| --- | --- | --- | --- | --- | --- | --- |
| `@TC_Icisleri` | bakanlik | 5 | 5 | evet | 5 dk | güvenlik, operasyon ve kamu düzeni açıklamaları |
| `@AFADBaskanlik` | afet | 5 | 5 | evet | 5 dk | afet, deprem ve acil durum sinyalleri |
| `@adalet_bakanligi` | bakanlik | 4 | 5 | evet | 10 dk | adli süreçler ve resmi açıklamalar |
| `@trthaber` | ajans | 4 | 4 | hayır | 10 dk | hızlı genel gündem akışı |
| `@anadoluajansi` | ajans | 5 | 4 | hayır | 5 dk | geniş kapsama ve erken haber akışı |
| `@t24comtr` | medya | 3 | 3 | hayır | 15 dk | hızlı siyasi ve genel gündem takibi |
| `@gazeteduvar` | medya | 3 | 3 | hayır | 15 dk | muhalif ve alternatif gündem sinyali |
| `@medyascope` | medya | 3 | 3 | hayır | 15 dk | röportaj ve siyasi gündem katkısı |
| `@bbcturkce` | medya | 3 | 4 | hayır | 20 dk | uluslararası editoryal doğruluk |
| `@dw_turkce` | medya | 3 | 4 | hayır | 20 dk | dış basın ve Türkiye gündemi kesişimi |

### Siyasi Aktörler

| Username | Kategori | Priority | TrustScore | Resmi mi | Fetch Interval | Neden İzleniyor |
| --- | --- | --- | --- | --- | --- | --- |
| `@RTErdogan` | siyasi_lider | 5 | 5 | evet | 5 dk | cumhurbaşkanlığı düzeyinde birincil açıklamalar |
| `@dbdevletbahceli` | siyasi_lider | 4 | 4 | hayır | 10 dk | MHP ve ittifak gündemi |
| `@eczozgurozel` | siyasi_lider | 4 | 4 | hayır | 10 dk | CHP ana muhalefet çizgisi |
| `@HakanFidan` | bakanlik | 5 | 5 | evet | 5 dk | dış politika ve diplomasi sinyali |
| `@AliYerlikaya` | bakanlik | 5 | 5 | evet | 5 dk | iç güvenlik ve asayiş gündemi |
| `@ekrem_imamoglu` | belediye | 4 | 4 | hayır | 10 dk | İstanbul ve ulusal siyaset etkisi |
| `@mansuryavas06` | belediye | 4 | 4 | hayır | 10 dk | Ankara ve ulusal siyaset etkisi |
| `@meral_aksener` | siyasi_lider | 3 | 4 | hayır | 15 dk | merkez sağ muhalefet gündemi |
| `@alibabacan` | siyasi_lider | 3 | 4 | hayır | 15 dk | ekonomi ve muhalefet gündemi |
| `@umitozdag` | siyasi_lider | 3 | 3 | hayır | 15 dk | göç ve güvenlik tartışmaları |

### Gazeteciler ve Yorumcular

| Username | Kategori | Priority | TrustScore | Resmi mi | Fetch Interval | Neden İzleniyor |
| --- | --- | --- | --- | --- | --- | --- |
| `@nevsinmengu` | gazeteci | 3 | 3 | hayır | 20 dk | siyasi kulis ve gündem takibi |
| `@cuneytozdemir` | gazeteci | 3 | 3 | hayır | 20 dk | ana akım ve dijital kitle sinyali |
| `@ismailsaymaz` | gazeteci | 4 | 4 | hayır | 10 dk | saha ve erken haber sinyali |
| `@muratagirel` | gazeteci | 3 | 3 | hayır | 20 dk | araştırma ve siyaset içerikleri |
| `@barispehlivan` | gazeteci | 3 | 3 | hayır | 20 dk | araştırma ve belge bazlı içerik |
| `@fatihportakal` | gazeteci | 3 | 3 | hayır | 20 dk | geniş kamu etkileşimi |
| `@timursoykan` | gazeteci | 3 | 3 | hayır | 20 dk | adliye ve siyaset ekseni |
| `@cigdemtoker` | ekonomi | 3 | 4 | hayır | 20 dk | ekonomi ve kamu ihale gündemi |

### Ekonomi ve Piyasa

| Username | Kategori | Priority | TrustScore | Resmi mi | Fetch Interval | Neden İzleniyor |
| --- | --- | --- | --- | --- | --- | --- |
| `@memetsimsek` | ekonomi | 5 | 5 | evet | 5 dk | ekonomi yönetimi açıklamaları |
| `@mahfiegilmez` | ekonomi | 3 | 4 | hayır | 20 dk | makro yorum ve erken çerçeve |
| `@OzgrDemirtas` | ekonomi | 3 | 3 | hayır | 20 dk | yüksek etkileşimli ekonomi sinyali |
| `@emrealkin1969` | ekonomi | 3 | 3 | hayır | 20 dk | piyasa ve makro yorum |
| `@iriscibre` | ekonomi | 3 | 3 | hayır | 20 dk | finansal piyasa sinyali |

## Çekirdek RSS Kaynakları

Bu liste mevcut seed route içinden türetildi.

| Kaynak Adı | URL | Kategori | Priority | TrustScore | Resmi mi | Fetch Interval | Neden İzleniyor |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Anadolu Ajansı | `https://www.aa.com.tr/tr/rss/default?cat=guncel` | ajans | 5 | 4 | hayır | 5 dk | yüksek kapsama ve hızlı gündem |
| NTV Gündem | `https://www.ntv.com.tr/gundem.rss` | ulusal_medya | 4 | 4 | hayır | 10 dk | ana akım gündem takibi |
| BBC Türkçe | `http://feeds.bbci.co.uk/turkce/rss.xml` | medya | 3 | 4 | hayır | 20 dk | uluslararası editoryal kalite |
| DW Türkçe | `http://rss.dw-world.de/rdf/rss-tur-all` | medya | 3 | 4 | hayır | 20 dk | dış basın perspektifi |
| BiaNet | `https://bianet.org/rss/bianet` | bagimsiz_medya | 3 | 3 | hayır | 20 dk | insan hakları ve sivil alan takibi |
| BirGün Siyaset | `https://www.birgun.net/rss/kategori/siyaset-8` | siyaset | 3 | 3 | hayır | 20 dk | muhalif siyasi gündem |
| Sputnik Türkiye | `https://tr.sputniknews.com/export/rss2/archive/index.xml` | dunya | 2 | 2 | hayır | 30 dk | alternatif dış politika sinyali |

## Yardımcı Resmi ve Kurumsal Kaynaklar

Bu kaynaklar X veya RSS dışında ayrıca izlenmesi gereken kurumsal yüzeylerdir.

| Kaynak | Tür | URL | Kategori | Priority | TrustScore | Fetch Interval | Neden İzleniyor |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Resmi Gazete | bulletin | `https://www.resmigazete.gov.tr/` | resmi_bulten | 5 | 5 | 30 dk | mevzuat ve idari kararlar |
| AFAD | announcement | `https://www.afad.gov.tr/` | afet | 5 | 5 | 10 dk | resmi afet bildirimleri |
| T.C. Merkez Bankası | market | `https://www.tcmb.gov.tr/` | ekonomi | 5 | 5 | 10 dk | faiz, rapor ve resmi ekonomik kararlar |
| Borsa İstanbul | market | `https://www.borsaistanbul.com/` | ekonomi | 4 | 5 | 15 dk | piyasa ve endeks tarafı |
| Ticaret Bakanlığı | press_release | `https://ticaret.gov.tr/` | ekonomi | 4 | 5 | 20 dk | ticaret ve yaptırım duyuruları |
| Adalet Bakanlığı | press_release | `https://www.adalet.gov.tr/` | hukuk | 4 | 5 | 20 dk | adli ve mevzuat açıklamaları |

## İlk Revizyon Notları

Bu listedeki açık problemler:

- bazı X hesapları eski veya yeniden doğrulanmaya muhtaç olabilir
- bazı RSS kaynakları editoryal çeşitlilik açısından zayıf kalabilir
- bazı medya kaynaklarının `trustScore` değeri yalnız başlangıç tahminidir
- ekonomi, afet ve güvenlik tarafında resmi kaynak kapsaması daha da genişletilmelidir

## Sonraki İş

Bu dosyadan sonra yapılacak en doğru adım:

1. listedeki hesapları tek tek doğrulamak
2. fazla gürültü üretenleri ayırmak
3. eksik resmi kurumları eklemek
4. bu listeyi seed edilecek gerçek `v1` kaynak listesine dönüştürmek
