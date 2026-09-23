const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=fs.existsSync(require('node:path').join(__dirname,'../dist/engine.js'))?'../dist/':'../';
const Engine=require(base+'engine.js');
const D=require(base+'data.js');
function battle(hero='knight',seed='test'){const e=new Engine();e.newRun(hero,'adventure',seed);e.chooseNode(e.availableNodes()[0].id);e.takeFx();return e;}
function hand(e,ids){e.s.battle.hand=ids.map(id=>({id,uid:e.uid(),upgraded:false}));e.s.battle.energy=10;return e.s.battle.hand;}
test('same seed and saved RNG produce the same journey and combat',()=>{
  const a=battle('witch','MOON-2026'),b=new Engine(a.serialize());
  assert.deepEqual(a.s,b.s);
  for(let i=0;i<4;i++){a.endTurn();b.endTurn();assert.deepEqual(a.s,b.s);if(a.s.screen!=='battle')break;}
});
test('invalid card target and insufficient energy have no side effects',()=>{
  const e=battle();const [c]=hand(e,['strike']);let before=e.serialize();assert.throws(()=>e.play(c.uid,'not-an-enemy'));assert.equal(e.serialize(),before);
  e.s.battle.energy=0;before=e.serialize();assert.throws(()=>e.play(c.uid,'enemy0'));assert.equal(e.serialize(),before);
});
test('every map path remains connected to the boss, and inaccessible nodes are rejected',()=>{
  const e=new Engine();e.newRun('knight','adventure','MAP');e.s.row=0;e.s.lane=0;
  const unreachable=e.s.map[1][2];assert.throws(()=>e.chooseNode(unreachable.id));assert.equal(e.s.row,0);
  for(const row of e.s.map.slice(0,-1))for(const n of row){assert.ok(n.links.length);for(const lane of n.links)assert.ok(e.s.map[n.row+1].some(x=>x.lane===lane));}
  assert.equal(e.s.map[11][0].kind,'boss');
});
test('block absorbs damage and resets next turn; evergreen preserves it',()=>{
  const e=battle(),b=e.s.battle;b.enemies[0].id='slime';b.enemies[0].poison=0;b.enemies[0].frost=0;
  let [c]=hand(e,['fortress']);e.play(c.uid);const hp=e.s.hp;assert.equal(b.block,18);e.endTurn();assert.equal(e.s.hp,hp);assert.equal(b.block,0);
  [c]=hand(e,['evergreen']);e.play(c.uid);b.block=19;b.enemies[0].turn=1;e.endTurn();assert.equal(b.block,19);
});
test('poison bypasses block, ticks before the enemy action, and decays',()=>{
  const e=battle('alchemist'),b=e.s.battle,enemy=b.enemies[0];enemy.block=100;enemy.poison=7;enemy.hp=6;const hp=e.s.hp;
  e.endTurn();assert.equal(enemy.hp,0);assert.equal(e.s.screen,'reward');assert.equal(e.s.hp,hp);assert.equal(enemy.poison,6);
});
test('frost and weak reduce each advertised hit, and the actual attack matches',()=>{
  const e=battle('witch'),b=e.s.battle,enemy=b.enemies[0];enemy.id='bat';enemy.turn=0;enemy.frost=2;enemy.weak=2;enemy.poison=0;enemy.strength=0;b.p={};b.block=0;
  const intent=e.intent(enemy);assert.equal(intent.damage,1);assert.equal(intent.hits,2);const hp=e.s.hp;e.endTurn();assert.equal(e.s.hp,hp-2);assert.equal(enemy.frost,1);
});
test('bloom and status-scaling damage are computed correctly and power leaves the cycle',()=>{
  const e=battle(),b=e.s.battle;const enemy=b.enemies[0];enemy.hp=1000;enemy.maxHP=1000;
  const [power,cut]=hand(e,['resolve','flourish']);e.play(power.uid);assert.equal(b.p.strength,2);assert.ok(b.exhaust.some(c=>c.uid===power.uid));
  assert.equal(e.damageFor(cut,enemy),18);e.play(cut.uid,enemy.uid);assert.equal(enemy.hp,982);
});
test('draw reshuffles discard, exhaust is excluded, and hand is capped at ten',()=>{
  const e=battle(),b=e.s.battle;hand(e,['guard']);b.draw=[];b.discard=Array.from({length:15},()=>({id:'strike',uid:e.uid(),upgraded:false}));b.exhaust=[{id:'wisdom',uid:e.uid(),upgraded:false}];e.drawCards(20);assert.equal(b.hand.length,10);assert.equal(b.draw.length,6);assert.ok(!b.hand.some(c=>c.id==='wisdom'));
});
test('rewards are claimed once, duplicate relics never stack, and the next room is unlocked',()=>{
  const e=battle();e.s.battle.enemies.forEach(n=>n.hp=0);e.checkEnd();const count=e.s.deck.length;const c=e.s.reward.cards[0];e.selectReward(c.uid);assert.equal(e.s.deck.length,count+1);assert.throws(()=>e.selectReward(c.uid));
  e.addRelic('cookie');const max=e.s.maxHP;e.addRelic('cookie');assert.equal(e.s.maxHP,max);e.finishReward();assert.equal(e.s.screen,'map');assert.ok(e.availableNodes().length);
});
test('shop purchases are atomic, cannot buy sold stock, and removal spends exactly once',()=>{
  const e=battle();e.s.screen='shop';e.makeShop();e.s.gold=0;const before=e.serialize();assert.throws(()=>e.buy('cards',0));assert.equal(e.serialize(),before);e.s.gold=500;const price=e.s.room.cards[0].price;e.buy('cards',0);assert.equal(e.s.gold,500-price);assert.throws(()=>e.buy('cards',0));const uid=e.s.deck[0].uid;e.removeCard(uid);assert.equal(e.s.gold,435-price);assert.throws(()=>e.removeCard(e.s.deck[0].uid));
});
test('potions obey capacity and battle-only restrictions without consuming failed uses',()=>{
  const e=battle();e.s.screen='map';e.s.potions=['fire'];assert.throws(()=>e.usePotion(0));assert.equal(e.s.potions.length,1);e.s.potions=['heal'];e.s.hp=e.s.maxHP;assert.throws(()=>e.usePotion(0));assert.equal(e.s.potions.length,1);e.s.hp-=25;e.usePotion(0);assert.equal(e.s.hp,e.s.maxHP-5);assert.equal(e.s.potions.length,0);
});
test('all event options resolve without dead ends, including an interrupted removal flow',()=>{
  for(const event of D.events)for(let i=0;i<event.options.length;i++){
    const e=battle();e.s.screen='event';e.s.room={event:event.id,done:false};e.s.gold=999;e.eventChoice(i);
    if(e.s.room.removing){const loaded=new Engine(e.serialize());loaded.removeCard(loaded.s.deck[0].uid);assert.equal(loaded.s.room.done,true);}else assert.equal(e.s.room.done,true);
    assert.ok(e.s.hp>0);assert.ok(e.s.gold>=0);
  }
});
test('upgrading preserves card identity and generated status cards never enter the permanent deck',()=>{
  const e=battle();const uid=e.s.deck[0].uid;e.s.screen='rest';e.upgradeCard(uid);assert.equal(e.s.deck[0].uid,uid);assert.equal(e.s.deck[0].upgraded,true);assert.equal(e.s.screen,'map');e.startBattle('battle');e.s.battle.enemies[0].id='eliteGhost';e.s.battle.enemies[0].turn=0;e.endTurn();assert.ok(e.s.battle.discard.some(c=>c.id==='dazed')||e.s.battle.hand.some(c=>c.id==='dazed'));assert.ok(e.s.deck.every(c=>c.id!=='dazed'));
});
test('boss victories advance all chapters and the third boss completes the run',()=>{
  const e=new Engine();e.newRun('alchemist','adventure','BOSS');
  for(let i=0;i<3;i++){e.s.row=11;e.startBattle('boss');e.s.battle.enemies.forEach(n=>n.hp=0);e.checkEnd();if(i<2){assert.equal(e.s.screen,'reward');e.finishReward();assert.equal(e.s.screen,'bossReward');e.chooseBossRelic(e.s.room.relics[0]);assert.equal(e.s.act,i+1);assert.equal(e.s.row,-1);}else{assert.equal(e.s.screen,'result');assert.equal(e.s.won,true);}}
});
test('a defeated hero cannot win even when thorns defeat the final enemy',()=>{
  const e=battle();e.s.hp=1;e.s.battle.enemies[0].hp=1;e.s.battle.enemies[0].poison=0;e.s.battle.enemies[0].frost=0;e.s.battle.enemies[0].id='slime';e.s.battle.p.thorns=5;e.endTurn();assert.equal(e.s.screen,'result');assert.equal(e.s.won,false);
});
test('every collectible card resolves validly, including upgrades and all hero mechanics',()=>{
  for(const id of Object.keys(D.cards))for(const upgraded of [false,true]){
    if(['curse','status'].includes(D.cards[id].type))continue;
    const hero=D.cards[id].hero==='all'?'knight':D.cards[id].hero;
    const e=battle(hero);e.s.hp=20;e.s.battle.energy=99;const c={id,uid:e.uid(),upgraded};e.s.battle.hand=[c];const enemy=e.s.battle.enemies[0];enemy.hp=9999;enemy.maxHP=9999;enemy.poison=4;enemy.frost=3;e.play(c.uid,enemy.uid);
    assert.ok(Number.isFinite(e.s.hp),id);assert.ok(Number.isFinite(enemy.hp),id);assert.ok(Number.isFinite(e.s.battle.block),id);assert.ok(e.s.hp<=e.s.maxHP,id);assert.ok(D.describe(c).length>0,id);
  }
});

