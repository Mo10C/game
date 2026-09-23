(function (root) {
  'use strict';
  const D = typeof module !== 'undefined' && module.exports ? require('./data.js') : root.BloomData;
  const clone = value => JSON.parse(JSON.stringify(value));
  const DIFFICULTIES = {picnic:{name:'おさんぽ',hp:1.15,enemyHP:.85,damage:.85,gold:1.15},adventure:{name:'冒険',hp:1,enemyHP:1,damage:1,gold:1},moonlight:{name:'月夜の試練',hp:1,enemyHP:1.35,damage:1.35,gold:1}};
  class Engine {
    constructor(saved) { this.s = null; this.fx = []; if (saved) this.load(saved); }
    load(saved) {
      const s = typeof saved === 'string' ? JSON.parse(saved) : clone(saved);
      if (!s || s.version !== 1 || !D.heroes[s.hero] || !DIFFICULTIES[s.difficulty] || !Array.isArray(s.deck) || !s.deck.every(c=>D.cards[c.id]) || !Number.isFinite(s.hp) || !Array.isArray(s.map)) throw new Error('この冒険の記録は読み込めません。');
      const validCard=c=>c&&Object.hasOwn(D.cards,c.id)&&Number.isSafeInteger(c.uid)&&typeof c.upgraded==='boolean';
      const finite=n=>typeof n==='number'&&Number.isFinite(n);
      if(!Number.isInteger(s.act)||s.act<0||s.act>2||!Number.isInteger(s.row)||s.row< -1||s.row>11||!finite(s.maxHP)||s.maxHP<=0||s.hp<0||s.hp>s.maxHP||!finite(s.gold)||s.gold<0||!Number.isSafeInteger(s.serial)||!finite(s.rng)||!finite(s.startedAt)||!s.stats||!['battles','elites','turns','cards','damage','floors'].every(k=>finite(s.stats[k]))||!s.deck.length||!s.deck.every(validCard)||!Array.isArray(s.relics)||!s.relics.every(id=>Object.hasOwn(D.relics,id))||!Array.isArray(s.potions)||s.potions.length>3||!s.potions.every(id=>Object.hasOwn(D.potions,id))||s.map.length!==12||!s.map.every(row=>Array.isArray(row)&&row.every(n=>n&&['battle','elite','boss','rest','event','shop','treasure'].includes(n.kind)&&Array.isArray(n.links)))||!Array.isArray(s.path))throw new Error('冒険の記録に読み込めない項目があります。');
      if(!['map','battle','reward','rest','shop','event','treasure','bossReward','result'].includes(s.screen))throw new Error('冒険の記録が壊れています。');
      if(s.screen==='battle'&&(!s.battle||!Array.isArray(s.battle.hand)||!Array.isArray(s.battle.enemies)))throw new Error('戦闘の記録が壊れています。');
      if(s.screen==='battle'&&(!['hand','draw','discard','exhaust'].every(k=>Array.isArray(s.battle[k])&&s.battle[k].every(validCard))||!s.battle.enemies.every(e=>Object.hasOwn(D.enemies,e.id)&&finite(e.hp)&&finite(e.maxHP)&&finite(e.block))||!s.battle.p||!finite(s.battle.energy)||!Array.isArray(s.battle.log)))throw new Error('戦闘の記録が壊れています。');
      if(s.screen==='event'&&(!s.room||!D.events.some(e=>e.id===s.room.event)))throw new Error('できごとの記録が壊れています。');
      if(s.screen==='reward'&&(!s.reward||!Array.isArray(s.reward.cards)||!s.reward.cards.every(validCard)||(s.reward.relic&&!Object.hasOwn(D.relics,s.reward.relic))||(s.reward.potion&&!Object.hasOwn(D.potions,s.reward.potion))))throw new Error('報酬の記録が壊れています。');
      if(s.screen==='shop'&&(!s.room||!['cards','relics','potions'].every(k=>Array.isArray(s.room[k]))||!s.room.cards.every(validCard)||!s.room.relics.every(r=>Object.hasOwn(D.relics,r.id))||!s.room.potions.every(p=>Object.hasOwn(D.potions,p.id))))throw new Error('ショップの記録が壊れています。');
      if(s.screen==='bossReward'&&(!s.room||!Array.isArray(s.room.relics)||!s.room.relics.every(id=>Object.hasOwn(D.relics,id))))throw new Error('宝物の記録が壊れています。');
      if(s.screen==='treasure'&&(!s.room||(s.room.relic&&!Object.hasOwn(D.relics,s.room.relic))))throw new Error('宝箱の記録が壊れています。');
      this.s=s;this.fx=[];return this.s;
    }
    serialize() { return JSON.stringify(this.s); }
    random() { let x = this.s.rng|0; x ^= x<<13; x ^= x>>>17; x ^= x<<5; this.s.rng = x>>>0; return (x>>>0)/4294967296; }
    pick(list) { return list[Math.floor(this.random()*list.length)]; }
    shuffle(list) { const a=list.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(this.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
    uid() { return ++this.s.serial; }
    has(id) { return this.s.relics.includes(id); }
    expect(screen) { if(this.s?.screen!==screen)throw new Error('この画面では使えません。'); }
    emit(type, target, value, label, extra={}) { this.fx.push({type,target,value,label,...extra}); }
    takeFx() { const e=this.fx; this.fx=[]; return e; }
    log(text) { if(this.s.battle){this.s.battle.log.push(text);this.s.battle.log=this.s.battle.log.slice(-30);} }
    newRun(hero='knight',difficulty='adventure',seed,signature) {
      if(!D.heroes[hero]||!DIFFICULTIES[difficulty])throw new Error('冒険者を選んでください。');
      signature=signature||D.heroes[hero].ultimates[0];
      if(!D.heroes[hero].ultimates.includes(signature))throw new Error('この冒険者の必殺技を選んでください。');
      let seedText=String(seed||Math.random().toString(36).slice(2,10)).slice(0,32);let hash=2166136261;for(const c of seedText)hash=Math.imul(hash^c.charCodeAt(0),16777619);
      const maxHP=Math.round(D.heroes[hero].hp*DIFFICULTIES[difficulty].hp);
      this.s={version:1,hero,difficulty,seed:seedText,rng:hash>>>0||1,serial:0,screen:'map',act:0,row:-1,lane:1,map:[],path:[],hp:maxHP,maxHP,gold:99,deck:[],relics:[D.heroes[hero].relic],potions:['heal'],battle:null,reward:null,room:null,startedAt:Date.now(),stats:{battles:0,elites:0,turns:0,cards:0,damage:0,floors:0},won:false};
      this.s.signature=signature;
      for(let i=0;i<4;i++)this.addCard('strike');for(let i=0;i<3;i++)this.addCard('guard');this.addCard(D.heroes[hero].starter);this.addCard(D.heroes[hero].starter);this.addCard(signature);
      this.s.map=this.makeMap();this.fx=[];return this.s;
    }
    addCard(id,upgraded=false) { if(!D.cards[id])throw new Error('カードが見つかりません。');const c={uid:this.uid(),id,upgraded};this.s.deck.push(c);return c; }
    makeMap() {
      const rows=[];for(let row=0;row<12;row++){
        const lanes=row===11?[1]:[0,1,2];rows.push(lanes.map(lane=>{
          let kind='battle';if(row===11)kind='boss';else if(row===10)kind='rest';else if(row===5)kind='treasure';else if(row>0){const roll=this.random();kind=roll<.43?'battle':roll<.64?'event':roll<.77?'shop':roll<.9?'rest':'elite';if(row>=3&&lane===1&&[3,8].includes(row))kind='elite';}
          return {id:`${this.s.act}-${row}-${lane}`,row,lane,kind,visited:false,links:row===11?[]:row===10?[1]:[0,1,2].filter(l=>Math.abs(l-lane)<=1)};
        }));
      }return rows;
    }
    availableNodes() { if(this.s.screen!=='map')return [];const next=this.s.map[this.s.row+1]||[];if(this.s.row<0)return next;const node=this.s.map[this.s.row].find(n=>n.lane===this.s.lane);return next.filter(n=>node.links.includes(n.lane)); }
    chooseNode(id) {
      this.expect('map');const n=this.availableNodes().find(n=>n.id===id);if(!n)throw new Error('つながっている道を選んでください。');
      n.visited=true;this.s.row=n.row;this.s.lane=n.lane;this.s.path.push(n.id);this.s.stats.floors++;this.s.room=null;
      if(['battle','elite','boss'].includes(n.kind))this.startBattle(n.kind);
      else {this.s.screen=n.kind; if(n.kind==='shop')this.makeShop();if(n.kind==='event')this.s.room={event:this.pick(D.events).id,done:false};if(n.kind==='treasure')this.s.room={relic:this.rollRelics(1)[0],gold:20};}
      return n;
    }
    cardPool(rarity) {return Object.values(D.cards).filter(c=>(c.hero==='all'||c.hero===this.s.hero)&&!['basic','curse','status'].includes(c.rarity)&&(!rarity||c.rarity===rarity));}
    rollCards(count=3,rareBonus=false) {
      const result=[];for(let i=0;i<count;i++){const p=this.random();const rarity=rareBonus?(p<.38?'rare':'uncommon'):(p<.10?'rare':p<.4?'uncommon':'common');let pool=this.cardPool(rarity).filter(c=>!result.some(r=>r.id===c.id));if(!pool.length)pool=this.cardPool().filter(c=>!result.some(r=>r.id===c.id));result.push({id:this.pick(pool).id,upgraded:this.s.act>0&&this.random()<.16,uid:this.uid()});}return result;
    }
    rollRelics(count=1,boss=false) { const pool=Object.keys(D.relics).filter(id=>!D.relics[id].starter&&!this.has(id)&&(boss?D.relics[id].boss:!D.relics[id].boss));return this.shuffle(pool).slice(0,count); }
    addRelic(id) {if(!id||this.has(id))return false;this.s.relics.push(id);if(id==='cookie'){this.s.maxHP+=12;this.heal(12);}return true;}
    heal(n) {const amount=Math.min(n,this.s.maxHP-this.s.hp);this.s.hp+=amount;if(amount>0)this.emit('heal','player',amount);return amount;}
    createEnemy(id,index,kind) {
      const t=D.enemies[id];const scale=DIFFICULTIES[this.s.difficulty].enemyHP;const extra=t.elite?1+this.s.act*.22:t.boss?1:1+this.s.act*.08;
      const maxHP=Math.round(t.hp*scale*extra);return {id,uid:`enemy${index}`,name:t.name,sprite:t.sprite,hp:maxHP,maxHP,block:0,strength:0,poison:0,frost:0,weak:0,vulnerable:0,turn:0,enraged:false,boss:!!t.boss,elite:!!t.elite};
    }
    startBattle(kind) {
      const a=D.acts[this.s.act];let ids;
      if(kind==='boss')ids=[a.boss];else if(kind==='elite')ids=[this.pick(a.elite)];else if(this.s.act===0&&this.s.row===0)ids=[this.pick(['slime','shroom'])];else ids=this.pick(a.normal);
      this.s.screen='battle';this.s.battle={kind,turn:0,energy:0,maxEnergy:3,block:0,p:{},hand:[],draw:this.shuffle(clone(this.s.deck)),discard:[],exhaust:[],enemies:ids.map((id,i)=>this.createEnemy(id,i,kind)),firstBlock:true,log:[],attacksPlayed:0,played:0};
      const b=this.s.battle;
      // The chosen signature opens each battle, provided it is still in the deck.
      const signatureIndex=b.draw.findIndex(c=>c.id===this.s.signature);
      if(signatureIndex>=0)b.draw.push(b.draw.splice(signatureIndex,1)[0]);
      if(this.has('dragonscale'))b.p.heat=3;
      if(this.has('ribbon'))b.p.bloom=1;if(this.has('thorn'))b.p.thorns=3;if(this.has('sword'))b.p.strength=2;if(this.has('boots'))b.p.dexterity=2;if(this.has('seed'))b.p.bloomTurn=1;if(this.has('pearl'))b.p.regen=5;
      for(const e of b.enemies){if(this.has('moonstone'))e.frost+=2;if(this.has('vial'))e.poison+=2;if(this.has('crystal'))e.frost+=3;if(this.has('mask'))e.poison+=3;if(this.has('hourglass'))e.weak+=2;}
      this.startTurn();if(this.has('shell'))b.block+=10;this.log('花灯りが、あなたを見守っている。');
    }
    drawCards(n) {const b=this.s.battle;for(let i=0;i<n;i++){if(b.hand.length>=10)break;if(!b.draw.length){if(!b.discard.length)break;b.draw=this.shuffle(b.discard);b.discard=[];this.emit('shuffle','player',0);this.log('捨て札をシャッフルして山札に戻した。');}b.hand.push(b.draw.pop());}}
    startTurn() {
      const b=this.s.battle;b.turn++;this.s.stats.turns++;b.firstBlock=true;b.played=0;b.attacksPlayed=0;
      if(this.s.hero==='ranger')b.p.combo=0;
      if(b.p.heatTurn||this.has('dragonscale'))b.p.heat=(b.p.heat||0)+(b.p.heatTurn||0)+(this.has('dragonscale')?1:0);
      if(!b.p.preserveBlock)b.block=0;
      b.maxEnergy=3+(this.has('lantern')?1:0)+(b.p.energyTurn||0);b.energy=b.maxEnergy+(b.turn===1&&this.has('bell')?1:0);
      if(b.p.bloomTurn)b.p.bloom=(b.p.bloom||0)+b.p.bloomTurn;
      if(this.has('crown'))b.p.strength=(b.p.strength||0)+1;
      b.block+=(b.p.blockTurn||0)+(this.has('mirror')?6:0);
      if(b.p.poisonTurn)for(const e of b.enemies)if(e.hp>0)e.poison+=b.p.poisonTurn;
      this.drawCards(5+(this.has('feather')?1:0)+(b.p.drawTurn||0)+(b.turn===1&&this.has('moonstone')?1:0));
    }
    needsTarget(instance) {const e=D.getCard(instance)?.effects||{};return !e.aoe&&!!(e.damage||e.poison||e.frost||e.weak||e.vulnerable||e.poisonMultiply);}
    damageFor(instance,enemy) {const c=D.getCard(instance),e=c.effects,b=this.s.battle,p=b.p;let n=(e.damage||0)+(p.strength||0)+(p.bloom||0)+(p.heat||0)+(e.heatScale||0)*(p.heat||0)+(e.comboScale||0)*(b.played||0)+(e.bloomScale||0)*(p.bloom||0)+(e.frostScale||0)*(enemy?.frost||0)+(e.poisonScale||0)*(enemy?.poison||0);if(p.weak)n*=.75;if(enemy?.vulnerable)n*=1.5;return Math.max(0,Math.floor(n));}
    intent(enemy) {
      const source=D.enemies[enemy.id],a=clone(source.pattern[enemy.turn%source.pattern.length]);
      if(a.damage){let damage=Math.round(a.damage*DIFFICULTIES[this.s.difficulty].damage)+(enemy.strength||0)-(enemy.frost||0);damage=Math.max(0,damage);if(enemy.weak)damage*=.75;if(this.s.battle.p.vulnerable)damage*=1.5;a.damage=Math.max(0,Math.floor(damage));}return a;
    }
    enemyDamage(enemy,amount,piercing=false) {
      if(enemy.hp<=0)return;let blocked=piercing?0:Math.min(enemy.block,amount);enemy.block-=blocked;const dealt=Math.min(enemy.hp,amount-blocked);enemy.hp-=dealt;this.s.stats.damage+=dealt;this.emit(piercing?'poison':'damage',enemy.uid,dealt,blocked?`防御 ${blocked}`:null,{hp:enemy.hp,maxHP:enemy.maxHP,block:enemy.block,blocked});if(enemy.hp<=0)this.emit('defeat',enemy.uid,0);
      if(enemy.boss&&!enemy.enraged&&enemy.hp>0&&enemy.hp<=enemy.maxHP*.5){enemy.enraged=true;enemy.strength+=2+this.s.act;this.emit('buff',enemy.uid,2+this.s.act,'覚醒');this.log(`${enemy.name}が覚醒！ 筋力が${2+this.s.act}増えた。`);}
    }
    playerDamage(amount,piercing=false,source) {const b=this.s.battle;const blocked=piercing?0:Math.min(b.block,amount);b.block-=blocked;const n=amount-blocked;this.s.hp=Math.max(0,this.s.hp-n);this.emit(n?'damage':'block','player',n||blocked,null,{hp:this.s.hp,maxHP:this.s.maxHP,block:b.block,blocked,source:source?.uid});if(source&&b.p.thorns)this.enemyDamage(source,b.p.thorns,true);}
    play(uid,targetUid) {
      this.expect('battle');const b=this.s.battle;const index=b.hand.findIndex(c=>c.uid===Number(uid));if(index<0)throw new Error('そのカードは手札にありません。');const instance=b.hand[index],c=D.getCard(instance,this.s.hero),e=c.effects;
      if(c.cost<0)throw new Error('このカードはプレイできません。');if(c.cost>b.energy)throw new Error('エナジーが足りません。');
      const target=b.enemies.find(x=>x.uid===targetUid&&x.hp>0);if(this.needsTarget(instance)&&!target)throw new Error('対象の敵を選んでください。');
      b.energy-=c.cost;b.hand.splice(index,1);this.s.stats.cards++;this.log(`${c.name}を使った。`);
      const targets=e.aoe?b.enemies.filter(x=>x.hp>0):(target?[target]:[]);
      this.emit('card','player',c.art,c.name,{cardId:c.id,cardUid:instance.uid,hero:this.s.hero,ultimate:c.ultimate,targets:targets.map(t=>t.uid)});
      if(e.damage){for(let i=0;i<(e.hits||1);i++)for(const enemy of targets)if(enemy.hp>0)this.enemyDamage(enemy,this.damageFor(instance,enemy));if(!b.attacksPlayed&&this.has('wolfcharm')){b.block+=3;this.emit('block','player',3);}b.attacksPlayed++;if(b.p.heat)b.p.heat=Math.max(0,b.p.heat-1);}
      if(e.block){let n=e.block+(b.p.dexterity||0)+(e.bloomBlock||0)*(b.p.bloom||0)+(e.comboBlock||0)*b.played;if(b.firstBlock&&this.has('clover'))n+=3;b.firstBlock=false;b.block+=n;this.emit('block','player',n);}
      for(const enemy of targets)if(enemy.hp>0){for(const key of ['poison','frost','weak','vulnerable'])if(e[key]){enemy[key]+=e[key];this.emit('status',enemy.uid,e[key],D.statusLabels[key][0]);}if(e.poisonMultiply){enemy.poison*=e.poisonMultiply;this.emit('status',enemy.uid,enemy.poison,'毒');}}
      for(const key of ['bloom','strength','dexterity','thorns','regen','bloomTurn','drawTurn','energyTurn','blockTurn','poisonTurn','heat','heatTurn'])if(e[key]){b.p[key]=(b.p[key]||0)+e[key];this.emit('buff','player',e[key],D.statusLabels[key][0]);}
      if(e.preserveBlock)b.p.preserveBlock=true;if(e.energy)b.energy+=e.energy;if(e.heal)this.heal(e.heal);
      if(e.draw)this.drawCards(e.draw);
      b.played++;if(this.s.hero==='ranger')b.p.combo=b.played;
      if(e.exhaust||c.type==='power')b.exhaust.push(instance);else b.discard.push(instance);
      this.checkEnd();return c;
    }
    endTurn() {
      this.expect('battle');const b=this.s.battle;
      for(const c of b.hand){if(c.id==='curse')this.playerDamage(2,true);if(D.getCard(c).effects.ethereal)b.exhaust.push(c);else b.discard.push(c);}b.hand=[];
      if(this.s.hp<=0){this.checkEnd();return;}
      if(b.p.regen){this.heal(b.p.regen);b.p.regen--;}
      const oldWeak=b.p.weak||0,oldVulnerable=b.p.vulnerable||0;
      for(const enemy of b.enemies){
        if(enemy.hp<=0)continue;enemy.block=0;
        if(enemy.poison){this.enemyDamage(enemy,enemy.poison,true);enemy.poison--;}
        if(enemy.hp<=0)continue;
        const action=this.intent(enemy);this.emit('enemyAction',enemy.uid,0,action.kind);
        if(action.damage!==undefined){for(let i=0;i<(action.hits||1);i++){this.playerDamage(action.damage,false,enemy);if(this.s.hp<=0||enemy.hp<=0)break;}this.log(`${enemy.name}：${action.damage}${action.hits>1?'×'+action.hits:''}ダメージ。`);}
        if(enemy.hp>0){if(action.block){enemy.block+=action.block;this.emit('block',enemy.uid,action.block);}if(action.strength){enemy.strength+=action.strength;this.emit('buff',enemy.uid,action.strength,'筋力');}if(action.status==='dazed'){for(let i=0;i<action.amount;i++)b.discard.push({id:'dazed',uid:this.uid(),upgraded:false});this.log(`捨て札に「まどろみ」${action.amount}枚。`);}else if(action.status)b.p[action.status]=(b.p[action.status]||0)+action.amount;}
        enemy.turn++;if(enemy.weak)enemy.weak--;if(enemy.vulnerable)enemy.vulnerable--;if(enemy.frost)enemy.frost--;
        if(this.s.hp<=0)break;
      }
      if(oldWeak)b.p.weak=Math.max(0,(b.p.weak||0)-1);if(oldVulnerable)b.p.vulnerable=Math.max(0,(b.p.vulnerable||0)-1);
      if(!this.checkEnd()){this.startTurn();this.emit('turn','player',b.turn);}
    }
    checkEnd() {
      if(this.s.hp<=0){this.s.screen='result';this.s.won=false;this.s.endedAt=Date.now();return true;}
      if(this.s.battle.enemies.every(e=>e.hp<=0)){this.winBattle();return true;}return false;
    }
    winBattle() {
      const kind=this.s.battle.kind;this.s.stats.battles++;if(kind==='elite')this.s.stats.elites++;
      if(this.has('ribbon'))this.heal(4);if(this.has('honey'))this.heal(5);
      const gold=Math.round((kind==='boss'?95:kind==='elite'?45:22+Math.floor(this.random()*12))*(this.has('compass')?1.5:1)*DIFFICULTIES[this.s.difficulty].gold);this.s.gold+=gold;
      this.s.reward={gold,cards:this.rollCards(3,kind!=='battle'),relic:kind==='elite'?this.rollRelics(1)[0]:null,potion:this.random()<.33?this.pick(Object.keys(D.potions)):null,cardClaimed:false,potionClaimed:false,relicClaimed:false,boss:kind==='boss'};
      if(kind==='boss'&&this.s.act===2){this.s.screen='result';this.s.won=true;this.s.endedAt=Date.now();}else this.s.screen='reward';this.emit('victory','player',gold);
    }
    selectReward(uid) {this.expect('reward');const r=this.s.reward;if(r.cardClaimed)throw new Error('カードは受け取り済みです。');const c=r.cards.find(c=>c.uid===Number(uid));if(!c)throw new Error('報酬を選んでください。');this.addCard(c.id,c.upgraded);r.cardClaimed=true;r.chosen=c.uid;}
    claimRelic() {this.expect('reward');const r=this.s.reward;if(!r.relic||r.relicClaimed)return;this.addRelic(r.relic);r.relicClaimed=true;}
    claimPotion() {this.expect('reward');const r=this.s.reward;if(!r.potion||r.potionClaimed)return;if(this.s.potions.length>=3)throw new Error('ポーションは3個まで持てます。不要なものを捨ててください。');this.s.potions.push(r.potion);r.potionClaimed=true;}
    finishReward() {this.expect('reward');this.claimRelic();if(this.s.reward.potion&&!this.s.reward.potionClaimed&&this.s.potions.length<3)this.claimPotion();if(this.s.reward.boss){this.s.screen='bossReward';this.s.room={relics:this.rollRelics(3,true)};}else this.finishRoom();}
    chooseBossRelic(id) {this.expect('bossReward');if(id&&!this.s.room.relics.includes(id))throw new Error('レリックを選んでください。');if(id)this.addRelic(id);this.heal(Math.round(this.s.maxHP*.4));this.s.act++;this.s.row=-1;this.s.lane=1;this.s.map=this.makeMap();this.finishRoom();}
    finishRoom() {this.s.screen='map';this.s.battle=null;this.s.reward=null;this.s.room=null;}
    rest() {this.expect('rest');const heal=this.heal(Math.round(this.s.maxHP*(.3+(this.has('teacup')?.15:0))));this.finishRoom();return heal;}
    upgradeCard(uid) {if(!['rest','event'].includes(this.s.screen))throw new Error('ここでは強化できません。');const c=this.s.deck.find(c=>c.uid===Number(uid));if(!c||c.upgraded||['curse','status'].includes(D.cards[c.id].type))throw new Error('強化できるカードを選んでください。');c.upgraded=true;if(this.s.screen==='rest')this.finishRoom();return c;}
    collectTreasure() {this.expect('treasure');this.addRelic(this.s.room.relic);this.s.gold+=this.s.room.gold;this.finishRoom();}
    makeShop() {this.s.room={cards:this.rollCards(5).map((c,i)=>({...c,price:i===0?38:D.cards[c.id].rarity==='rare'?118:D.cards[c.id].rarity==='uncommon'?78:52,sold:false})),relics:this.rollRelics(2).map(id=>({id,price:145,sold:false})),potions:this.shuffle(Object.keys(D.potions)).slice(0,2).map(id=>({id,price:38,sold:false})),removed:false};}
    buy(kind,index) {this.expect('shop');if(!['cards','relics','potions'].includes(kind))throw new Error('商品が見つかりません。');const item=this.s.room[kind][Number(index)];if(!item||item.sold)throw new Error('その商品は売り切れです。');if(this.s.gold<item.price)throw new Error('ゴールドが足りません。');if(kind==='potions'&&this.s.potions.length>=3)throw new Error('ポーションの枠がいっぱいです。');this.s.gold-=item.price;item.sold=true;if(kind==='cards')this.addCard(item.id,item.upgraded);if(kind==='relics')this.addRelic(item.id);if(kind==='potions')this.s.potions.push(item.id);return item;}
    removeCard(uid) {const c=this.s.deck.find(c=>c.uid===Number(uid));if(!c||this.s.deck.length<2)throw new Error('このカードは削除できません。');if(this.s.screen==='shop'){if(this.s.room.removed)throw new Error('削除は1回までです。');if(this.s.gold<65)throw new Error('65ゴールド必要です。');this.s.gold-=65;this.s.room.removed=true;}else if(this.s.screen==='event'){if(!this.s.room.removing)throw new Error('この選択肢は使えません。');this.s.room.removing=false;this.s.room.done=true;this.s.room.result='思い出をひとつ手放し、足取りが軽くなった。';}else throw new Error('ここでは削除できません。');this.s.deck=this.s.deck.filter(x=>x.uid!==c.uid);return c;}
    eventChoice(index) {
      this.expect('event');const room=this.s.room;if(room.done||room.removing)throw new Error('すでに選びました。');const event=D.events.find(e=>e.id===room.event);const o=event.options[Number(index)];if(!o)throw new Error('選択肢が見つかりません。');if(o.cost&&this.s.gold<o.cost)throw new Error('ゴールドが足りません。');
      if(['labor','rare','sacrifice'].includes(o.effect)&&this.s.hp<=o.value)throw new Error('HPが足りません。別の道を選びましょう。');if(o.cost)this.s.gold-=o.cost;room.done=true;room.result='小さな思い出を胸に、旅は続く。';
      const relic=()=>{let id=this.rollRelics(1)[0];if(id){this.addRelic(id);room.result=`「${D.relics[id].name}」を手に入れた。`;}else{this.s.gold+=60;room.result='60ゴールドを手に入れた。';}};
      switch(o.effect){
        case 'heal':room.result=`泉の光でHPが${this.heal(Math.round(this.s.maxHP*o.value))}回復した。`;break;
        case 'healFlat':room.result=`ほっとひと息。HPが${this.heal(o.value)}回復した。`;break;
        case 'maxHP':this.s.maxHP+=o.value;this.heal(o.value);room.result=`最大HPが${o.value}増えた。`;break;
        case 'cursedRelic':relic();this.addCard('curse');room.result+=' 「迷いの霧」がデッキに加わった。';break;
        case 'labor':this.s.hp-=o.value;this.s.gold+=65;room.result='小鳥はうれしそう！ お礼に65ゴールドをくれた。';break;
        case 'feed':this.s.maxHP+=6;this.heal(6);room.result='最大HPが6増えた。';break;
        case 'cake':this.s.maxHP+=10;this.heal(10);room.result='あまい幸せ！ 最大HPが10増えた。';break;
        case 'upgrade':{const cs=this.shuffle(this.s.deck.filter(c=>!c.upgraded&&!['curse','status'].includes(D.cards[c.id].type))).slice(0,o.value);for(const c of cs)c.upgraded=true;room.result=cs.length?cs.map(c=>D.getCard(c,this.s.hero).name).join('、')+'を強化した。':'強化できるカードがない。代わりに40ゴールドを見つけた。';if(!cs.length)this.s.gold+=40;break;}
        case 'remove':room.done=false;room.removing=true;break;
        case 'rare':{this.s.hp-=o.value;const c=this.pick(this.cardPool('rare'));this.addCard(c.id);room.result=`「${c.name}」を手に入れた。`;break;}
        case 'buyRelic':relic();break;
        case 'sacrifice':this.s.hp-=o.value;relic();break;
        case 'gold':this.s.gold+=o.value;room.result=`鐘の下で${o.value}ゴールドを見つけた。`;break;
        case 'potion':if(this.s.potions.length<3){const id=this.pick(Object.keys(D.potions));this.s.potions.push(id);room.result=`「${D.potions[id].name}」を見つけた。`;}else{this.s.gold+=35;room.result='35ゴールドを見つけた。';}break;
      }
      return room;
    }
    usePotion(index) {if(!this.s||['result','bossReward'].includes(this.s.screen))throw new Error('ここでは使えません。');index=Number(index);const id=this.s.potions[index];if(!id)throw new Error('ポーションがありません。');if(id!=='heal')this.expect('battle');if(id==='heal'&&this.s.hp>=this.s.maxHP)throw new Error('HPは満タンです。');this.s.potions.splice(index,1);
      if(id==='heal')this.heal(20+(this.has('vial')?8:0));if(id==='energy')this.s.battle.energy+=2;if(id==='shield'){this.s.battle.block+=15;this.emit('block','player',15);}if(id==='fire'){for(const e of this.s.battle.enemies)this.enemyDamage(e,20);this.checkEnd();}return id;
    }
    discardPotion(index) {index=Number(index);if(!this.s.potions[index])return;this.s.potions.splice(index,1);}
  }
  Engine.DIFFICULTIES=DIFFICULTIES;
  if(typeof module!=='undefined'&&module.exports)module.exports=Engine;else root.BloomEngine=Engine;
})(typeof window!=='undefined'?window:globalThis);
