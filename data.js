(function (root) {
  'use strict';
  const cards = {};
  function card(id, name, hero, type, cost, art, rarity, effects, upgrade, note = '') {
    cards[id] = {id, name, hero, type, cost, art, rarity, effects, upgrade, note};
  }
  card('strike', '花びらの一閃', 'all', 'attack', 1, 0, 'basic', {damage:6}, {damage:9});
  card('guard', 'おまもり', 'all', 'skill', 1, 1, 'basic', {block:5}, {block:8});
  card('bloomcut', 'つぼみ斬り', 'knight', 'attack', 1, 2, 'basic', {damage:5,bloom:1}, {damage:8,bloom:2});
  card('spark', '月のしずく', 'witch', 'attack', 1, 3, 'basic', {damage:5,frost:2}, {damage:8,frost:3});
  card('toxic', 'ひみつの調合', 'alchemist', 'skill', 1, 6, 'basic', {poison:4}, {poison:7});
  card('rose', 'ローズエッジ', 'knight', 'attack', 1, 2, 'common', {damage:8,bloom:1}, {damage:11,bloom:2});
  card('doublecut', 'ふたひら', 'knight', 'attack', 1, 0, 'common', {damage:4,hits:2}, {damage:6});
  card('petalguard', '花のかさ', 'knight', 'skill', 1, 1, 'common', {block:8,bloom:1}, {block:11});
  card('petaldraw', '春風の便り', 'knight', 'skill', 0, 10, 'common', {draw:1,bloom:1}, {draw:2});
  card('bramble', 'いばらの構え', 'knight', 'power', 1, 7, 'uncommon', {thorns:3}, {thorns:5});
  card('flourish', '咲き誇る剣', 'knight', 'attack', 2, 2, 'uncommon', {damage:12,bloomScale:3}, {damage:16,bloomScale:4}, '開花の数だけ追加ダメージ。');
  card('petalstorm', '花吹雪', 'knight', 'attack', 2, 0, 'uncommon', {damage:9,aoe:true,bloom:2}, {damage:13});
  card('resolve', '小さな勇気', 'knight', 'power', 1, 11, 'uncommon', {strength:2}, {strength:3});
  card('bloomheart', '花守りの心', 'knight', 'power', 2, 9, 'rare', {bloomTurn:2}, {bloomTurn:3});
  card('riposte', '返り咲き', 'knight', 'attack', 1, 0, 'common', {damage:7,block:5}, {damage:10,block:7});
  card('petalwall', '千花の盾', 'knight', 'skill', 2, 1, 'uncommon', {block:15,bloomBlock:3}, {block:20});
  card('finalbloom', '満開のフィナーレ', 'knight', 'attack', 3, 2, 'rare', {damage:7,hits:3,aoe:true,exhaust:true}, {damage:10});
  card('dew', '朝露の約束', 'knight', 'skill', 1, 9, 'common', {block:6,regen:2}, {block:9,regen:3});
  card('moonbolt', 'ムーンボルト', 'witch', 'attack', 1, 3, 'common', {damage:8,frost:1}, {damage:11,frost:2});
  card('icewall', '氷のカーテン', 'witch', 'skill', 1, 4, 'common', {block:7,frost:1,aoe:true}, {block:10,frost:2});
  card('stargaze', '星をよむ', 'witch', 'skill', 0, 11, 'common', {draw:2,exhaust:true}, {draw:3});
  card('frostbite', 'こごえる息', 'witch', 'skill', 1, 4, 'common', {frost:4,weak:1}, {frost:6,weak:2});
  card('lightning', '星降る雷', 'witch', 'attack', 1, 5, 'uncommon', {damage:3,hits:3}, {damage:5});
  card('blizzard', 'きらめく吹雪', 'witch', 'attack', 2, 4, 'uncommon', {damage:10,aoe:true,frost:3}, {damage:14,frost:4});
  card('shatter', '砕ける月影', 'witch', 'attack', 1, 3, 'uncommon', {damage:6,frostScale:3}, {damage:9,frostScale:4});
  card('comet', '流れ星の約束', 'witch', 'attack', 2, 11, 'uncommon', {damage:19,draw:1}, {damage:25});
  card('moonaura', '月のヴェール', 'witch', 'power', 1, 3, 'uncommon', {blockTurn:4}, {blockTurn:6});
  card('astronomy', '星図のひみつ', 'witch', 'power', 2, 11, 'rare', {drawTurn:1}, {cost:1});
  card('absolute', '真夜中の静寂', 'witch', 'skill', 2, 4, 'rare', {frost:8,aoe:true,block:12,exhaust:true}, {frost:11,block:18});
  card('supernova', 'スーパーノヴァ', 'witch', 'attack', 3, 5, 'rare', {damage:27,aoe:true,exhaust:true}, {damage:36});
  card('moonstep', '月うさぎの足音', 'witch', 'skill', 1, 10, 'common', {block:5,draw:2}, {block:8});
  card('venom', 'こもれびの毒', 'alchemist', 'skill', 1, 7, 'common', {poison:6}, {poison:9});
  card('flask', 'ぽいっとフラスコ', 'alchemist', 'attack', 1, 6, 'common', {damage:7,poison:3}, {damage:10,poison:4});
  card('mist', 'スモークミスト', 'alchemist', 'skill', 1, 6, 'common', {block:7,weak:1,aoe:true}, {block:10,weak:2});
  card('brew', 'とっておきのレシピ', 'alchemist', 'skill', 0, 6, 'common', {draw:1,energy:1,exhaust:true}, {draw:2});
  card('cloud', 'みどりの雲', 'alchemist', 'skill', 2, 7, 'uncommon', {poison:7,aoe:true}, {poison:10});
  card('catalyst', '魔法の触媒', 'alchemist', 'skill', 1, 6, 'uncommon', {poisonMultiply:2,exhaust:true}, {poisonMultiply:3});
  card('blast', 'はじける実験', 'alchemist', 'attack', 2, 8, 'uncommon', {damage:14,aoe:true}, {damage:20});
  card('recycle', 'リサイクル瓶', 'alchemist', 'skill', 1, 6, 'common', {block:5,draw:2}, {block:8});
  card('toxicology', '森の薬学', 'alchemist', 'power', 1, 7, 'uncommon', {poisonTurn:2}, {poisonTurn:3});
  card('medicine', 'お手製の薬', 'alchemist', 'skill', 1, 9, 'uncommon', {heal:6,exhaust:true}, {heal:9});
  card('leech', 'いばらの口づけ', 'alchemist', 'attack', 1, 7, 'uncommon', {damage:6,poisonScale:1}, {damage:10});
  card('philosopher', '賢者のしずく', 'alchemist', 'power', 2, 11, 'rare', {energyTurn:1}, {cost:1});
  card('pandora', '虹色の大実験', 'alchemist', 'skill', 3, 8, 'rare', {poison:15,aoe:true,weak:3,exhaust:true}, {poison:21});
  card('quick', 'クイックステップ', 'all', 'skill', 0, 10, 'common', {block:3}, {block:5});
  card('focus', '深呼吸', 'all', 'skill', 1, 11, 'common', {draw:3}, {draw:4});
  card('bash', 'スターインパクト', 'all', 'attack', 2, 0, 'common', {damage:10,vulnerable:2}, {damage:14,vulnerable:3});
  card('cleave', 'ぐるりん斬り', 'all', 'attack', 1, 0, 'common', {damage:7,aoe:true}, {damage:10});
  card('fortress', '星くずの砦', 'all', 'skill', 2, 1, 'uncommon', {block:18}, {block:25});
  card('agile', 'ふわりと身かわし', 'all', 'power', 1, 10, 'uncommon', {dexterity:2}, {dexterity:3});
  card('wisdom', '古い魔導書', 'all', 'skill', 0, 11, 'uncommon', {energy:2,exhaust:true}, {energy:3});
  card('precision', '星へのねがい', 'all', 'skill', 1, 11, 'uncommon', {strength:3,exhaust:true}, {strength:5});
  card('needle', '流星の針', 'all', 'attack', 0, 5, 'common', {damage:4}, {damage:6});
  card('healing', 'ひだまりのお茶', 'all', 'skill', 1, 9, 'uncommon', {regen:4,exhaust:true}, {regen:6});
  card('meteor', '夜明けのきらめき', 'all', 'attack', 2, 11, 'rare', {damage:22,draw:2}, {damage:30});
  card('evergreen', 'とこしえの庭', 'all', 'power', 2, 9, 'rare', {preserveBlock:true}, {cost:1});
  card('lucky', 'ラッキークローバー', 'all', 'skill', 0, 9, 'uncommon', {draw:2,exhaust:true}, {draw:3});
  card('curse', '迷いの霧', 'all', 'curse', -1, 7, 'curse', {}, {}, 'プレイできない。手札にあるままターンを終えると2ダメージ。');
  card('dazed', 'まどろみ', 'all', 'status', -1, 3, 'status', {ethereal:true}, {}, 'プレイできない。ターン終了時に廃棄。');

  // Each ultimate is a real collectible card, with its own cut-in and effect profile.
  card('roseoath','薔薇の誓い','knight','attack',2,2,'rare',{damage:17,bloom:3,exhaust:true},{damage:24,bloom:4});
  card('sanctuary','花聖のサンクチュアリ','knight','skill',2,9,'rare',{block:22,bloom:3,regen:3,exhaust:true},{block:30,regen:5});
  card('eclipse','月蝕のアリア','witch','attack',2,3,'rare',{damage:16,frost:5,exhaust:true},{damage:23,frost:7});
  card('venomgarden','禁断のエデン','alchemist','skill',2,7,'rare',{poison:8,poisonMultiply:2,exhaust:true},{poison:12});
  card('elixir','黄金のエリクシル','alchemist','skill',2,9,'rare',{heal:12,block:18,exhaust:true},{heal:16,block:24});
  card('ember','火花のひと突き','dragoon','attack',1,8,'basic',{damage:6,heat:2},{damage:9,heat:3});
  card('kindle','たき火のおまじない','dragoon','skill',0,8,'common',{heat:3},{heat:5});
  card('flameguard','紅蓮のまもり','dragoon','skill',1,1,'common',{block:7,heat:2},{block:10,heat:3});
  card('spear','竜槍の一閃','dragoon','attack',1,0,'common',{damage:9},{damage:13});
  card('cinders','火の粉のおどり','dragoon','attack',1,8,'common',{damage:4,aoe:true,heat:1},{damage:7,heat:2});
  card('warmth','ほかほかの息','dragoon','skill',1,9,'common',{block:5,draw:2},{block:8});
  card('ignition','心に火をともして','dragoon','power',1,8,'uncommon',{heatTurn:2},{heatTurn:3});
  card('dragonfang','竜牙の二連槍','dragoon','attack',2,0,'uncommon',{damage:7,hits:2},{damage:10});
  card('forge','小さな鍛冶屋','dragoon','skill',1,1,'uncommon',{block:10,heat:4},{block:14,heat:5});
  card('firewheel','紅い輪舞','dragoon','attack',2,8,'uncommon',{damage:12,aoe:true,weak:1},{damage:17,weak:2});
  card('dragonheart','竜のこころ','dragoon','power',2,11,'rare',{strength:3,heatTurn:2},{strength:4,heatTurn:3});
  card('crimsonlance','紅蓮・竜槍閃','dragoon','attack',2,0,'rare',{damage:18,heatScale:2,exhaust:true},{damage:25});
  card('dragonflare','竜焔のレクイエム','dragoon','attack',3,8,'rare',{damage:22,aoe:true,heat:5,exhaust:true},{damage:30,heat:7});
  card('sunfall','落陽のラグナロク','dragoon','attack',3,11,'rare',{damage:10,hits:3,exhaust:true},{damage:14});
  card('twinfang','双牙のステップ','ranger','attack',1,0,'basic',{damage:3,hits:2,comboScale:1},{damage:5});
  card('feint','いたずらフェイント','ranger','skill',0,10,'common',{block:3},{block:5});
  card('swift','風をすりぬけて','ranger','skill',1,10,'common',{block:6,draw:1},{block:9,draw:2});
  card('crescent','三日月ナイフ','ranger','attack',1,3,'common',{damage:7,comboScale:2},{damage:10});
  card('snowstep','雪わたり','ranger','skill',1,4,'common',{block:5,comboBlock:3},{block:8});
  card('pounce','おおかみジャンプ','ranger','attack',0,0,'common',{damage:3},{damage:5});
  card('moonfang','銀狼の牙','ranger','attack',1,3,'uncommon',{damage:8,comboScale:3},{damage:12});
  card('tailwind','追い風のリズム','ranger','skill',0,10,'uncommon',{draw:2,exhaust:true},{draw:3});
  card('shadowdance','影のおどり子','ranger','power',1,10,'uncommon',{dexterity:2},{dexterity:3});
  card('snowfall','白銀の雨','ranger','attack',2,4,'uncommon',{damage:7,aoe:true,frost:2,comboScale:2},{damage:10,frost:3});
  card('wolfheart','月に誓った約束','ranger','power',2,11,'rare',{drawTurn:1,blockTurn:3},{blockTurn:5});
  card('crossmoon','双月・クロスファング','ranger','attack',2,0,'rare',{damage:8,hits:2,comboScale:2,exhaust:true},{damage:11});
  card('nightdance','零夜の居合','ranger','attack',2,3,'rare',{damage:17,comboScale:5,exhaust:true},{damage:24});
  card('silverwaltz','銀狼のワルツ','ranger','attack',3,4,'rare',{damage:5,hits:4,aoe:true,exhaust:true},{damage:7});
  const ultimateGroups = {
    knight:[['roseoath','ROSE OATH','rose-slash'],['sanctuary','SACRED GARDEN','petal-sanctuary'],['finalbloom','BLOSSOM FINALE','bloom-finale']],
    witch:[['eclipse','LUNAR ECLIPSE','lunar-eclipse'],['absolute','ABSOLUTE ZERO','absolute-zero'],['supernova','SUPERNOVA','supernova']],
    alchemist:[['venomgarden','FORBIDDEN EDEN','venom-eden'],['elixir','GOLDEN ELIXIR','golden-elixir'],['pandora','PRISMATIC WONDER','prism-burst']],
    dragoon:[['crimsonlance','CRIMSON LANCE','crimson-lance'],['dragonflare','DRAGON REQUIEM','dragon-flare'],['sunfall','RAGNAROK','sun-fall']],
    ranger:[['crossmoon','CROSS FANG','cross-fang'],['nightdance','MIDNIGHT DRAW','midnight-draw'],['silverwaltz','SILVER WALTZ','silver-waltz']]
  };
  for(const [hero,list] of Object.entries(ultimateGroups))list.forEach(([id,en,fx],index)=>{cards[id].ultimate={hero,index,en,fx};});
  const heroes = {
    knight:{id:'knight',name:'リリィ',role:'花守りの剣士',en:'THE BLOSSOM KNIGHT',sprite:0,color:'#ef91a8',hp:78,starter:'bloomcut',relic:'ribbon',quote:'一緒なら、きっと花は咲くよ。',mechanic:'開花',description:'「開花」を重ねて剣を強く。攻撃と防御のバランスに優れた、はじめての旅におすすめの剣士。'},
    witch:{id:'witch',name:'ルーナ',role:'星よみの魔女',en:'THE MOONLIT WITCH',sprite:1,color:'#9abbe9',hp:66,starter:'spark',relic:'moonstone',quote:'星は、きみの味方だよ。',mechanic:'氷結',description:'「氷結」で敵の攻撃を弱め、魔法をつないで一気に攻める。手札を巡らせるテクニカルな魔女。'},
    alchemist:{id:'alchemist',name:'ミエル',role:'森の錬金術師',en:'THE FOREST ALCHEMIST',sprite:2,color:'#a9d7a1',hp:70,starter:'toxic',relic:'vial',quote:'とびきりのレシピ、見せてあげる！',mechanic:'毒',description:'「毒」はブロックを無視してじわじわ効く。調合と回復で粘り、強敵を倒す小さな研究家。'},
    dragoon:{id:'dragoon',name:'フレア',role:'陽だまりの竜騎士',en:'THE SUNLIT DRAGOON',sprite:12,color:'#ffad6b',hp:76,starter:'ember',relic:'dragonscale',quote:'この炎で、明日を照らすよ！',mechanic:'灼熱',description:'「灼熱」をため、炎の槍で一気に攻める。熱は攻撃するたび1減るので、連続攻撃に合わせて解き放とう。'},
    ranger:{id:'ranger',name:'ノエル',role:'銀月の双剣士',en:'THE SILVERMOON RANGER',sprite:13,color:'#bfa7fa',hp:68,starter:'twinfang',relic:'wolfcharm',quote:'ついてきて。月より速く！',mechanic:'連携',description:'軽いカードをつなぐほど、双剣が鋭くなる。同じターンに使ったカードの枚数で「連携」技を強化する双剣士。'}
  };
  for(const h of Object.values(heroes))h.ultimates=ultimateGroups[h.id].map(x=>x[0]);
  const relics = {
    dragonscale:{name:'陽だまりの竜鱗',icon:'flame',desc:'戦闘開始時に灼熱3。毎ターン、灼熱を1得る。',starter:true},
    wolfcharm:{name:'銀狼のお守り',icon:'moon',desc:'毎ターン、最初のアタック使用時に3ブロックを得る。',starter:true},
    ribbon:{name:'花結びのリボン',icon:'flower',desc:'戦闘開始時、開花を1得る。戦闘勝利後、HPを4回復。',starter:true},
    moonstone:{name:'月のペンダント',icon:'moon',desc:'戦闘開始時、すべての敵に氷結2。最初のターンに1枚追加で引く。',starter:true},
    vial:{name:'こもれびの小瓶',icon:'potion',desc:'戦闘開始時、すべての敵に毒2。ポーションの回復量が8増える。',starter:true},
    clover:{name:'四つ葉のしおり',icon:'flower',desc:'毎ターン、最初に得るブロックが3増える。'},
    bell:{name:'朝露のベル',icon:'bell',desc:'最初のターン、エナジーを1多く得る。'},
    feather:{name:'星鳥の羽',icon:'feather',desc:'毎ターン、カードを1枚多く引く。'},
    thorn:{name:'いばらのブローチ',icon:'flower',desc:'戦闘開始時、トゲを3得る。'},
    cookie:{name:'焼きたてクッキー',icon:'heart',desc:'獲得時、最大HPが12増えてHPを12回復。'},
    compass:{name:'花灯りのコンパス',icon:'compass',desc:'戦闘のゴールド報酬が50%増える。'},
    sword:{name:'ちいさな聖剣',icon:'sword',desc:'戦闘開始時、筋力を2得る。'},
    shell:{name:'虹色の貝がら',icon:'shield',desc:'戦闘開始時、ブロックを10得る。'},
    honey:{name:'妖精のはちみつ',icon:'potion',desc:'戦闘勝利後、HPを5回復。'},
    lantern:{name:'星くずランタン',icon:'star',desc:'毎ターン、エナジーを1多く得る。',boss:true},
    seed:{name:'永遠の種',icon:'flower',desc:'戦闘開始時、毎ターン開花を1得る効果を獲得。'},
    hourglass:{name:'月砂の時計',icon:'moon',desc:'戦闘開始時、すべての敵に脱力2。'},
    crystal:{name:'氷星のかけら',icon:'crystal',desc:'戦闘開始時、すべての敵に氷結3。'},
    mask:{name:'深森のマスク',icon:'leaf',desc:'戦闘開始時、すべての敵に毒3。'},
    boots:{name:'風わたりの靴',icon:'feather',desc:'戦闘開始時、敏捷性を2得る。'},
    teacup:{name:'お昼寝ティーカップ',icon:'cup',desc:'休憩での回復量が、最大HPの15%分増える。'},
    crown:{name:'花王の冠',icon:'crown',desc:'毎ターン、筋力を1得る。',boss:true},
    mirror:{name:'銀月の鏡',icon:'moon',desc:'毎ターン、ブロックを6得る。',boss:true},
    pearl:{name:'まもりの真珠',icon:'star',desc:'戦闘開始時、再生を5得る。'}
  };
  const A=(damage,hits=1)=>({kind:'attack',damage,hits});
  const D=(block)=>({kind:'defend',block});
  const B=(strength)=>({kind:'buff',strength});
  const M=(damage,status,amount)=>({kind:'debuff',damage,status,amount});
  const enemies={
    slime:{name:'もちスライム',sprite:3,hp:28,pattern:[A(6),D(7),A(8)]},
    shroom:{name:'ねむりキノコ',sprite:4,hp:32,pattern:[M(4,'weak',1),A(8),D(6)]},
    bat:{name:'よなかコウモリ',sprite:5,hp:24,pattern:[A(4,2),B(1),A(9)]},
    ghost:{name:'まよいゴースト',sprite:6,hp:30,pattern:[M(5,'vulnerable',1),A(9),D(8)]},
    nut:{name:'どんぐり衛兵',sprite:7,hp:42,pattern:[D(10),A(10),A(6,2)]},
    dragon:{name:'こりゅうのピノ',sprite:8,hp:46,pattern:[A(8),B(2),A(6,2)]},
    slime2:{name:'しずくスライム',sprite:3,hp:42,pattern:[A(9),M(6,'weak',2),D(10)],tint:'blue'},
    shroom2:{name:'星屑キノコ',sprite:4,hp:44,pattern:[M(6,'dazed',1),A(12),D(8)],tint:'blue'},
    bat2:{name:'宵闇コウモリ',sprite:5,hp:35,pattern:[A(5,2),B(2),A(13)],tint:'rose'},
    ghost2:{name:'月影ゴースト',sprite:6,hp:48,pattern:[M(7,'vulnerable',2),D(12),A(14)],tint:'blue'},
    nut2:{name:'近衛どんぐり',sprite:7,hp:56,pattern:[D(14),A(13),A(7,2)],tint:'rose'},
    dragon2:{name:'こりゅうのルビィ',sprite:8,hp:62,pattern:[M(10,'weak',1),B(3),A(7,2)],tint:'rose'},
    eliteNut:{name:'森の門番',sprite:7,hp:98,elite:true,pattern:[B(3),A(7,2),D(15),A(22)]},
    eliteGhost:{name:'夢くいの番人',sprite:6,hp:91,elite:true,pattern:[M(8,'dazed',2),A(15),M(9,'vulnerable',2),A(9,2)]},
    eliteDragon:{name:'古樹のこりゅう',sprite:8,hp:110,elite:true,pattern:[D(14),A(8,2),B(3),A(24)]},
    bossRose:{name:'花冠のエルフィ',sprite:9,hp:165,boss:true,phase:'散らない花',pattern:[A(12),D(18),M(8,'weak',2),A(6,3),B(2)]},
    bossOwl:{name:'月守りのセレネ',sprite:10,hp:240,boss:true,phase:'満ちる月',pattern:[M(10,'dazed',2),A(8,2),D(24),A(26),B(3)]},
    bossDragon:{name:'夜明けを隠す竜',sprite:11,hp:330,boss:true,phase:'最後の星夜',pattern:[A(9,2),M(12,'vulnerable',2),D(28),A(10,3),B(4)]}
  };
  const acts=[
    {name:'こもれびの森',en:'THE WHISPERING WOODS',boss:'bossRose',theme:'forest',line:'花灯りが、道しるべ。',normal:[['slime'],['shroom'],['bat','slime'],['ghost'],['nut'],['shroom','bat']],elite:['eliteNut','eliteGhost']},
    {name:'月鏡の庭',en:'THE MOONLIT GARDEN',boss:'bossOwl',theme:'moon',line:'眠る星たちの、その先へ。',normal:[['slime2','shroom2'],['ghost2','bat2'],['nut2'],['dragon'],['shroom2','bat2']],elite:['eliteGhost','eliteDragon']},
    {name:'星咲きの塔',en:'THE BLOOMING SPIRE',boss:'bossDragon',theme:'spire',line:'夜明けを、もう一度。',normal:[['dragon2','slime2'],['nut2','bat2'],['ghost2','shroom2'],['dragon2','bat2']],elite:['eliteDragon','eliteNut']}
  ];
  const potions={
    heal:{name:'いちごの薬',icon:'heart',desc:'HPを20回復。',color:'#f19da8'},
    energy:{name:'星くずソーダ',icon:'energy',desc:'このターン、エナジーを2得る。',color:'#ebd893'},
    shield:{name:'まもりの露',icon:'shield',desc:'ブロックを15得る。',color:'#8acfe6'},
    fire:{name:'はじける花蜜',icon:'flame',desc:'すべての敵に20ダメージ。',color:'#eab38f'}
  };
  const events=[
    {id:'spring',title:'月映りの泉',icon:'moon',text:'枝葉のすきまから差す月明かり。小さな泉が、あなたの傷をそっと照らしている。',options:[{label:'泉の水を飲む',detail:'最大HPの25%を回復',effect:'heal',value:.25},{label:'水底の宝物を拾う',detail:'レリックを1個獲得。「迷いの霧」を1枚得る',effect:'cursedRelic'},{label:'静かに立ち去る',detail:'何も起きない',effect:'leave'}]},
    {id:'merchant',title:'迷子の配達屋さん',icon:'feather',text:'大きな荷物を抱えた小鳥が困っている。「この先の道、ひとりじゃ怖くて…」',options:[{label:'荷物を運んであげる',detail:'HPを8失い、65ゴールドを得る',effect:'labor',value:8},{label:'おやつを分けてあげる',detail:'25ゴールドを払い、最大HPが6増える',effect:'feed',cost:25},{label:'道を教えてあげる',detail:'何も起きない',effect:'leave'}]},
    {id:'library',title:'木のうろの図書館',icon:'book',text:'妖精サイズの本棚が、幹の内側にぎっしり。ひときわ輝く一冊が、あなたを呼んでいる。',options:[{label:'星の物語を読む',detail:'ランダムなカード2枚を強化',effect:'upgrade',value:2},{label:'古い呪文を忘れる',detail:'デッキからカードを1枚削除',effect:'remove'},{label:'本を閉じる',detail:'何も起きない',effect:'leave'}]},
    {id:'flower',title:'ねがいの花',icon:'flower',text:'一輪だけ咲いた、金色の小さな花。「ひとつだけ、旅のねがいを聞かせて」',options:[{label:'もっと強くなりたい',detail:'HPを10失い、レアカードを1枚得る',effect:'rare',value:10},{label:'元気に旅を続けたい',detail:'最大HPが5増え、HPを5回復',effect:'maxHP',value:5}]},
    {id:'tea',title:'真夜中のお茶会',icon:'cup',text:'切り株のテーブルに、温かいお茶とふわふわのケーキ。誰かがあなたを待っていたようだ。',options:[{label:'お茶を一杯いただく',detail:'HPを12回復',effect:'healFlat',value:12},{label:'ケーキを買う',detail:'40ゴールドを払い、最大HPが10増える',effect:'cake',cost:40}]},
    {id:'mirror',title:'星の交換所',icon:'star',text:'狐の商人が、きらきらした品物を広げている。「思い出ひとつで、未来は変わるよ」',options:[{label:'カードを手放す',detail:'30ゴールドを払い、カードを1枚削除',effect:'remove',cost:30},{label:'星のお守りを買う',detail:'70ゴールドを払い、レリックを1個得る',effect:'buyRelic',cost:70},{label:'またの機会に',detail:'何も起きない',effect:'leave'}]},
    {id:'moth',title:'道案内のほたる',icon:'star',text:'一匹のほたるが、あなたの周りをくるくる回る。光の先には、まだ見ぬ小道がある。',options:[{label:'光を追いかける',detail:'ポーションを1個獲得。枠がいっぱいなら35ゴールド',effect:'potion'},{label:'ここでひと休み',detail:'HPを8回復',effect:'healFlat',value:8}]},
    {id:'bell',title:'約束の鐘',icon:'bell',text:'苔むした鐘が、遠い昔の歌を覚えている。小さな勇気を込めて、鳴らしてみようか。',options:[{label:'鐘を鳴らす',detail:'HPを12失い、レリックを1個得る',effect:'sacrifice',value:12},{label:'花を供える',detail:'25ゴールドを得る',effect:'gold',value:25}]}
  ];
  const statusLabels={bloom:['開花','攻撃ダメージが数値分増える。'],strength:['筋力','攻撃ダメージが数値分増える。'],dexterity:['敏捷性','カードのブロックが数値分増える。'],poison:['毒','行動前にブロックを無視してダメージ。その後1減る。'],frost:['氷結','各攻撃のダメージが数値分減る。行動後1減る。'],weak:['脱力','攻撃ダメージが25%減る。ターン経過で1減る。'],vulnerable:['無防備','攻撃で受けるダメージが50%増える。ターン経過で1減る。'],thorns:['トゲ','攻撃してきた敵に、数値分のダメージ。'],regen:['再生','ターン終了時にHPを回復。その後1減る。'],bloomTurn:['芽吹き','毎ターン、開花を得る。'],drawTurn:['星よみ','毎ターン、追加でカードを引く。'],energyTurn:['調合炉','毎ターン、追加エナジーを得る。'],blockTurn:['月の加護','毎ターン、ブロックを得る。'],poisonTurn:['森の薬学','毎ターン、すべての敵に毒を与える。'],preserveBlock:['とこしえ','ターン開始時にブロックが消えない。']};
  const basicNames={knight:{strike:'花びらの一閃',guard:'花結びの盾'},witch:{strike:'星弾のひと振り',guard:'月光の結界'},alchemist:{strike:'はじける小瓶',guard:'薬草の護り'},dragoon:{strike:'竜槍の突き',guard:'竜鱗の盾'},ranger:{strike:'銀月の双牙',guard:'影の構え'}};
  function getCard(instance,hero){
    const base=cards[typeof instance==='string'?instance:instance.id];if(!base)return null;
    const up=!!instance.upgraded,effects={...base.effects,...(up?base.upgrade:{})},cost=effects.cost??base.cost;delete effects.cost;
    const visualHero=hero||instance.visualHero;
    const name=basicNames[visualHero]?.[base.id]||base.name;
    return {...base,effects,cost,upgraded:up,visualHero,name:name+(up?'＋':'')};
  }

  function describe(instance){const c=getCard(instance);const e=c.effects;const t=[];
    if(e.damage)t.push(`${e.aoe?'敵全体に':''}${e.damage}${e.hits?`×${e.hits}`:''}ダメージ。`);
    if(e.bloomScale)t.push(`開花1につき＋${e.bloomScale}ダメージ。`);
    if(e.frostScale)t.push(`敵の氷結1につき＋${e.frostScale}ダメージ。`);
    if(e.poisonScale)t.push(`敵の毒1につき＋${e.poisonScale}ダメージ。`);
    if(e.heatScale)t.push(`灼熱1につき追加で＋${e.heatScale}ダメージ。`);
    if(e.comboScale)t.push(`連携1につき＋${e.comboScale}ダメージ。`);
    if(e.heat)t.push(`灼熱${e.heat}。`);
    if(e.heatTurn)t.push(`毎ターン、灼熱＋${e.heatTurn}。`);
    if(e.comboBlock)t.push(`連携1につき＋${e.comboBlock}ブロック。`);
    if(e.block)t.push(`${e.block}ブロック。`);
    if(e.bloomBlock)t.push(`開花1につき＋${e.bloomBlock}ブロック。`);
    if(e.bloom)t.push(`開花${e.bloom}。`);
    for(const k of ['poison','frost','weak','vulnerable'])if(e[k])t.push(`${e.aoe&&!e.damage?'敵全体に':''}${statusLabels[k][0]}${e[k]}。`);
    if(e.poisonMultiply)t.push(`敵の毒を${e.poisonMultiply}倍に。`);
    if(e.draw)t.push(`${e.draw}枚引く。`);
    if(e.energy)t.push(`エナジー＋${e.energy}。`);
    if(e.heal)t.push(`HPを${e.heal}回復。`);
    for(const k of ['strength','dexterity','thorns','regen'])if(e[k])t.push(`${statusLabels[k][0]}${e[k]}。`);
    for(const [k,label] of [['bloomTurn','開花'],['blockTurn','ブロック'],['poisonTurn','敵全体に毒'],['energyTurn','エナジー']])if(e[k])t.push(`毎ターン、${label}＋${e[k]}。`);
    if(e.drawTurn)t.push(`毎ターン、追加で${e.drawTurn}枚引く。`);
    if(e.preserveBlock)t.push('ターン開始時にブロックを保持。');
    if(c.type==='curse'||c.type==='status')t.push(c.note);
    if(e.exhaust)t.push('廃棄。');return t.join(' ');
  }
  statusLabels.heat=['灼熱','攻撃の各ヒットに数値分のダメージを加える。アタックを使うと1減る。'];
  statusLabels.heatTurn=['竜の灯火','毎ターン、灼熱を得る。'];
  statusLabels.combo=['連携','このターン、すでに使ったカードの枚数。連携を持つ技の威力が上がる。'];
  const data={cards,basicNames,heroes,relics,enemies,acts,potions,events,statusLabels,getCard,describe};
  if(typeof module!=='undefined'&&module.exports)module.exports=data;else root.BloomData=data;
})(typeof window!=='undefined'?window:globalThis);
