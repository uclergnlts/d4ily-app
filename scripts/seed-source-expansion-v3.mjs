import { createClient } from "@libsql/client"
import { config } from "dotenv"

config({ path: ".env.local", quiet: true })

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
})

const packs = [
  {
    category: "ilce_belediye",
    priority: 3,
    trustScore: 4,
    isOfficial: true,
    fetchInterval: 30,
    showInLiveFeed: false,
    usernames: [
      "KadikoyBelediye",
      "BesiktasBel",
      "uskudarbld",
      "BeyogluBld",
      "FatihBelediye",
      "BakirkoyBld",
      "MaltepeBelTr",
      "KartalBelTr",
      "Pendik_Belediye",
      "TuzlaBelediyesi",
      "UmraniyeBelTr",
      "SancaktepeBel",
      "SultanbeyliBel",
      "Beykoz_Belediye",
      "AtasehirBel",
      "AvcilarBel",
      "BuyukcekmeceB",
      "KucukcekmeceB",
      "BagcilarBel",
      "EsenlerBelediye",
      "EyupBelediyesi",
      "GOPBelediyesi",
      "KagithaneBel",
      "SariyerBelediye",
      "CankayaBel",
      "keciorenbeltr",
      "yenimahallebld",
      "MamakBel",
      "AltindagBel",
      "EtimesgutBel",
      "SincanBel",
      "PolatliBel",
      "GolbasiBel",
      "KonakBel",
      "KarsiyakaBel",
      "BornovaBel",
      "BucaBel",
      "CigliBelediyesi",
      "BayrakliBel",
      "BalcovaBel",
      "NarlidereBel",
      "UrlaBelediyesi",
    ],
  },
  {
    category: "hukuk_adliye",
    priority: 4,
    trustScore: 5,
    isOfficial: true,
    fetchInterval: 20,
    showInLiveFeed: false,
    usernames: [
      "AYMBASKANLIGI",
      "YargitayCBS",
      "DanistayBsk",
      "HSKgovtr",
      "SayistayBsk",
      "Kamu_Denetciligi",
      "KVKKurumu",
      "RekabetKurumu",
      "TBB",
      "TBBHukuk",
    ],
  },
  {
    category: "hukuk_adliye",
    priority: 3,
    trustScore: 4,
    isOfficial: false,
    fetchInterval: 20,
    showInLiveFeed: false,
    usernames: [
      "hukukihaber",
      "adliyegundemi",
      "adaletbiz",
      "HukukcularDer",
      "yargiclar",
      "YargiSen",
      "AvukatHaklari",
      "SavunmaHareketi",
      "KadininHaklari",
      "CocukHaklariDer",
    ],
  },
  {
    category: "universite_genclik",
    priority: 2,
    trustScore: 4,
    isOfficial: true,
    fetchInterval: 45,
    showInLiveFeed: false,
    usernames: [
      "sabanciuniv",
      "kocuniversity",
      "BilkentUniv",
      "GSUniversitesi",
      "bauglobal",
      "Bilgi_Univ",
      "YeditepeUni",
      "Anadolu_Univ",
      "ErciyesUni",
      "CukurovaUni",
      "BursaUludagUni",
      "SelcukUni",
      "AkdenizUni",
      "AnkaraYBU",
      "gazi_universite",
      "MedeniyetUniv",
      "FSMVakifUni",
      "MEFUniversity",
      "TOBBETU",
      "atilim_univ",
      "ted_university",
      "ozyeginuni",
      "KadirHasUni",
      "IstinyeUniv",
    ],
  },
  {
    category: "ogrenci_kampus",
    priority: 2,
    trustScore: 3,
    isOfficial: false,
    fetchInterval: 45,
    showInLiveFeed: false,
    usernames: [
      "bogazicidirenis",
      "odtululer",
      "itulu1884",
      "kampushaberleri",
      "universitehaber",
      "ogrencigundemi",
      "unihaberleri",
      "genclikmuhalefeti",
      "SolGenclik",
      "TKPGencligi",
    ],
  },
  {
    category: "ekonomi_sektor",
    priority: 3,
    trustScore: 4,
    isOfficial: false,
    fetchInterval: 30,
    showInLiveFeed: false,
    usernames: [
      "iso500",
      "itohaber",
      "ASOiletisim",
      "EBSOorgtr",
      "TIM_2023",
      "DEIKiletisim",
      "TSPB",
      "TURKONFED",
      "KAGIDER",
      "GYODER",
      "konutder",
      "TurkBankalar",
      "TKYD",
      "TURMOB",
      "TESK_Kurumsal",
      "TZOBiletisim",
      "UlusalSutKonseyi",
      "EtBorsasi",
      "KomurDer",
      "petform",
      "TAYSAD",
      "OSD_1974",
      "UNDDernegi",
      "UTIKAD",
      "DTO_ISTANBUL",
    ],
  },
  {
    category: "saha_hizli_haber",
    priority: 3,
    trustScore: 3,
    isOfficial: false,
    fetchInterval: 20,
    showInLiveFeed: false,
    usernames: [
      "dokuz8SONDAKIKA",
      "HaberAktuel",
      "GerceklerPostasi",
      "SonDakikaTR",
      "Medyaloji",
      "Gundem_Turkiye",
      "haberler",
      "Mynet",
      "internethaber",
      "gazetevatan",
      "ulusalcomtr",
      "TV100",
      "tvnet",
      "ahaber",
      "beyaztv",
      "SozcuTV",
      "KRTCANLI",
      "FlashHaberTV",
    ],
  },
  {
    category: "yerel_gazeteci",
    priority: 2,
    trustScore: 3,
    isOfficial: false,
    fetchInterval: 30,
    showInLiveFeed: true,
    usernames: [
      "Ankara_Kulis",
      "AnkaraGundemi",
      "izmirgundemi",
      "EgeGundem",
      "BursaGundem",
      "AntalyaKulis",
      "AdanaGundemi",
      "MersinGundemi",
      "GaziantepKulis",
      "DiyarbakirGundem",
      "VanGundem",
      "UrfaGundemi",
      "TrabzonGundem",
      "SamsunGundemi",
      "KayseriGundem",
      "KocaeliGundem",
      "EskisehirGundem",
      "MuglaGundem",
      "HatayGundem",
      "MalatyaGundem",
    ],
  },
  {
    category: "afet_hava_deprem",
    priority: 4,
    trustScore: 4,
    isOfficial: false,
    fetchInterval: 15,
    showInLiveFeed: false,
    usernames: [
      "DepremDairesi",
      "Kandilli_info",
      "DepremBilgi",
      "havaforum",
      "HavaCity",
      "meteorolojibeyi",
      "StormHourTurkey",
      "YanginVar",
      "OrmanGenelMd",
      "OGMgovtr",
    ],
  },
]