test('five heroes each have three distinct ultimate cards, and the selected one opens battle',()=>{
  assert.equal(Object.keys(D.heroes).length,5);const effects=new Set();
  for(const h of Object.values(D.heroes)){
    assert.equal(h.ultimates.length,3);
    for(const id of h.ultimates){
      const e=new Engine();e.newRun(h.id,'adventure','SIGNATURE',id);assert.equal(e.s.deck.length,10);
      e.chooseNode(e.availableNodes()[0].id);const c=e.s.battle.hand.find(c=>c.id===id);assert.ok(c,id);
      assert.equal(D.cards[id].hero,h.id);assert.ok(D.cards[id].ultimate);effects.add(D.cards[id].ultimate.fx);
      e.s.battle.energy=10;e.s.battle.enemies[0].hp=500;e.s.battle.enemies[0].maxHP=500;e.takeFx();
      e.play(c.uid,e.s.battle.enemies[0].uid);const fx=e.takeFx();
      assert.equal(fx.filter(f=>f.type==='card'&&f.ultimate).length,1,id);
      assert.equal(fx[0].cardId,id);assert.ok(e.s.battle.exhaust.some(x=>x.uid===c.uid),id);
      assert.throws(()=>e.play(c.uid,'enemy0'));assert.deepEqual(e.takeFx(),[]);
      assert.deepEqual(new Engine(e.serialize()).s,e.s);
    }
  }
  assert.equal(effects.size,15);
});
test('invalid signatures and failed ultimates preserve state and emit no animation',()=>{
  const e=battle();const before=e.serialize();assert.throws(()=>e.newRun('knight','adventure','BAD','sunfall'));assert.equal(e.serialize(),before);
  const [c]=hand(e,['roseoath']);e.s.battle.energy=0;e.takeFx();const zero=e.serialize();assert.throws(()=>e.play(c.uid,'enemy0'));assert.equal(e.serialize(),zero);assert.deepEqual(e.takeFx(),[]);
});
test('heat applies to every hit and decays once per attack, while combo counts preceding cards',()=>{
  const e=battle('dragoon'),b=e.s.battle,enemy=b.enemies[0];enemy.hp=500;enemy.maxHP=500;
  assert.equal(b.p.heat,4);const [c]=hand(e,['dragonfang']);assert.equal(e.damageFor(c,enemy),11);e.play(c.uid,enemy.uid);assert.equal(enemy.hp,478);assert.equal(b.p.heat,3);
  const n=battle('ranger'),nb=n.s.battle,ne=nb.enemies[0];ne.hp=500;ne.maxHP=500;const [a,cut,second]=hand(n,['feint','crossmoon','twinfang']);
  n.play(a.uid);assert.equal(nb.played,1);assert.equal(n.damageFor(cut,ne),10);n.play(cut.uid,ne.uid);assert.equal(ne.hp,480);assert.equal(nb.block,6);assert.equal(nb.p.combo,2);
  n.play(second.uid,ne.uid);assert.equal(nb.block,6);n.endTurn();assert.equal(nb.p.combo,0);assert.equal(nb.played,0);
});
test('pre-expansion saves load without injecting cards or changing ongoing battles',()=>{
  const e=battle();delete e.s.signature;e.s.deck=e.s.deck.filter(c=>!D.cards[c.id].ultimate);e.s.battle.hand=e.s.battle.hand.filter(c=>!D.cards[c.id].ultimate);
  const old=e.serialize(),loaded=new Engine(old);assert.equal(loaded.serialize(),old);loaded.endTurn();assert.ok(['battle','reward','result'].includes(loaded.s.screen));
});
test('hit events retain intermediate HP values for sequential playback and lethal resolution is atomic',()=>{
  const e=battle('ranger'),b=e.s.battle;b.enemies[0].hp=13;b.enemies[0].maxHP=20;const [c]=hand(e,['crossmoon']);e.takeFx();e.play(c.uid,'enemy0');
  const fx=e.takeFx(),hits=fx.filter(f=>f.type==='damage'&&f.target==='enemy0');assert.deepEqual(hits.map(f=>f.hp),[5,0]);assert.equal(e.s.screen,'reward');assert.equal(e.s.stats.battles,1);const gold=e.s.gold;assert.throws(()=>e.play(c.uid,'enemy0'));assert.equal(e.s.gold,gold);
});

