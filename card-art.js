/* One illustration per move; basic strike/guard also have one per adventurer. */
(function(root){
  'use strict';
  const groups={"knight":["strike","guard","bloomcut","rose","doublecut","petalguard","petaldraw","bramble","flourish","petalstorm","resolve","bloomheart","riposte","petalwall","finalbloom","dew","roseoath","sanctuary"],"witch":["strike","guard","spark","moonbolt","icewall","stargaze","frostbite","lightning","blizzard","shatter","comet","moonaura","astronomy","absolute","supernova","moonstep","eclipse"],"alchemist":["strike","guard","toxic","venom","flask","mist","brew","cloud","catalyst","blast","recycle","toxicology","medicine","leech","philosopher","pandora","venomgarden","elixir"],"dragoon":["strike","guard","ember","kindle","flameguard","spear","cinders","warmth","ignition","dragonfang","forge","firewheel","dragonheart","crimsonlance","dragonflare","sunfall"],"ranger":["strike","guard","twinfang","feint","swift","crescent","snowstep","pounce","moonfang","tailwind","shadowdance","snowfall","wolfheart","crossmoon","nightdance","silverwaltz"],"neutral":["quick","focus","bash","cleave","fortress","agile","wisdom","precision","needle","healing","meteor","evergreen","lucky","curse","dazed"]};
  const sources={knight:'./assets/cards-knight.png',witch:'./assets/cards-witch.png',alchemist:'./assets/cards-alchemist.png',dragoon:'./assets/cards-dragoon.png',ranger:'./assets/cards-ranger.png',neutral:'./assets/cards-neutral.png'};
  // Match the painted row boundaries; inset the display window to hide seams.
  const rowBounds={alchemist:[0,205/992,395/992,586/992,773/992,1],ranger:[0,208/992,409/992,604/992,796/992,1]};
  function get(id,hero='knight'){
    const group=['strike','guard'].includes(id)?(groups[hero]?.includes(id)?hero:'knight'):Object.keys(groups).find(h=>groups[h].includes(id));
    if(!group)throw new Error('Card art is missing: '+id);
    const index=groups[group].indexOf(id),row=Math.floor(index/4),bounds=rowBounds[group]||[0,.2,.4,.6,.8,1];
    const left=index%4/4+.0015,top=bounds[row]+.002,width=.247,height=bounds[row+1]-bounds[row]-.004;
    return {key:group+':'+id,hero:group,src:sources[group],columns:4,rows:5,index,sizeX:100/width,sizeY:100/height,x:left/(1-width)*100,y:top/(1-height)*100};
  }
  const api={groups,sources,get};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BloomCardArt=api;
})(typeof window!=='undefined'?window:globalThis);
