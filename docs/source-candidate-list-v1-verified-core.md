# Kaynak Aday Listesi v1 Verified Core

## Amaç

Bu dosya geniş `v0` havuzundan ayrılan daha dar ve daha güvenilir başlangıç çekirdeğidir.

İlke:

- önce doğrulanabilen resmi ve birincil kaynaklar
- sonra yüksek güvenilir ajans ve medya
- yorumcu ve gürültülü hesaplar bu listeye alınmaz

Not:

- burada yer alan bazı X hesapları doğrudan resmi kurum sitelerinde veya resmi kurum içeriklerinde referanslandı
- doğrulaması henüz net olmayan hesaplar `v0` havuzunda kalır, bu çekirdeğe alınmaz

## Doğrulanmış Çekirdek X Hesapları

### Resmi Kurumlar

| Username | Kategori | Priority | TrustScore | Resmi mi | Fetch Interval | Doğrulama Notu |
| --- | --- | --- | --- | --- | --- | --- |
| `@Merkez_Bankasi` | ekonomi | 5 | 5 | evet | 5 dk | TCMB sosyal medya sayfasında resmi X hesabı olarak geçiyor |
| `@CentralBank_TR` | ekonomi | 3 | 5 | evet | 30 dk | TCMB tarafından resmi İngilizce X hesabı olarak listeleniyor |
| `@TCMBBlog` | ekonomi | 2 | 5 | evet | 60 dk | TCMB tarafından resmi hesap olarak listeleniyor |
| `@TCMB_Arastirma` | ekonomi | 3 | 5 | evet | 30 dk | TCMB basın duyurusunda resmi hesap olarak geçiyor |
| `@AFADBaskanlik` | afet | 5 | 5 | evet | 5 dk | AFAD doküman ve yayınlarında kurumsal hesap olarak iz bırakıyor |
| `@adalet_bakanlik` | hukuk | 4 | 5 | evet | 10 dk | adalet.gov.tr alt sayfalarında resmi X hesabı olarak referanslanıyor |

### Resmi Aktörler

| Username | Kategori | Priority | TrustScore | Resmi mi | Fetch Interval | Doğrulama Notu |
| --- | --- | --- | --- | --- | --- | --- |
| `@AliYerlikaya` | bakanlik | 5 | 5 | evet | 5 dk | İçişleri Bakanlığı yayınlarında birincil açıklama kaynağı olarak referanslanıyor |

## Çekirdek RSS Kaynakları

Bu kaynaklar şu aşamada geniş kapsama ve görece güvenilir başlangıç akışı sağlamak için tutuluyor.

| Kaynak Adı | URL | Kategori | Priority | TrustScore | Resmi mi | Fetch Interval | Not |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Anadolu Ajansı | `https://www.aa.com.tr/tr/rss/default?cat=guncel` | ajans | 5 | 4 | hayır | 5 dk | çekirdek genel haber akışı |
| NTV Gündem | `https://www.ntv.com.tr/gundem.rss` | ulusal_medya | 4 | 4 | hayır | 10 dk | ana akım gündem kapsaması |
| BBC Türkçe | `http://feeds.bbci.co.uk/turkce/rss.xml` | medya | 3 | 4 | hayır | 20 dk | editoryal kalite ve dış perspektif |
| DW Türkçe | `http://rss.dw-world.de/rdf/rss-tur-all` | medya | 3 | 4 | hayır | 20 dk | Türkiye ve dış gündem karışımı |
| BiaNet | `https://bianet.org/rss/bianet` | bagimsiz_medya | 3 | 3 | hayır | 20 dk | hak temelli ve alternatif gündem |

## Yardımcı Resmi Kaynaklar

| Kaynak | Tür | URL | Kategori | Priority | TrustScore | Fetch Interval | Not |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Resmi Gazete | bulletin | `https://www.resmigazete.gov.tr/` | resmi_bulten | 5 | 5 | 30 dk | mevzuat ve resmi kararlar |
| AFAD | announcement | `https://www.afad.gov.tr/` | afet | 5 | 5 | 10 dk | afet ve acil durum |
| T.C. Merkez Bankası | market | `https://www.tcmb.gov.tr/` | ekonomi | 5 | 5 | 10 dk | para politikası ve resmi ekonomik kararlar |
| T.C. İçişleri Bakanlığı | press_release | `https://www.icisleri.gov.tr/` | guvenlik | 5 | 5 | 10 dk | güvenlik, asayiş ve kamu düzeni açıklamaları |
| T.C. Adalet Bakanlığı | press_release | `https://www.adalet.gov.tr/` | hukuk | 4 | 5 | 20 dk | resmi adli açıklamalar |

## Bu Sürümde Bilerek Dışarıda Bırakılanlar

- çok sayıda gazeteci hesabı
- siyasi yorumcu hesapları
- doğrulama durumu net olmayan kurumsal X hesapları
- erken sinyal üreten ama güven seviyesi düşük kaynaklar

## Sonraki İş

1. diğer bakanlık ve resmi kurum hesaplarını tek tek doğrulamak
2. resmi kurumlar çekirdeğini genişletmek
3. ajans ve medya tarafında ikinci halka oluşturmak
4. `v1 verified core` listesini gerçek seed planının temeli yapmak
