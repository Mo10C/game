(function(root){
'use strict';
const D=typeof module!=='undefined'&&module.exports?require('./expansion-data.js'):root.BloomData;
const heroes=Object.keys(D.heroes),variants=['base','plus','power','technique'];
const costumes={default:{name:'旅立ちの装い',requirement:'このキャラで冒険をはじめる'},festival:{name:'星祭りの礼装',requirement:'このキャラで物語の5ステージをクリア'},dawn:{name:'暁の継承者',requirement:'このキャラで踏破の5ステージをクリア'}};
const ascentRequirement='「月夜の試練」で物語の5ステージをクリア';
const number=n=>Number.isFinite(n)?Math.max(0,Math.min(10000,Math.floor(n))):0;
function cardKey(c){return c.id+':'+(c.branch||(c.upgraded?'plus':'base'));}
function validKey(key,h){if(typeof key!=='string')return false;const [id,v,...extra]=key.split(':');return !extra.length&&Object.hasOwn(D.cards,id)&&!['curse','status'].includes(D.cards[id].type)&&['all',h].includes(D.cards[id].hero)&&variants.includes(v);}
function played(p,h){return !!p.heroes[h]?.played;}
function discovered(p,c,h){return (p.gallery[h]||[]).includes(cardKey(c));}
function knownCard(p,c,h){return variants.some(v=>(p.gallery[h]||[]).includes(c.id+':'+v));}
function unlocked(p,h,id){const r=p.heroes[h];return !!r&&(id==='default'||id==='festival'&&r.storyBest>=5||id==='dawn'&&r.ascentBest>=5);}
function normalize(raw={}){
 raw=raw&&typeof raw==='object'?raw:{};const p={heroes:{},gallery:{},equipped:{},title:typeof raw.title==='string'?raw.title:'traveler'};
 for(const h of heroes){const r=raw.heroes?.[h]||{};
  p.gallery[h]=[...new Set((Array.isArray(raw.gallery?.[h])?raw.gallery[h]:[]).filter(k=>validKey(k,h)))];
  p.heroes[h]={storyBest:Math.min(5,number(r.storyBest)),ascentBest:number(r.ascentBest),reached:Math.max(1,number(r.reached)),rankCleared:Math.min(10,number(r.rankCleared)),played:r.played===true||number(r.storyBest)>0||number(r.ascentBest)>0||number(r.reached)>1||p.gallery[h].length>0,moonlightCleared:r.moonlightCleared===true};
  if(p.heroes[h].moonlightCleared){p.heroes[h].storyBest=5;p.heroes[h].played=true;}
  p.equipped[h]=Object.hasOwn(costumes,raw.equipped?.[h])?raw.equipped[h]:'default';if(!unlocked(p,h,p.equipped[h]))p.equipped[h]='default';
 }
 if(!titles(p).some(t=>t.id===p.title&&t.unlocked))p.title='traveler';return p;
}
function ascentUnlocked(p){return heroes.some(h=>p.heroes[h].moonlightCleared);}
function maxRank(p){return Math.min(10,1+Math.max(0,...heroes.map(h=>p.heroes[h].rankCleared)));}
function titles(p){const stats=Object.values(p.heroes),story=Math.max(...stats.map(r=>r.storyBest)),ascent=Math.max(...stats.map(r=>r.ascentBest)),rank=Math.max(...stats.map(r=>r.rankCleared));return [{id:'traveler',name:'花灯りの旅人',requirement:'最初から使えます',unlocked:true},{id:'starkeeper',name:'星夜を越えた者',requirement:'物語のステージ3をクリア',unlocked:story>=3},{id:'dawnbringer',name:'夜明けの導き手',requirement:'物語のステージ5をクリア',unlocked:story>=5},{id:'pilgrim',name:'果てなき巡礼者',requirement:'踏破のステージ10をクリア',unlocked:ascent>=10},{id:'astral',name:'星海の征服者',requirement:'踏破のステージ20をクリア',unlocked:ascent>=20},{id:'crown',name:'極天の王冠',requirement:'試練10でステージ5をクリア',unlocked:rank>=10},{id:'companions',name:'五つの花の約束',requirement:'5人全員で物語をクリア',unlocked:stats.every(r=>r.storyBest>=5)}];}
function record(profile,state){const p=normalize(profile);if(!state||!heroes.includes(state.hero))return p;const h=state.hero,r=p.heroes[h],act=number(state.act),clear=number(state.clearedStages??(state.won?act+1:act));r.played=true;r.reached=Math.max(r.reached,act+1);
 if(state.mode==='ascent'){r.ascentBest=Math.max(r.ascentBest,clear);if(clear>=5)r.rankCleared=Math.max(r.rankCleared,Math.min(10,number(state.rank)||1));}
 else {r.storyBest=Math.max(r.storyBest,Math.min(5,clear));if(state.difficulty==='moonlight'&&state.won===true&&clear>=5)r.moonlightCleared=true;}
 p.gallery[h]=[...new Set([...p.gallery[h],...(Array.isArray(state.playedCards)?state.playedCards:[]).filter(k=>validKey(k,h))])];return p;
}
function merge(a,b,preferIncoming=false){const p=normalize(a),q=normalize(b);for(const h of heroes){for(const k of ['storyBest','ascentBest','reached','rankCleared'])p.heroes[h][k]=Math.max(p.heroes[h][k],q.heroes[h][k]);for(const k of ['played','moonlightCleared'])p.heroes[h][k] ||= q.heroes[h][k];p.gallery[h]=[...new Set([...p.gallery[h],...q.gallery[h]])];if(preferIncoming&&b?.equipped&&Object.hasOwn(b.equipped,h)&&unlocked(p,h,b.equipped[h]))p.equipped[h]=b.equipped[h];}if(preferIncoming&&titles(p).some(t=>t.id===b?.title&&t.unlocked))p.title=b.title;return p;}
const api={normalize,record,merge,played,discovered,knownCard,cardKey,validKey,variants,unlocked,ascentUnlocked,ascentRequirement,maxRank,titles,costumes};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BloomProgress=api;
})(typeof window!=='undefined'?window:globalThis);
