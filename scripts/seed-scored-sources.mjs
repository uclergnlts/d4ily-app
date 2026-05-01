import { createClient } from "@libsql/client";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const twitterSources = [
  ["Merkez_Bankasi", "ekonomi", 5, 5, true, 5, false],
  ["CentralBank_TR", "ekonomi", 3, 5, true, 30, false],
  ["TCMBBlog", "ekonomi", 2, 5, true, 60, false],
  ["TCMB_Arastirma", "ekonomi", 3, 5, true, 30, false],
  ["AFADBaskanlik", "afet", 5, 5, true, 5, false],
  ["adalet_bakanlik", "hukuk", 4, 5, true, 10, false],
  ["AliYerlikaya", "guvenlik", 5, 5, true, 5, true],
  ["RTErdogan", "siyasi_lider", 5, 4, true, 5, true],
  ["HakanFidan", "diplomasi", 5, 4, true, 5, true],
  ["memetsimsek", "ekonomi", 5, 4, true, 5, true],
  ["anadoluajansi", "ajans", 4, 4, false, 10, false],
  ["trthaber", "ajans", 4, 4, false, 10, false],
  ["t24comtr", "medya", 3, 3, false, 20, false],
  ["gazeteduvar", "medya", 3, 3, false, 20, false],
  ["medyascope", "medya", 3, 3, false, 20, false],
  ["ismailsaymaz", "gazeteci", 3, 4, false, 20, true],
  ["cigdemtoker", "ekonomi", 3, 4, false, 20, true],
  ["muratyetkin2", "gazeteci", 3, 4, false, 20, true],
  ["nevsinmengu", "gazeteci", 3, 3, false, 20, true],
  ["fatihaltayli", "gazeteci", 3, 3, false, 20, true],
  ["timursoykan", "adliye_gazeteci", 4, 4, false, 10, true],
  ["muratagirel", "adliye_gazeteci", 4, 4, false, 10, true],
  ["barispehlivan", "adliye_gazeteci", 4, 4, false, 10, true],
  ["baristerkoglu", "adliye_gazeteci", 4, 4, false, 10, true],
  ["alicanuludag", "adliye_gazeteci", 4, 4, false, 10, true],
  ["saygi_ozturk", "adliye_gazeteci", 3, 4, false, 15, true],
  ["CHP_istanbulil", "istanbul_siyaset", 4, 4, false, 10, true],
  ["ozgurcelikchp", "istanbul_siyaset", 4, 4, false, 10, true],
  ["istanbulbld", "yerel_yonetim", 4, 5, true, 10, true],
  ["cumhuriyetgzt", "medya", 4, 4, false, 10, false],
  ["BirGun_Gazetesi", "medya", 4, 4, false, 10, false],
  ["gazetesozcu", "medya", 4, 4, false, 10, false],
  ["halktvcomtr", "medya", 4, 3, false, 10, false],
  ["tele1comtr", "medya", 4, 3, false, 10, false],
  ["gercekgundem", "medya", 4, 3, false, 10, false],
  ["DikenComTr", "medya", 3, 4, false, 15, false],
  ["bianet_org", "hak_odakli_medya", 3, 4, false, 15, false],
  ["evrenselgzt", "medya", 3, 3, false, 15, false],
  ["artigercek", "medya", 3, 3, false, 15, false],
  ["ankahabera", "ajans", 4, 4, false, 10, false],
  ["ihacomtr", "ajans", 3, 3, false, 15, false],
  ["dhainternet", "ajans", 3, 3, false, 15, false],
  ["cevdetyilmaz", "devlet_yonetimi", 5, 4, true, 10, true],
  ["NumanKurtulmus", "devlet_yonetimi", 5, 4, true, 10, true],
  ["Yusuf__Tekin", "bakan", 5, 4, true, 10, true],
  ["AlparslanBayrak", "bakan", 5, 4, true, 10, true],
  ["a_uraloglu", "bakan", 5, 4, true, 10, true],
  ["AbdulkadirUral", "bakan", 5, 4, true, 10, true],
  ["yilmaztunc", "bakan", 5, 5, true, 5, true],
  ["OsmanAskinBak", "bakan", 4, 4, true, 15, true],
  ["murat_kurum", "bakan", 4, 4, true, 15, true],
  ["mevlutcavusoglu", "siyasetci", 4, 4, false, 15, true],
  ["BekirBozdag", "siyasetci", 4, 4, false, 15, true],
  ["veliagbaba", "milletvekili", 4, 4, false, 10, true],
  ["gokcegokcen", "milletvekili", 4, 4, false, 10, true],
  ["sezgin_tanrikulu", "milletvekili", 4, 4, false, 10, true],
  ["bulenttezcan", "milletvekili", 3, 4, false, 15, true],
  ["enginozkoc", "milletvekili", 3, 4, false, 15, true],
  ["utku_cakirozer", "milletvekili", 3, 4, false, 15, true],
  ["GulizarBicer", "milletvekili", 3, 4, false, 15, true],
  ["sirrisureyya", "siyasetci", 3, 4, false, 15, true],
  ["Ahmet_Aras", "belediye_baskani", 4, 4, false, 10, true],
  ["mansuryavas06", "belediye_baskani", 4, 4, false, 10, true],
  ["zeydankaralar01", "belediye_baskani", 4, 4, false, 10, true],
  ["vahap_secer", "belediye_baskani", 4, 4, false, 10, true],
  ["OzlemCercioglu", "belediye_baskani", 4, 4, false, 10, true],
  ["memduhb", "belediye_baskani", 4, 4, false, 10, true],
  ["mustafabozbey", "belediye_baskani", 4, 4, false, 10, true],
  ["cemiltugay", "belediye_baskani", 4, 4, false, 10, true],
  ["FatmaSahin", "belediye_baskani", 3, 4, false, 15, true],
  ["RHisarciklioglu", "stk_baskani", 4, 4, false, 15, true],
  ["TUSIAD", "stk", 4, 5, false, 15, false],
  ["TOBBiletisim", "stk", 4, 5, false, 15, false],
  ["MUSIAD", "stk", 3, 4, false, 20, false],
  ["diskinsesi", "emek_stk", 4, 4, false, 10, false],
  ["KESK1995", "emek_stk", 4, 4, false, 10, false],
  ["turkiskonf", "emek_stk", 4, 4, false, 10, false],
  ["TMMOB1954", "meslek_orgutu", 4, 4, false, 10, false],
  ["ttborgtr", "meslek_orgutu", 4, 4, false, 10, false],
  ["istbarosu", "meslek_orgutu", 4, 4, false, 10, false],
  ["Ahbap", "sivil_toplum", 3, 4, false, 20, false],
  ["haluklevent", "onemli_sahsiyet", 3, 4, false, 20, true],
  ["OguzhanUgur", "onemli_sahsiyet", 3, 3, false, 20, true],
  ["Akparti", "parti", 4, 4, false, 10, false],
  ["iyiparti", "parti", 4, 4, false, 10, false],
  ["DEMGenelMerkezi", "parti", 4, 4, false, 10, false],
  ["SaadetPartisi", "parti", 3, 4, false, 15, false],
  ["GelecekPartiTR", "parti", 3, 4, false, 15, false],
  ["devapartisi", "parti", 3, 4, false, 15, false],
  ["zaferpartisi", "parti", 3, 4, false, 15, false],
  ["tipgenelmerkez", "parti", 3, 4, false, 15, false],
  ["faikoztrak", "milletvekili", 3, 4, false, 15, true],
  ["tuncayozkan", "milletvekili", 3, 4, false, 15, true],
  ["aykuterdogdu", "milletvekili", 3, 4, false, 15, true],
  ["selcukozdag", "milletvekili", 3, 4, false, 15, true],
  ["yavuzyilmazd", "milletvekili", 4, 4, false, 10, true],
  ["onursaladiguzel", "siyasetci", 4, 4, false, 10, true],
  ["gurseltekin34", "siyasetci", 3, 4, false, 15, true],
  ["ekrem_erkek", "siyasetci", 3, 4, false, 15, true],
  ["mustafasentop", "siyasetci", 3, 4, false, 20, true],
  ["nurettincanikli", "siyasetci", 3, 4, false, 20, true],
  ["turanbulent", "siyasetci", 3, 4, false, 20, true],
  ["MahirPolat", "yerel_siyaset", 4, 4, false, 10, true],
  ["EmrahSahan", "yerel_siyaset", 4, 4, false, 10, true],
  ["Canan_Kaftanci", "istanbul_siyaset", 3, 4, false, 15, true],
  ["caglarcilara", "gazeteci", 3, 3, false, 20, true],
  ["sevilayyaziyor", "gazeteci", 3, 3, false, 20, true],
  ["nevzatcicek", "gazeteci", 3, 3, false, 20, true],
  ["TGC_TR", "meslek_orgutu", 3, 4, false, 20, false],
  ["turkiyebarolar", "meslek_orgutu", 4, 5, false, 10, false],
  ["ihd_genelmerkez", "hak_orgutu", 4, 4, false, 15, false],
  ["aforgutu", "hak_orgutu", 3, 4, false, 20, false],
  ["Greenpeace_Med", "cevre_stk", 3, 4, false, 20, false],
  ["WWF_TURKIYE", "cevre_stk", 3, 4, false, 20, false],
  ["TEMA_Vakfi", "cevre_stk", 3, 4, false, 20, false],
  ["Kizilay", "sivil_toplum", 4, 5, false, 15, false],
  ["AKUT_Dernegi", "sivil_toplum", 4, 5, false, 15, false],
  ["KADEMorgtr", "sivil_toplum", 3, 4, false, 20, false],
  ["MulteciDernegi", "sivil_toplum", 3, 4, false, 20, false],
];

async function seedTwitter() {
  let count = 0;
  for (const [username, category, priority, trustScore, isOfficial, fetchInterval, showInLiveFeed] of twitterSources) {
    await client.execute({
      sql: `
        INSERT INTO twitter_accounts (
          username, display_name, category, priority, trust_score, is_official, fetch_interval,
          is_active, show_in_live_feed, added_by, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, 'seed_script', CURRENT_TIMESTAMP)
        ON CONFLICT(username) DO UPDATE SET
          category = excluded.category,
          priority = excluded.priority,
          trust_score = excluded.trust_score,
          is_official = excluded.is_official,
          fetch_interval = excluded.fetch_interval,
          show_in_live_feed = excluded.show_in_live_feed,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [username, username, category, priority, trustScore, isOfficial ? 1 : 0, fetchInterval, showInLiveFeed ? 1 : 0],
    });
    count++;
  }
  return count;
}

async function seedRss() {
  await client.execute("DELETE FROM rss_sources");
  return 0;
}

const twitter = await seedTwitter();
const rss = await seedRss();

console.log(JSON.stringify({ success: true, twitter, rss, total: twitter + rss }, null, 2));