const candidates = new Map()

for (const pack of packs) {
  for (const rawUsername of pack.usernames) {
    const username = rawUsername.replace(/^@/, "").trim()
    if (!username) continue

    const key = username.toLocaleLowerCase("tr-TR")
    const current = candidates.get(key)
    if (!current || pack.priority > current.priority || pack.trustScore > current.trustScore) {
      candidates.set(key, {
        username,
        category: pack.category,
        priority: pack.priority,
        trustScore: pack.trustScore,
        isOfficial: pack.isOfficial,
        fetchInterval: pack.fetchInterval,
        showInLiveFeed: pack.showInLiveFeed,
      })
    }
  }
}

let inserted = 0
let updated = 0

for (const source of candidates.values()) {
  const existing = await client.execute({
    sql: "SELECT username FROM twitter_accounts WHERE lower(username) = lower(?) LIMIT 1",
    args: [source.username],
  })
  const persistedUsername = existing.rows[0]?.username ?? source.username
  const existed = existing.rows.length > 0

  await client.execute({
    sql: `
      INSERT INTO twitter_accounts (
        username, display_name, category, priority, trust_score, is_official, fetch_interval,
        is_active, show_in_live_feed, added_by, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, 'seed_source_expansion_v3', CURRENT_TIMESTAMP)
      ON CONFLICT(username) DO UPDATE SET
        category = CASE WHEN excluded.priority >= twitter_accounts.priority THEN excluded.category ELSE twitter_accounts.category END,
        priority = CASE WHEN excluded.priority > twitter_accounts.priority THEN excluded.priority ELSE twitter_accounts.priority END,
        trust_score = CASE WHEN excluded.trust_score > twitter_accounts.trust_score THEN excluded.trust_score ELSE twitter_accounts.trust_score END,
        is_official = CASE WHEN excluded.is_official = 1 THEN 1 ELSE twitter_accounts.is_official END,
        fetch_interval = CASE WHEN excluded.fetch_interval < twitter_accounts.fetch_interval THEN excluded.fetch_interval ELSE twitter_accounts.fetch_interval END,
        show_in_live_feed = CASE WHEN excluded.show_in_live_feed = 1 THEN 1 ELSE twitter_accounts.show_in_live_feed END,
        is_active = 1,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [
      persistedUsername,
      persistedUsername,
      source.category,
      source.priority,
      source.trustScore,
      source.isOfficial ? 1 : 0,
      source.fetchInterval,
      source.showInLiveFeed ? 1 : 0,
    ],
  })

  if (existed) updated++
  else inserted++
}

const activeCount = await client.execute("SELECT COUNT(*) AS count FROM twitter_accounts WHERE is_active = 1")
const byCategory = await client.execute(`
  SELECT category, COUNT(*) AS count
  FROM twitter_accounts
  WHERE is_active = 1
  GROUP BY category
  ORDER BY count DESC, category ASC
`)

console.log(JSON.stringify({
  success: true,
  candidates: candidates.size,
  inserted,
  updated,
  activeTwitterAccounts: Number(activeCount.rows[0]?.count ?? 0),
  byCategory: byCategory.rows,
}, null, 2))
