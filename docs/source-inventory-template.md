# Kaynak Envanteri Şablonu

## Amaç

Bu dosya gerçek kaynak listesini doldurmak için kullanılacak çalışma şablonudur.

Kurallar:

- her kaynak bir kategoriye ait olmalı
- her kaynak için `priority` verilmeli
- her kaynak için `trustScore` verilmeli
- resmi kaynaklar açık işaretlenmeli
- neden eklendiği kısa not olarak yazılmalı

## X Hesapları

| Username | Görünen Ad | Kategori | Priority | TrustScore | Resmi mi | Fetch Interval | Neden İzleniyor |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `@ornek` | Ornek Hesap | resmi_kurum | 5 | 5 | evet | 5 dk | birincil açıklama kaynağı |

### Kategori Sözlüğü

- `resmi_kurum`
- `bakanlik`
- `belediye`
- `duzenleyici_kurum`
- `siyasi_lider`
- `parti_sozcusu`
- `milletvekili`
- `gazeteci`
- `ajans`
- `ekonomi`
- `afet`
- `guvenlik`

## RSS Kaynakları

| Kaynak Adı | URL | Kategori | Priority | TrustScore | Resmi mi | Fetch Interval | Neden İzleniyor |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ornek Ajans | `https://example.com/rss.xml` | ajans | 5 | 5 | hayır | 5 dk | hızlı ve geniş kapsama |

### RSS Kategori Sözlüğü

- `ajans`
- `ulusal_medya`
- `bagimsiz_medya`
- `ekonomi`
- `dunya`
- `spor`
- `teknoloji`
- `yerel`

## Yardımcı Resmi Kaynaklar

| Kaynak | Tür | URL | Kategori | Priority | TrustScore | Fetch Interval | Neden İzleniyor |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Resmi Gazete | bulletin | `https://www.resmigazete.gov.tr/` | resmi_bulten | 5 | 5 | 30 dk | mevzuat ve kararlar |

### Yardımcı Kaynak Türleri

- `bulletin`
- `announcement`
- `market`
- `press_release`
- `manual_feed`

## Not Alanı

Buraya şu tür kararlar yazılır:

- neden bazı kaynaklar düşük güvenli ama yine de izleniyor
- hangi kaynakların yalnız erken sinyal için tutulduğu
- hangi kaynakların teyit için değil kapsama için kullanıldığı
