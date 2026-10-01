(function(root){
'use strict';const D=typeof module!=='undefined'&&module.exports?require('./data.js'):root.BloomData;
const themes={knight:['絢爛','慈愛'],witch:['天極','星詠'],alchemist:['猛毒','万華'],dragoon:['覇竜','焔心'],ranger:['月牙','幻舞'],all:['剛華','流転']};
D.upgradeLevel=c=>c.branch?2:c.upgraded?1:0;
// Every playable card has an explicit pair. Patches are applied over its + form.
// Power concentrates on damage / the main effect; support gains a distinct utility.
// Keep branch IDs stable so existing decks, art and discovered forms remain valid.
const evolutionPairs={
  strike:[{damage:18},{damage:9,draw:1}],
  guard:[{block:18},{block:8,draw:1}],
  // リリィ：開花を育てる / 守りと手札をつなぐ。
  bloomcut:[{damage:16},{bloom:4,block:4}],
  rose:[{damage:21},{bloom:4,draw:1}],
  doublecut:[{damage:11},{damage:4,hits:3,bloom:2}],
  petalguard:[{block:21},{bloom:3,draw:1}],
  petaldraw:[{bloom:4},{block:6}],
  bramble:[{thorns:9},{block:12,regen:2}],
  flourish:[{damage:30,bloomScale:6},{block:10,bloom:3}],
  petalstorm:[{damage:23},{bloom:4,block:8}],
  resolve:[{strength:6},{block:10,draw:1}],
  bloomheart:[{bloomTurn:5},{blockTurn:5,draw:1}],
  riposte:[{damage:20},{block:14,draw:1}],
  petalwall:[{block:34,bloomBlock:5},{draw:2,bloom:3}],
  finalbloom:[{damage:18},{damage:8,hits:4,block:14}],
  dew:[{block:18,regen:5},{bloom:3,draw:1}],
  roseoath:[{damage:44},{bloom:7,draw:2}],
  sanctuary:[{block:52},{bloom:6,draw:2}],
  // ルーナ：氷結と詠唱を支える手札・防御。
  spark:[{damage:16},{frost:6,block:5}],
  moonbolt:[{damage:21},{frost:5,draw:1}],
  icewall:[{block:20,frost:4},{draw:2}],
  stargaze:[{draw:5},{energy:1}],
  frostbite:[{frost:11,weak:3},{block:8,draw:1}],
  lightning:[{damage:9},{damage:4,hits:4,frost:3}],
  blizzard:[{damage:26},{frost:7,block:10}],
  shatter:[{damage:17,frostScale:7},{block:7,draw:1}],
  comet:[{damage:44},{draw:3,block:8}],
  moonaura:[{blockTurn:10},{draw:1,regen:3}],
  astronomy:[{drawTurn:2},{blockTurn:6,energy:1}],
  absolute:[{frost:18,block:28},{draw:3,energy:1}],
  supernova:[{damage:64},{frost:6,draw:2}],
  moonstep:[{block:22},{draw:4}],
  eclipse:[{damage:42,frost:9},{frost:12,draw:2,block:8}],
  // ミエル：毒の決定力 / 生存と調合の回転。
  toxic:[{poison:13},{block:6,draw:1}],
  venom:[{poison:17},{block:8,draw:1}],
  flask:[{damage:21,poison:6},{poison:8,block:6}],
  mist:[{block:20,weak:3},{draw:2}],
  brew:[{energy:2},{draw:4}],
  cloud:[{poison:18},{block:12,weak:1}],
  catalyst:[{poisonMultiply:5},{draw:2,block:8}],
  blast:[{damage:36},{poison:5,block:10}],
  recycle:[{block:22},{draw:4}],
  toxicology:[{poisonTurn:5},{blockTurn:5,draw:1}],
  medicine:[{heal:17},{block:12,draw:1}],
  leech:[{damage:20,poisonScale:2},{poison:5,block:8}],
  philosopher:[{energyTurn:2},{drawTurn:1,block:8}],
  pandora:[{poison:36},{weak:5,block:18,draw:2}],
  venomgarden:[{poison:20,poisonMultiply:3},{block:16,draw:2}],
  elixir:[{heal:28,block:40},{draw:3,energy:1}],
  // フレア：槍の威力 / 灼熱の準備と守り。
  ember:[{damage:18},{heat:6,block:5}],
  kindle:[{heat:9},{block:6}],
  flameguard:[{block:20},{heat:6,draw:1}],
  spear:[{damage:25},{damage:9,hits:2,heat:2}],
  cinders:[{damage:14},{heat:4,block:6}],
  warmth:[{block:22},{draw:4}],
  ignition:[{heatTurn:5},{blockTurn:5,draw:1}],
  dragonfang:[{damage:18,hits:2},{damage:7,hits:3,heat:4}],
  forge:[{block:26},{heat:9,draw:1}],
  firewheel:[{damage:30},{weak:4,block:12}],
  dragonheart:[{strength:7,heatTurn:5},{blockTurn:7,draw:1}],
  crimsonlance:[{damage:44,heatScale:4},{heat:6,block:12}],
  dragonflare:[{damage:54},{heat:11,block:18}],
  sunfall:[{damage:24},{damage:11,hits:4,draw:2}],
  // ノエル：連携を決める威力 / 次の一手とヒット数。
  twinfang:[{damage:9,comboScale:2},{damage:4,hits:3,draw:1}],
  feint:[{block:12},{energy:1,exhaust:true}],
  swift:[{block:20},{draw:4}],
  crescent:[{damage:19,comboScale:3},{block:8,draw:1}],
  snowstep:[{block:18,comboBlock:5},{draw:2}],
  pounce:[{damage:12},{block:5}],
  moonfang:[{damage:22,comboScale:5},{draw:2,block:6}],
  tailwind:[{draw:5},{energy:1}],
  shadowdance:[{dexterity:6},{draw:2,block:8}],
  snowfall:[{damage:19,comboScale:3},{frost:6,block:10}],
  wolfheart:[{blockTurn:10},{drawTurn:2}],
  crossmoon:[{damage:20,comboScale:3},{damage:8,hits:3,draw:2}],
  nightdance:[{damage:42,comboScale:8},{block:16,draw:2}],
  silverwaltz:[{damage:12},{damage:6,hits:5,block:14}],
  // 共通カード：主効果の量 / 複数の役割。
  quick:[{block:12},{energy:1,exhaust:true}],
  focus:[{draw:6},{block:10}],
  bash:[{damage:27},{vulnerable:5,block:10}],
  cleave:[{damage:19},{block:7,draw:1}],
  fortress:[{block:45},{draw:2,energy:1}],
  agile:[{dexterity:6},{block:12,draw:1}],
  wisdom:[{energy:5},{draw:2}],
  precision:[{strength:9},{block:12,draw:1}],
  needle:[{damage:13},{weak:1}],
  healing:[{regen:10},{block:10,draw:1}],
  meteor:[{damage:54},{draw:4,block:10}],
  evergreen:[{block:28},{draw:2,energy:1}],
  lucky:[{draw:5},{block:10,energy:1}]
};
const basicSupport={
  knight:{strike:{damage:9,bloom:2},guard:{block:8,bloom:2}},
  witch:{strike:{damage:9,frost:3},guard:{block:8,draw:1}},
  alchemist:{strike:{damage:9,poison:4},guard:{block:8,regen:2}},
  dragoon:{strike:{damage:9,heat:3},guard:{block:8,heat:3}},
  ranger:{strike:{damage:6,hits:2,draw:1},guard:{cost:0,block:8}}
};
D.branches=(id,hero)=>{
  const c=D.cards[id],pair=evolutionPairs[id];if(!c||!pair)return {};
  const names=themes[c.hero==='all'&&['strike','guard'].includes(id)?hero:c.hero]||themes.all;
  return {
    power:{id:'power',name:names[0],subtitle:c.type==='attack'?'威力重視 · ダメージを大きく伸ばす':'主効果重視 · 防御・毒・強化量を伸ばす',effects:{...pair[0]}},
    technique:{id:'technique',name:names[1],subtitle:'補助重視 · 手札・守り・固有効果を伸ばす',effects:{...(basicSupport[hero]?.[id]||pair[1])}}
  };
};
D.bossRules={seleneHealRate:.05,griffinInterruptHits:5};
Object.assign(D.relics,{
rosegrail:{name:'薔薇の聖杯',icon:'cup',hero:'knight',desc:'カードで開花を得るたび、得た開花の2倍のブロックを得る。'},petalseal:{name:'花聖の紋章',icon:'flower',hero:'knight',desc:'毎ターン最初のアタックは、開花5以上なら敵全体を対象にする。'},frostbell:{name:'氷月の鈴',icon:'bell',hero:'witch',desc:'カードで敵に氷結を与えるたび、3ブロック。カード1枚につき1回。'},moonquill:{name:'星詠みの羽根',icon:'feather',hero:'witch',desc:'毎ターン最初のスキル使用後、カードを1枚引く。'},amberflask:{name:'琥珀の蒸留瓶',icon:'potion',hero:'alchemist',desc:'毎ターン最初に毒を付与するカードは、対象にさらに毒2。'},rootretort:{name:'根の調合炉',icon:'leaf',hero:'alchemist',desc:'ターン終了時、生きている毒状態の敵がいれば4ブロック。'},sunemblem:{name:'太陽竜の勲章',icon:'flame',hero:'dragoon',desc:'毎ターン最初のアタックは、灼熱6以上なら敵全体を対象にする。'},embercore:{name:'不滅の火種',icon:'crystal',hero:'dragoon',desc:'毎ターン最初のアタックで灼熱が1減らなくなる。灼熱の全消費は防げない。'},silvermetronome:{name:'銀狼の拍子',icon:'moon',hero:'ranger',desc:'1ターン中、カードを3枚使うごとに1枚引き、エナジー1を得る。'},moonpin:{name:'双月の髪飾り',icon:'star',hero:'ranger',desc:'毎ターン1回、連携2以上で使うアタックの攻撃回数が1増える。'}});
const A=(damage,hits=1)=>({kind:'attack',damage,hits}),B=strength=>({kind:'buff',strength}),S=block=>({kind:'defend',block}),M=(damage,status,amount)=>({kind:'debuff',damage,status,amount});
Object.assign(D.enemies,{crystalguard:{name:'星晶の護衛',sprite:16,hp:34,pattern:[S(5),A(6)]},sunseed:{name:'日輪の種',sprite:17,hp:56,pattern:[A(7,2),S(14),B(2)]},cloudfox:{name:'雲わたりの狐',sprite:18,hp:58,pattern:[A(8,2),M(9,'weak',1),A(19)]},clockowl:{name:'ぜんまいフクロウ',sprite:19,hp:62,pattern:[S(16),A(9,2),B(2)]},cometling:{name:'流星の精',sprite:20,hp:60,pattern:[M(10,'dazed',1),A(7,3),S(10)]},zodiacknight:{name:'黄道の騎士',sprite:21,hp:85,pattern:[S(20),A(22),A(10,2)]},eliteStorm:{name:'嵐を織る狐',sprite:18,hp:120,elite:true,pattern:[B(2),A(8,3),M(18,'vulnerable',1)]},eliteZodiac:{name:'黄道の近衛',sprite:21,hp:145,elite:true,pattern:[S(22),A(10,3),B(3),A(30)]},bossGriffin:{name:'蒼嵐のグリフィア',sprite:14,hp:390,boss:true,phase:'天を裂く翼',pattern:[A(12,2),A(36)]},bossAurora:{name:'暁光竜ソレイユ',sprite:15,hp:510,boss:true,phase:'めぐる日と月',pattern:[A(13,2),A(38)]}});
D.acts.push({name:'極光の天城',en:'THE AURORA CITADEL',boss:'bossGriffin',theme:'aurora',line:'嵐の先に、星の階段。',normal:[['cloudfox','crystalguard'],['clockowl','bat2'],['cometling','slime2'],['cloudfox','clockowl']],elite:['eliteStorm','eliteDragon']},{name:'暁の聖域',en:'THE SUNHEART SANCTUARY',boss:'bossAurora',theme:'sunheart',line:'小さな勇気が、朝をひらく。',normal:[['zodiacknight','sunseed'],['cometling','clockowl'],['sunseed','cloudfox'],['zodiacknight','crystalguard']],elite:['eliteZodiac','eliteStorm']});D.actFor=i=>D.acts[i%D.acts.length];D.events.find(e=>e.id==='library').options[0].detail='未強化のカードをランダムに2枚、＋に強化';if(typeof module!=='undefined'&&module.exports)module.exports=D;
})(typeof window!=='undefined'?window:globalThis);
