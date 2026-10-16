/**
 * Jólaspádómar Jólakexsins.
 *
 * Til að bæta við spádómi: settu nýjan streng í réttan flokk hér að neðan.
 * Auðkenni (id) eru reiknuð sjálfkrafa út frá textanum, svo röðin skiptir ekki máli.
 * Prófin í `fortunes.test.ts` passa að engir spádómar séu tvíteknir eða tómir.
 *
 * Ábending: forðastu lýsingarorð sem beygjast eftir kyni lesandans
 * (t.d. „þú verður glaður/glöð“) svo að spádómarnir henti öllum.
 */

export const FORTUNE_CATEGORIES = ['jolaspeki', 'vinnuspa', 'jolaheppni', 'nyarsspa'] as const;

export type FortuneCategory = (typeof FORTUNE_CATEGORIES)[number];

export interface Fortune {
  id: string;
  category: FortuneCategory;
  text: string;
}

export const CATEGORY_LABELS: Record<FortuneCategory, string> = {
  jolaspeki: 'Jólaspeki',
  vinnuspa: 'Vinnuspá',
  jolaheppni: 'Jólaheppni',
  nyarsspa: 'Nýársspá 2027',
};

const FORTUNE_TEXTS: Record<FortuneCategory, readonly string[]> = {
  jolaspeki: [
    'Þú munt finna friðinn um jólin. En fyrst þarftu að finna hvar þú lagðir símann.',
    'Góðir hlutir bíða þín. Sumir þeirra eru í konfektkassanum.',
    'Sá sem bíður eftir fullkomnum jólum missir af þeim góðu sem eru þegar komin.',
    'Jólaljósin minna okkur á að jafnvel flækja getur orðið falleg þegar kveikt er á henni.',
    'Það er ekkert stress sem heitt kakó og teppi ráða ekki við. Nema kannski Þorláksmessa.',
    'Besta jólagjöfin er tími. Næstbesta gjöfin eru ullarsokkar sem passa.',
    'Smákökur sem enginn sér þig borða eru ekki taldar með. Þetta er gömul og virt jólaregla.',
    'Laufabrauðið kennir okkur að fegurðin felst í smáatriðunum. Og að einhver brýtur alltaf eina köku.',
    'Það er í góðu lagi að pakka gjöfunum inn á síðustu stundu. Það heitir að vinna vel undir álagi.',
    'Þolinmæði er dyggð. Sérstaklega þegar allar jólaseríurnar eru í einum hnút.',
    'Hlýtt orð getur hitað heilt hús. Ofninn hjálpar þó líka.',
    'Jólin snúast ekki um það sem liggur undir trénu heldur um þá sem sitja í kringum það. Og um það hver fær möndluna.',
    'Í ár mun jólasveinninn líta fram hjá nokkrum smáatriðum. Hann er líka bara að reyna að komast í gegnum desember.',
    'Ekki telja dagana til jóla. Teldu smákökurnar. Það er miklu skemmtilegra.',
    'Jólakötturinn hefur séð nýju peysuna þína og ákveðið að leita annað.',
    'Ró og friður koma til þeirra sem slökkva á tilkynningunum.',
    'Stundum verður besta jólahefðin til alveg óvart. Oftast í eldhúsinu.',
  ],
  vinnuspa: [
    'Á næstu dögum mun eitthvað óvænt gerast. Líklega verður það svar við tölvupósti frá því í ágúst.',
    'Stjörnurnar segja að næsti fundur hefði mátt vera tölvupóstur.',
    'Jólin færa þér ný tækifæri — og að minnsta kosti eina beiðni merkta áríðandi.',
    'Bráðum mun einhver segja „þetta tekur bara fimm mínútur“. Taktu frá allan eftirmiðdaginn.',
    'Kaffivélin mun reynast þér trygg á aðventunni. Ekki taka henni sem sjálfsögðum hlut.',
    'Þú munt loksins skilja Excel-skjalið. Rétt áður en einhver breytir því.',
    'Spáin sýnir mikil afköst á milli jóla og nýárs. Aðallega vegna þess að enginn annar er við.',
    'Skjalið sem þú hefur leitað að mun birtast. Það hét „lokaútgáfa_v7_NOTA_ÞESSA“ allan tímann.',
    'Stjörnurnar mæla með því að þú smellir á „svara öllum“ af mikilli varúð á komandi ári.',
    'Jólahlaðborðið mun sýna samstarfsfólkinu nýja hlið á þér. Vonandi bara danshæfileikana.',
    'Einhver á eftir að spyrja „heyrið þið í mér?“ á næsta fjarfundi. Það verður ekki í síðasta sinn.',
    'Dagatalið þitt mun fyllast af fundum um það hvenær eigi að halda fund.',
    'Þú munt fá hrós fyrir verk sem þú manst ekki eftir að hafa unnið. Taktu við því með reisn.',
    'Prentarinn finnur á sér að það eru að koma jól. Sýndu honum skilning.',
    'Á nýju ári mun einhver loksins taka til í ísskápnum á kaffistofunni. Stjörnurnar benda á þig.',
    'Síðasti vinnudagurinn fyrir jólafrí verður afar afkastamikill. Í smákökuáti.',
    'Sjálfvirka fjarverusvarið þitt verður besti texti sem þú skrifar á árinu.',
    'Í desember breytast öll verkefni í „eftir áramót“. Njóttu þess á meðan það varir.',
  ],
  jolaheppni: [
    'Í ár færðu möndluna. Eða að minnsta kosti að vita hver faldi hana.',
    'Heppnin er með þér: síðasti molinn í konfektkassanum verður sá sem þig langaði í.',
    'Laust bílastæði bíður þín á Þorláksmessu. Ef það gerist skaltu kaupa lottómiða strax.',
    'Fyrsti pakkinn sem þú opnar verður ekki bók. Eða kannski einmitt bók. Jólabókaflóðið er óútreiknanlegt.',
    'Jólaseríurnar munu kvikna í fyrstu tilraun. Þetta er sjaldgæft fyrirbæri sem ber að fagna.',
    'Einhver mun gefa þér nákvæmlega það sem þú óskaðir þér. Óskin sjálf hafði bara alveg gleymst.',
    'Heppnin brosir við þér á aðventunni. Hún gæti litið út eins og aukaskammtur af rjóma.',
    'Jólasveinarnir hafa ákveðið að setja eitthvað betra en kartöflu í skóinn þinn í ár.',
    'Allar gjafirnar þínar verða rétt merktar. Engin frænka fær óvart borvélina.',
    'Þú munt finna fimm þúsund krónur í vasanum á vetrarúlpunni. Jólin koma snemma í ár.',
    'Rafmagnið helst á allt aðfangadagskvöld. Hamborgarhryggurinn þakkar fyrir sig.',
    'Lukkan fylgir þeim sem smakka smákökurnar áður en þær kólna. Það er óstaðfest en mjög sennilegt.',
    'Heppni þín í jólaspilinu mun vekja grunsemdir. Enginn mun þó geta sannað neitt.',
    'Einhver annar en þú tæmir uppþvottavélina um jólin. Kraftaverkin gerast enn.',
    'Heppnin bíður þín á óvæntum stað. Líklega undir sófapúðanum, við hliðina á fjarstýringunni.',
    'Stjörnurnar sjá fyrir hvít jól. Ef ekki úti, þá að minnsta kosti á piparkökunum.',
    'Jólapakkinn þinn kemst á réttum tíma til skila. Pósturinn sendir þér hlýja strauma.',
  ],
  nyarsspa: [
    'Árið 2027 verður þitt ár. Eða að minnsta kosti eitt af árunum þínum.',
    'Árið 2027 munt þú loksins nota líkamsræktarkortið. Að minnsta kosti tvisvar í janúar.',
    'Áramótaheitið þitt mun endast lengur en flugeldarnir. Það er nú þegar sigur.',
    'Á nýju ári tekur þú stórar ákvarðanir. Sú fyrsta verður hvort það taki því að fara á fætur.',
    'Árið 2027 færir þér ný ævintýri, nýja reynslu og nýtt lykilorð sem gleymist strax.',
    'Fyrstu vikuna í janúar munt þú skrifa 2026 á allt. Það er eðlilegt og fyrirgefið.',
    'Árið 2027 býður upp á 365 ný tækifæri. Nokkur þeirra eru mánudagar.',
    'Á árinu 2027 klárar þú loksins þáttaröðina sem allir hafa verið að tala um.',
    'Skipulagið nær nýjum hæðum árið 2027. Þú munt eiga minnst þrjú smáforrit fyrir verkefnalista.',
    'Árið 2027 verður gott ferðaár. Sérstaklega á milli sófans og ísskápsins.',
    'Nýtt ár færir nýtt tækifæri til að segja „ég byrja á mánudaginn“ með fullri sannfæringu.',
    'Þegar klukkan slær tólf á gamlárskvöld mun óskin þín heyrast. Líklega yfir sprengjunum.',
    'Árið 2027 lærir þú eitthvað nýtt. Til dæmis hvert sumarfríið hvarf.',
    'Spáin fyrir 2027: minna stress, meira kaffi og að minnsta kosti einn fundur sem klárast á undan áætlun.',
    'Á nýju ári munu draumar þínir rætast. Byrjaðu á þeim litlu, eins og tómu pósthólfi.',
    'Áramótaskaupið fær þig til að hlæja að minnsta kosti einu sinni. Stjörnurnar lofa engu meiru.',
    'Árið 2027 verður árið sem þú loksins lærir að brjóta saman lak með teygju. Eða ekki. Það er líka allt í lagi.',
  ],
};

/** Stöðugt auðkenni út frá texta (FNV-1a), svo að nýlega-sögu-kerfið lifi af endurröðun. */
export function fortuneId(category: FortuneCategory, text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `${category}-${(hash >>> 0).toString(36)}`;
}

export const FORTUNES: readonly Fortune[] = FORTUNE_CATEGORIES.flatMap((category) =>
  FORTUNE_TEXTS[category].map((text) => ({ id: fortuneId(category, text), category, text })),
);
