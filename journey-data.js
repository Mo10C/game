/* Run-long choices. IDs are stable so old adventures remain importable. */
(function(root){
  'use strict';
  const D=typeof module!=='undefined'&&module.exports?require('./expansion-data.js'):root.BloomData;
  const entries={
    knight:[
      ['bloomBlade','満開の剣','BLOOM SOVEREIGN','一撃を育てる','sword','毎ターン最初のアタックの初撃に、開花×3の追加威力（最大30）。全体攻撃なら各対象に適用。'],
      ['bloomWard','花守りの誓約','PETAL AEGIS','開花を守りに','shield','カードで開花を得るたび、その数×3のブロックを得る。専用レリックの効果とも重なる。'],
      ['bloomCycle','春風の輪舞','SPRING REPRISE','手札と開花を巡らせる','flower','毎ターン最初のスキル使用後、開花2を得てカードを1枚引く。']
    ],
    witch:[
      ['frostBurst','砕月の魔女','SHATTERED MOON','氷結を一撃に','sword','毎ターン最初のアタックは、攻撃後に対象の氷結を最大5消費。初撃の威力が消費数×6増える。'],
      ['frostKeep','永久凍土','ETERNAL WINTER','氷結を積み上げる','crystal','敵の行動後に氷結が減らなくなる。自分のターン開始時、敵全体に氷結1。'],
      ['starReader','星の導き','ASTRAL GUIDANCE','魔法と防御をつなぐ','book','毎ターン最初のスキル使用後、6ブロックを得てカードを1枚引く。']
    ],
    alchemist:[
      ['venomCore','深森の劇薬','VENOM HEART','毒を濃くする','leaf','毎ターン最初に毒を付与するカードは、生きている各対象に追加で毒6。毒の倍化より先に加わる。'],
      ['lifeBrew','生命の調合','LIVING ELIXIR','毒と回復で粘る','heart','自分のターン終了時、生きている毒状態の敵がいればHPを2回復し、6ブロックを得る。'],
      ['reagentCycle','錬金の循環','PERFECT CATALYST','廃棄を次の一手に','potion','毎ターン初めて、使用後に廃棄されるカードを使うと2枚引き、エナジー1。パワーも対象。']
    ],
    dragoon:[
      ['heatRise','不滅の竜心','UNDYING EMBER','灼熱を育て続ける','fire','自分のターン開始時、灼熱2を得る。毎ターン最初のアタックでは通常の灼熱1減少がなくなる。全消費は対象外。'],
      ['heatBurst','赫焔の解放','CRIMSON RELEASE','灼熱を大技に','sword','毎ターン最初のアタックは、攻撃後に灼熱を最大4追加消費。初撃の威力が消費数×6増える。'],
      ['heatWard','陽炎の守護','SUNLIT AEGIS','灼熱を防御に','shield','カードで灼熱を得るたび、その数×3のブロックを得る。']
    ],
    ranger:[
      ['moonHunt','銀月の狩人','SILVER HUNT','連携から猛攻へ','sword','毎ターン1回、ほかのカードを2枚以上使った後のアタックは、すべてのヒットの威力が6増える。'],
      ['windWard','風纏いの舞','WIND DANCER','連携で身を守る','shield','同じターンにカードを3枚使うごとに、9ブロックを得る。'],
      ['windCycle','星渡り','STAR RUNNER','連携を長くつなぐ','feather','毎ターン3枚目のカード使用後、2枚引き、エナジー1を得る。毎ターン1回。']
    ]
  };
  D.awakenings={};
  for(const [hero,choices] of Object.entries(entries))choices.forEach(([id,name,en,style,icon,desc],index)=>{D.awakenings[id]={id,hero,name,en,style,icon,desc,index};});
  D.awakeningChoices=hero=>Object.values(D.awakenings).filter(a=>a.hero===hero);
  const familiars={
    knight:[
      ['roseDrake','ロゼ','花竜','花竜の息吹','ROSE BREATH','全体攻撃・開花','敵全体に12ダメージ。開花2を得る。',{damage:12,bloom:2},'beam','紅薔薇の双奏'],
      ['petalWisp','フルール','花の精霊','花守りの約束','PETAL PROMISE','防御・開花','16ブロックと開花1を得る。',{block:16,bloom:1},'ward','花精の聖域'],
      ['dewFawn','ルル','露の幻鹿','朝露の贈りもの','MORNING DEW','回復・手札','HPを6回復し、カードを1枚引く。',{heal:6,draw:1},'heal','春露の祝福']
    ],
    witch:[
      ['frostDrake','フロス','氷晶竜','氷晶の息吹','CRYSTAL BREATH','全体攻撃・氷結','敵全体に8ダメージと氷結3。',{damage:8,frost:3},'crystal','凍星の共鳴'],
      ['starJelly','ステラ','星の精霊','星屑の道標','STARDUST GUIDE','手札・エナジー','カードを2枚引き、エナジー1を得る。',{draw:2,energy:1},'star','星海の導き'],
      ['moonFox','ルミ','月狐','月影の帳','MOON VEIL','氷結・防御','敵全体に氷結5。8ブロックを得る。',{frost:5,block:8},'crystal','双月の結界']
    ],
    alchemist:[
      ['mossDrake','モス','苔竜','深緑の霧','VERDANT MIST','毒を積み重ねる','敵全体に毒8。',{poison:8},'poison','深森の秘薬'],
      ['honeyBee','ミツネ','蜜蜂の精霊','蜜色の救急便','HONEY REMEDY','回復・防御','HPを8回復し、6ブロックを得る。',{heal:8,block:6},'heal','琥珀の生命樹'],
      ['sporeWisp','ポルカ','茸の精霊','まどろみの胞子','DROWSY SPORES','脱力・手札','敵全体に脱力2。カードを2枚引く。',{weak:2,draw:2},'poison','夢見の森風']
    ],
    dragoon:[
      ['emberDrake','イグニ','火竜','紅蓮の息吹','EMBER BREATH','全体攻撃・灼熱','敵全体に18ダメージ。灼熱2を得る。',{damage:18,heat:2},'beam','紅蓮の双翼'],
      ['phoenixChick','フィノ','不死鳥の雛','不死鳥の灯火','PHOENIX SPARK','灼熱・手札','灼熱5を得て、カードを1枚引く。',{heat:5,draw:1},'star','不滅の陽炎'],
      ['amberSalamander','コハク','琥珀の火蜥蜴','琥珀の火衣','AMBER AEGIS','防御・灼熱','14ブロックと灼熱3を得る。',{block:14,heat:3},'ward','陽だまりの誓い']
    ],
    ranger:[
      ['windGryph','シルフ','小さなグリフィン','五連の風翼','FIVEFOLD GALE','5連撃・手札','敵全体に4ダメージを5回。カードを1枚引く。',{damage:4,hits:5,draw:1},'slash','蒼風の連翼'],
      ['silverFox','ルカ','銀月狐','銀月の加護','SILVER BLESSING','防御・手札','12ブロックを得て、カードを2枚引く。',{block:12,draw:2},'ward','月下の双影'],
      ['cloudRay','ゼファ','風の精霊','追い風の便り','TAILWIND LETTER','エナジー・手札','エナジー2を得て、カードを1枚引く。',{energy:2,draw:1},'star','星渡りの追い風']
    ]
  };
  D.companions={};
  for(const [hero,choices] of Object.entries(familiars))choices.forEach(([id,name,species,skill,en,role,desc,effects,fx,bondName],index)=>{D.companions[id]={id,hero,index,name,species,skill,en,role,desc,effects,fx,bondName,color:D.heroes[hero].color,quote:name+'、力を貸して！'};});
  D.companionChoices=hero=>Object.values(D.companions).filter(c=>c.hero===hero);
  D.familiarArt={
    knight:{src:'./assets/familiars-knight.png',regions:[[8,130,537,780],[537,185,1041,858],[1041,110,1535,861]]},
    witch:{src:'./assets/familiars-witch.png',regions:[[8,207,563,800],[563,243,990,797],[1007,206,1532,783]]},
    alchemist:{src:'./assets/familiars-alchemist.png',regions:[[13,231,575,789],[575,236,1040,761],[1064,228,1519,782]]},
    dragoon:{src:'./assets/familiars-dragoon.png',regions:[[8,186,522,809],[524,163,1041,871],[1059,210,1528,831]]},
    ranger:{src:'./assets/familiars-ranger.png',regions:[[8,155,529,769],[529,224,1020,747],[1030,245,1525,850]]}
  };
  // Use current metadata for art, including enemies restored from older saves.
  D.enemies.bossDragon.bossArt='./assets/boss-night.png';
  D.enemies.bossGriffin.bossArt='./assets/boss-storm.png';
  D.enemies.bossAurora.bossArt='./assets/boss-solar.png';
  Object.assign(D.enemies,{
    eliteNightling:{name:'夜晶の幼竜',sprite:11,hp:105,elite:true,pattern:[{kind:'defend',block:16},{kind:'attack',damage:9,hits:2},{kind:'buff',strength:2}]},
    eliteGryphlet:{name:'蒼嵐の若翼',sprite:14,hp:128,elite:true,pattern:[{kind:'attack',damage:7,hits:3},{kind:'defend',block:18},{kind:'attack',damage:24}]},
    eliteSunling:{name:'暁光の若竜',sprite:15,hp:150,elite:true,pattern:[{kind:'defend',block:20},{kind:'attack',damage:10,hits:3},{kind:'buff',strength:3}]}
  });
  D.acts[2].elite.push('eliteNightling');D.acts[3].elite.push('eliteGryphlet');D.acts[4].elite.push('eliteSunling');
  D.resonances={
    knight:{desc:'開花2を追加で得る。',effects:{bloom:2}},
    witch:{desc:'敵全体に追加で氷結2。',effects:{frost:2}},
    alchemist:{desc:'敵全体に追加で毒3。',effects:{poison:3}},
    dragoon:{desc:'灼熱2を追加で得る。',effects:{heat:2}},
    ranger:{desc:'エナジー1を追加で得る。',effects:{energy:1}}
  };
  D.bondFor=(hero,companion)=>{const c=D.companions[companion];return c?.hero===hero?{name:c.bondName,lead:c.name+'、一緒に道をひらこう！',reply:'小さな相棒が、きみの想いに応える。'}:null;};
  if(typeof module!=='undefined'&&module.exports)module.exports=D;
})(typeof window!=='undefined'?window:globalThis);
