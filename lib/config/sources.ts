// --- Kişisel Hesaplar (Canlı Akışta Görünecek) ---
export const PERSONAL_ACCOUNTS = [
    // Siyasetçiler & Liderler
    "RTErdogan", "dbdevletbahceli", "eczozgurozel", "HakanFidan", "erkbas",
    "kilicdarogluk", "ekrem_imamoglu", "mansuryavas06", "meral_aksener", "alibabacan",
    "MDervisogluTR", "erbakanfatih", "umitozdag", "MuharremInce", "Ahmet_Davutoglu",
    "Temel_Karamollaoglu", "fahrettinaltun", "omerrcelik", "avdenizyucel", "alimahir",
    "aysegul__dogan", "zorlu77", "birolaydinsp", "avidrissahin", "SerkanRamanli",
    "suleymansoylu", "drfahrettinkoca", "varank", "cenginyurt52", "serakadigil",
    "ComezTurhan", "MTanal", "Selcuk", "E_SemihYalcin", "buyukataman", "celal_adan",
    "YildizFeti", "memetsimsek",

    // Yeni Eklenenler (Bakanlar & Yerel & Parti)
    "AliYerlikaya", "Yusuf__Tekin", "cevdetyilmaz", "NumanKurtulmus", "mehmetmus",
    "AlparslanBayrak", "a_uraloglu", "AbdulkadirUral", "tanjuozcanchp", "Ahmet_Aras",
    "burcukoksal03", "OzlemCercioglu", "vahap_secer", "zeydankaralar01", "hamzahdag",
    "mustafaelitas", "yusufziya_yilmaz", "efkan_ala", "gamzetasciyer", "RHisarciklioglu",
    "vedatbilgn",

    // Gazeteciler & Yorumcular
    "nevsinmengu", "cuneytozdemir", "haskologlu", "sakinan1968", "eafyoncu",
    "m_cemilkilic", "merdanyanardag", "candundaradasi", "eceuner12", "emrahgulsunar",
    "ismailari_", "ismailsaymaz", "kucukkayaismail", "muratagirel", "baristerkoglu",
    "barispehlivan", "ugur_dundar", "fatihportakal", "yilmazozdil", "sedat_peker",
    "barisyarkadas", "saygi_ozturk", "muratyetkin2", "fehimtastekin", "abdulkadir_selvi",
    "fatihaltayli", "timursoykan", "cigdemtoker", "alicanuludag", "sahmetsahmet", "lordsinov", "haskologlu",


    // Ekonomi & Finans
    "mahfiegilmez", "OzgrDemirtas", "emrealkin1969", "iriscibre", "mustafasonmez",
    "ugurses", "senolguldur", "AtillaYesilada7", "sozcumurat", "ekonomikanaliz",
    "RefetGurkaynak",

    // Spor Yorumcuları
    "yagosabuncuoglu", "ertemsener",

    // Hukuk & Diğer Kişiler
    "metinfeyzioglu", "gonencgurkaynak", "istbassavcisi"
];

// --- Kurumsal Hesaplar (Sadece Digest İçin - Akışta Gizli) ---
export const CORPORATE_ACCOUNTS = [
    // Haber Ajansları & Medya
    "pusholder", "Darkwebhaber", "t24comtr", "gazeteduvar", "medyascope",
    "solcugazete", "dokuz8haber", "bbcturkce", "dw_turkce", "voaturkce",
    "trthaber", "anadoluajansi", "etkilihaberyeni", "tkrgazete", "bosunatiklama",
    "proftpmedya", "haber",

    // Spor Kulüpleri & Medyası
    "Fenerbahce", "GalatasaraySK", "Besiktas", "Trabzonspor", "TFF_Org",
    "demarkesports", "sportsdigitale", "tribundergi",

    // Resmi Kurumlar & Parti Hesapları
    "TC_Icisleri", "adalet_bakanligi", "AFADBaskanlik", "HDPgenelmerkezi",
    "herkesicinCHP"
];

export const TWITTER_USERS = [...PERSONAL_ACCOUNTS, ...CORPORATE_ACCOUNTS];

export const RSS_FEEDS = [
    "https://www.birgun.net/rss/kategori/siyaset-8",
    "http://rss.dw-world.de/rdf/rss-tur-all",
    "https://www.aa.com.tr/tr/rss/default?cat=guncel",
    "https://tr.sputniknews.com/export/rss2/archive/index.xml",
    "http://feeds.bbci.co.uk/turkce/rss.xml",
    "https://www.ntv.com.tr/gundem.rss"
];
