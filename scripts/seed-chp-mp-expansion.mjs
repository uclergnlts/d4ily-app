import { createClient } from "@libsql/client"
import { config } from "dotenv"

config({ path: ".env.local", quiet: true })

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
})

const sources = [
  // CHP leadership / group / high-signal MPs already in or likely to matter often.
  "eczozgurozel",
  "alimahir",
  "gokhan_gunaydin",
  "murat_emir",
  "MuratEmirCHP",
  "denizyavuzyilmaz",
  "veliagbaba",
  "sezgin_tanrikulu",
  "serakadigil",
  "MahirBasarir",
  "faikoztrak",
  "tuncayozkan",
  "utku_cakirozer",
  "gokcegokcen",
  "enginozkoc",
  "bulenttezcan",
  "aykuterdogdu",
  "avdenizyucel",
  "gamzetasciyer",
  "burcukoksal03",
  "tanjuozcanchp",
  "denizdemirchp",
  "enginaltaychp",
  "ali_seker",
  "aylincevik",
  "selin_sayek",

  // Official CHP MP list expansion candidates.
  "AyhanBarut01",
  "BilalBiliciCHP",
  "BurhanettinBulut",
  "MuzeyyenSevkin",
  "orhansumerchp",
  "ResatKaragozCHP",
  "AliyeTimisi",
  "AylinYaman",
  "DenizDemirCHP",
  "OkanKonuralp",
  "tekinbingol",
  "UmutAkdoganCHP",
  "AliyeCosarCHP",
  "aykutkaya07",
  "CavitAriCHP",
  "SururiCorabatir",
  "OzgurEIncesu",
  "ugurbayraktutan",
  "evrimkarakoz",
  "huseyinyildiz09",
  "suleymanbulbul",
  "ensaraytekin10",
  "serkansari10",
  "AysuBankoglu",
  "yasar_tuzun",
  "TurkerAtesCHP",
  "izzetakbulut15",
  "HasanOzturkCHP",
  "kayihanpala",
  "nurhayataltaca",
  "orhansaribalchp",
  "ismetgunesan",
  "ozgurceylanchp",
  "mehmettahtasiz",
  "serefarpaci20",
  "TalihOzcanCHP",
  "ahmetbaranyaz",
  "gurselerol62",
  "MustafaSarigul",
  "ibrahimarslan26",
  "JaleNurSullu",
  "hasanozturkmen27",
  "melihmeric27",
  "elvanisikgezmis",
  "mguzelmansur",
  "nerminyk",
  "servetmullaoglu",
  "yalimhalici",
  "AliGokcek06",
  "sibelyanikomer",
  "cenginyurt52",
  "dogandemirchp",
  "EToprakCHP",
  "evrimrizvanoglu",
  "fethiacikel",
  "gamzeilgezdi",
  "gokanzeybekCHP",
  "ilhankesici",
  "EnisBerberoglu",
  "namiktan",
  "NimetOzdemirCHP",
  "salicioguzkaan",
  "ozgurkarabatCHP",
  "suatozcagdas",
  "turantaskinozer",
  "TurkanElci",
  "YunusEmreCHP",
  "y_mansurkilinc",
  "zeynelemre",
  "ednanarslanchp",
  "MahirPolat",
  "msalihuzun",
  "muratbakan35",
  "askintureli",
  "rifatnalbant",
  "sedakayaosen",
  "sevdaerdankilic",
  "umitozlale",
  "YukselTaskin",
  "alioztunc46",
  "cevdetakaychp",
  "atakanunver",
  "InanAkgunAlp",
  "AskinGenc38",
  "fahriozkan39",
  "vecdigundogdu",
  "metinilhan40",
  "muhipkanko",
  "nailciler",
  "ozguryildizli",
  "BarisBektasCHP",
  "alifazilkasap",
  "avbakirlioglu",
  "bekirbasevirgen",
  "SelmaAliyeKavaf",
  "gulcankis",
  "talatdincer33",
  "cumhuruzun48",
  "gizemozcan48",
  "sureyyaones",
  "OFGurer",
  "drmadiguzel",
  "seyittorun",
  "AvAsuKaya",
  "tahsinocakli",
  "AycaTaskent",
  "umitdikbayir",
  "muratcan55",
  "bariskaradeniz57",
  "ulaskarasuchp",
  "cem_avsar59",
  "ilhamiozcanaygun",
  "nurtenyontar",
  "kadimdurmaz",
  "sibelsuicmez",
  "alikaraoba",
  "tahsinbecan",
  "eylemertugrul",
]

const uniqueSources = [...new Map(sources.map((username) => [username.toLocaleLowerCase("tr-TR"), username])).values()]

let inserted = 0
let updated = 0

for (const username of uniqueSources) {
  const existing = await client.execute({
    sql: "SELECT username FROM twitter_accounts WHERE lower(username) = lower(?) LIMIT 1",
    args: [username],
  })
  const persistedUsername = existing.rows[0]?.username ?? username
  const existed = existing.rows.length > 0

  await client.execute({
    sql: `
      INSERT INTO twitter_accounts (
        username, display_name, category, priority, trust_score, is_official, fetch_interval,
        is_active, show_in_live_feed, added_by, updated_at
      )
      VALUES (?, ?, 'milletvekili', 4, 4, 0, 15, 1, 1, 'seed_chp_mp_expansion', CURRENT_TIMESTAMP)
      ON CONFLICT(username) DO UPDATE SET
        category = 'milletvekili',
        priority = CASE WHEN twitter_accounts.priority < 4 THEN 4 ELSE twitter_accounts.priority END,
        trust_score = CASE WHEN twitter_accounts.trust_score < 4 THEN 4 ELSE twitter_accounts.trust_score END,
        fetch_interval = CASE WHEN twitter_accounts.fetch_interval > 15 THEN 15 ELSE twitter_accounts.fetch_interval END,
        show_in_live_feed = 1,
        is_active = 1,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [persistedUsername, persistedUsername],
  })

  if (existed) updated++
  else inserted++
}

const counts = await client.execute(`
  SELECT
    COUNT(*) AS active,
    SUM(CASE WHEN category = 'milletvekili' THEN 1 ELSE 0 END) AS milletvekili
  FROM twitter_accounts
  WHERE is_active = 1
`)

console.log(JSON.stringify({
  success: true,
  candidates: uniqueSources.length,
  inserted,
  updated,
  activeTwitterAccounts: Number(counts.rows[0]?.active ?? 0),
  activeMilletvekiliAccounts: Number(counts.rows[0]?.milletvekili ?? 0),
}, null, 2))
