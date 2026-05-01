# Bağımsız Kaynak Aday Listesi v0

## Amaç

Bu dosya `keşif katmanı` için ilk bağımsız medya ve gazeteci havuzunu tanımlar.

Bu liste:

- resmi teyit için değil
- erken sinyal, saha bilgisi ve görünmez bırakılan gündem için

kullanılır.

## Kullanım İlkesi

Bu listedeki kaynaklar üç role ayrılır:

- `erken sinyal`
- `yüksek güven`
- `yüksek gürültü ama takip edilmeye değer`

Bir kaynağın bağımsız olması onu otomatik olarak doğru yapmaz.
Bir kaynağın resmi olmaması da onu değersiz yapmaz.

## Bağımsız Medya Kuruluşları

| Kaynak | Web | Kategori | Rol | Priority | TrustScore | Neden İzleniyor |
| --- | --- | --- | --- | --- | --- | --- |
| T24 | `https://t24.com.tr/` | bagimsiz_medya | yüksek güven | 4 | 4 | geniş siyaset ve gündem kapsaması |
| Medyascope | `https://medyascope.tv/` | bagimsiz_medya | yüksek güven | 4 | 4 | siyaset, yorum ve program bazlı derinlik |
| bianet | `https://bianet.org/` | hak_odakli | yüksek güven | 3 | 4 | insan hakları, ifade özgürlüğü, görünmez kalan dosyalar |
| Diken | `https://www.diken.com.tr/` | bagimsiz_medya | erken sinyal | 3 | 3 | hızlı gündem ve muhalif editoryal akış |
| Evrensel | `https://www.evrensel.net/` | emek_odakli | erken sinyal | 3 | 3 | emek, işçi, sendika ve saha gündemi |
| BirGün | `https://www.birgun.net/` | bagimsiz_medya | erken sinyal | 3 | 3 | siyaset ve muhalif gündem |
| Gazete Karınca | `https://gazetekarinca.com/` | hak_odakli | erken sinyal | 2 | 3 | hak ihlalleri ve görünmeyen başlıklar |
| Artı Gerçek | `https://artigercek.com/` | bagimsiz_medya | erken sinyal | 2 | 3 | muhalif ve bölgesel gündem |
| Yetkin Report | `https://yetkinreport.com/` | analiz | yüksek güven | 2 | 4 | siyaset ve diplomasi analizi |
| Teyit | `https://teyit.org/` | dogrulama | yüksek güven | 2 | 5 | yanlış bilgi ve teyit kontrolü |

## Saha ve Beat Gazetecileri

Bu blok tek tek kişi doğrulaması gerektirir. İlk aday havuz şu şekilde düşünülmeli:

### Adliye ve Yargı

- adliye muhabirleri
- mahkeme ve soruşturma takibi yapan gazeteciler
- insan hakları ihlallerini takip eden isimler

### Siyaset

- meclis muhabirleri
- parti kulisi takip eden gazeteciler
- belediye ve yerel siyaset izleyen muhabirler

### Afet ve Güvenlik

- deprem, yangın, sel, afet sahası takip eden gazeteciler
- kriz anında olay yerinden doğrulanabilir bilgi geçen muhabirler

### Ekonomi

- ekonomi muhabirleri
- bankacılık, piyasa ve kamu maliyesi izleyen gazeteciler

## Mevcut Repo İçinden Dikkat Çeken Gazeteci Adayları

Bu blok, mevcut `lib/config/sources.ts` içindeki aday havuzdan türetildi. Doğrulama sonrası daraltılmalıdır.

| Hesap | Kategori | Rol | Priority | TrustScore | Not |
| --- | --- | --- | --- | --- | --- |
| `@ismailsaymaz` | gazeteci | erken sinyal | 4 | 4 | saha ve siyasi gündem |
| `@timursoykan` | gazeteci | erken sinyal | 3 | 3 | adliye ve siyaset ekseni |
| `@cigdemtoker` | ekonomi | yüksek güven | 3 | 4 | ekonomi ve kamu ihale gündemi |
| `@muratagirel` | gazeteci | erken sinyal | 3 | 3 | araştırma ve siyaset |
| `@barispehlivan` | gazeteci | erken sinyal | 3 | 3 | belge ve araştırma ekseni |
| `@fatihportakal` | gazeteci | yüksek erişim | 3 | 3 | geniş kamu etkisi |
| `@cuneytozdemir` | gazeteci | yüksek erişim | 3 | 3 | dijital yayın etkisi |
| `@nevsinmengu` | gazeteci | erken sinyal | 3 | 3 | siyasi gündem ve yorum |

## Yerel ve Görünmeyen Gündem Katmanı

İlk sürümde ayrıca ayrı bir kaynak bloğu düşünülmeli:

- bölgesel gazeteler
- yerel TV / dijital haber hesapları
- büyükşehir kriz hesapları
- afet anında yerel gazeteciler

Bu katman özellikle şu tür olaylarda kritik olur:

- yerel protestolar
- çevre ve maden çatışmaları
- belediye krizleri
- bölgesel güvenlik olayları
- afetin ilk saatleri

## Denge Kuralı

Bağımsız kaynak katmanında şu denge gözetilmeli:

- sadece büyük isimli gazeteciler değil
- sadece Ankara/İstanbul merkezli medya değil
- sadece aynı ideolojik çevreden kaynaklar değil

## Sonraki İş

Bu dosyadan sonra yapılacak iş:

1. listedeki bağımsız medya kaynaklarını `must-watch` ve `secondary` diye ayırmak
2. gazeteci aday havuzunu beat bazlı sınıflandırmak
3. sonra gerçek `independent seed list` belgesini çıkarmak