test('basic cards show each hero identity without changing saved card IDs or battle rules',()=>{
  const strikeNames=new Set(),guardNames=new Set();
  for(const hero of Object.keys(D.heroes)){
    for(const id of ['strike','guard']){
      const instance={id,uid:77,upgraded:false},before=JSON.stringify(instance);
      const c=D.getCard(instance,hero),up=D.getCard({...instance,upgraded:true},hero);
      (id==='strike'?strikeNames:guardNames).add(c.name);
      assert.equal(c.id,id);assert.equal(up.name,c.name+'＋');
      assert.deepEqual(c.effects,D.getCard(id).effects);assert.equal(JSON.stringify(instance),before);
    }
    const e=battle(hero),[c]=hand(e,['strike']);e.takeFx();e.play(c.uid,e.s.battle.enemies[0].uid);
    assert.equal(e.takeFx()[0].label,D.getCard(c,hero).name);
  }
  assert.equal(strikeNames.size,5);assert.equal(guardNames.size,5);
});

test('all 100 card illustrations have independent atlas cells and shipped PNG assets',()=>{
  const Art=require(base+'card-art.js'),path=require('node:path'),cells=new Set();
  for(const [id,c] of Object.entries(D.cards)){
    const heroes=['strike','guard'].includes(id)?Object.keys(D.heroes):[c.hero==='all'?'knight':c.hero];
    for(const hero of heroes){
      const art=Art.get(id,hero),cell=art.src+':'+art.index;
      assert.ok(art.index>=0&&art.index<20,id);assert.ok(!cells.has(cell),cell);cells.add(cell);
      const png=fs.readFileSync(path.resolve(__dirname,base,art.src));
      assert.equal(png.subarray(1,4).toString(),'PNG');
      assert.ok(png.readUInt32BE(16)>=1500,art.src);
    }
  }
  assert.equal(cells.size,100);
});
