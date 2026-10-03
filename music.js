/* Original procedural score. No recordings, network requests or third-party samples. */
(function(root){
  'use strict';
  const tracks={ambient:{name:'木漏れ日の旅路',bpm:68},boss:{name:'花灯りの試練',bpm:132},final:{name:'暁冠、最後の翼',bpm:144}};
  const freq=midi=>440*Math.pow(2,(midi-69)/12);
  function route(s,playing=true){return playing&&s?.screen==='battle'&&s.battle?.kind==='boss'?(s.battle.enemies.some(e=>e.id==='bossAurora')?'final':'boss'):'ambient';}
  function intensity(s){const b=s?.battle,boss=b?.enemies.find(e=>e.boss&&e.hp>0);return boss?Math.min(1,.25+(1-boss.hp/boss.maxHP)*.5+Math.min(b.turn,12)/48):.25;}
  // A bar is a deterministic score in beats, making live playback and export identical.
  function score(key,bar,power=.5){
    if(!tracks[key])throw new Error('Unknown music track');
    const notes=[],add=(voice,beat,note,duration,gain,pan=0)=>notes.push({voice,beat,note,duration,gain,pan});
    if(key==='ambient'){
      const roots=[48,45,53,55],r=roots[Math.floor(bar/2)%4],chord=[r,r+4,r+7,r+12];
      chord.forEach((n,i)=>add('pad',0,n,4.8,.065,i%2?.45:-.45));
      [0,2,1,3].forEach((v,i)=>add('bell',i,chord[(v+bar)%4]+12,2.4,.12,i%2?.35:-.35));
      return notes;
    }
    const final=key==='final',section=Math.floor(bar/4)%4,progression=[38,38,34,36,38,41,40,33],r=progression[bar%8];
    const major=bar%8===7,third=major?4:3,chord=[r,r+third,r+7],pulse=[0,7,12,7,third,7,12,7,0,7,12,7,third,7,12,major?11:7];
    pulse.forEach((n,i)=>add('strings',i/4,r+24+n,.21,i%4===0?.135:.08,final?-.3:-.45));
    [0,1.5,2,3.5].forEach((beat,i)=>add('bass',beat,r, i%2?.42:1.1,.24));
    add('timpani',0,r,.85,.42);add('timpani',2,r+7,.65,.32);
    [1,3].forEach(beat=>add('snare',beat,0,.28,.13+power*.07,.18));
    for(let i=0;i<8;i++)add('hat',i/2,0,.12,i%2?.025:.045,-.32);
    if(bar%4===3){[3,3.25,3.5,3.75].forEach((beat,i)=>add('timpani',beat,r+7-i*2,.26,.12+i*.035));}
    if(bar%4===0)add('cymbal',0,0,2.8,.14);
    chord.forEach((n,i)=>add('choir',0,n+12,4.15,.06+(final?.025:0)+power*.025,i%2?.5:-.5));
    // Four phrases: statement, ascent, release and a harmonic-minor turnaround.
    const bossPhrases=[[74,69,70,65],[74,77,76,73],[77,76,74,70],[69,70,73,76]];
    const finalPhrases=[[74,81,77,76,74,73],[77,81,86,85,81,77],[82,81,77,76,74,70],[73,76,81,80,77,73]];
    if(section>0||final){
      const melody=(final?finalPhrases:bossPhrases)[bar%4],timing=final?[0,.75,1.5,2,2.75,3.5]:[0,1.5,2.5,3.25];
      melody.forEach((n,i)=>add('brass',timing[i],n,(timing[i+1]??4)-timing[i]-.08,.095+power*.035,.18));
    }
    if(final&&section>=2)[0,.75,1.5,2.5,3.25].forEach((beat,i)=>add('bell',beat,chord[i%3]+48,.55,.06,.55));
    return notes;
  }
  function noiseBuffer(ctx){const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=buffer.getChannelData(0);let seed=20261002;for(let i=0;i<data.length;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;data[i]=(seed>>>0)/2147483648-1;}return buffer;}
  function voice(ctx,bus,event,start,beat,noise,sources){
    const e=event,t=start+e.beat*beat,d=Math.max(.04,e.duration*beat),g=ctx.createGain(),pan=ctx.createStereoPanner(),f=ctx.createBiquadFilter();
    pan.pan.value=e.pan;g.connect(f);f.connect(pan);pan.connect(bus);f.type='lowpass';f.frequency.value=3800;
    const register=o=>{sources?.add(o);o.onended=()=>{sources?.delete(o);o.disconnect();};o.connect(g);o.start(t);o.stop(t+d+.12);};
    let attack=.018,release=d;
    if(['hat','snare','cymbal'].includes(e.voice)){
      const o=ctx.createBufferSource();o.buffer=noise;f.type='highpass';f.frequency.value=e.voice==='snare'?1250:6000;attack=.002;register(o);
    }else if(e.voice==='timpani'){
      const o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(freq(e.note)*2.5,t);o.frequency.exponentialRampToValueAtTime(freq(e.note)*.7,t+.14);attack=.003;f.frequency.value=800;register(o);
    }else{
      const types={strings:'sawtooth',brass:'sawtooth',bass:'triangle',choir:'triangle',pad:'sine',bell:'sine'};
      f.frequency.value={strings:1800,brass:2600,bass:400,choir:1250,pad:950,bell:6000}[e.voice];
      const spread=['strings','choir','brass'].includes(e.voice)?[-5,5]:[0];
      if(['pad','choir'].includes(e.voice))attack=.25;
      for(const detune of spread){const o=ctx.createOscillator();o.type=types[e.voice];o.frequency.value=freq(e.note);o.detune.value=detune;register(o);}
      if(e.voice==='bell'){const o=ctx.createOscillator();o.type='sine';o.frequency.value=freq(e.note)*2.001;const overtone=ctx.createGain();o.connect(overtone);overtone.gain.value=.12;overtone.connect(g);sources?.add(o);o.onended=()=>{sources?.delete(o);overtone.disconnect();o.disconnect();};o.start(t);o.stop(t+d);}
    }
    attack=Math.min(attack,d*.35);g.gain.setValueAtTime(.00001,t);g.gain.exponentialRampToValueAtTime(Math.max(.00002,e.gain),t+attack);
    if(['strings','brass','bass','choir','pad'].includes(e.voice))g.gain.linearRampToValueAtTime(e.gain*.62,t+d*.72);
    g.gain.exponentialRampToValueAtTime(.00001,t+release);
    // Disconnect downstream nodes after their audio has completed, including offline contexts.
    const cleanup=ctx.createConstantSource();cleanup.offset.value=0;cleanup.onended=()=>{g.disconnect();f.disconnect();pan.disconnect();};cleanup.start(t);cleanup.stop(t+d+.2);
  }
  class Player{
    constructor(ctx){this.ctx=ctx;this.noise=noiseBuffer(ctx);this.key=null;this.timer=null;this.sources=new Set();this.serial=0;}
    set(key,volume=.5,power=.5){
      if(!tracks[key]){this.stop();return;}this.power=power;
      if(this.key===key){this.bus.gain.setTargetAtTime(volume*.52,this.ctx.currentTime,.08);return;}
      this.stop();this.key=key;const ctx=this.ctx,bus=ctx.createGain(),compressor=ctx.createDynamicsCompressor();this.bus=bus;this.compressor=compressor;
      compressor.threshold.value=-16;compressor.knee.value=20;compressor.ratio.value=3;compressor.attack.value=.012;compressor.release.value=.22;bus.connect(compressor);compressor.connect(ctx.destination);bus.gain.setValueAtTime(0,ctx.currentTime);bus.gain.linearRampToValueAtTime(volume*.52,ctx.currentTime+.3);
      this.bar=0;this.next=ctx.currentTime+.06;const beat=60/tracks[key].bpm,serial=++this.serial;
      const schedule=()=>{if(this.serial!==serial)return;while(this.next<ctx.currentTime+.18){for(const e of score(key,this.bar,this.power))voice(ctx,bus,e,this.next,beat,this.noise,this.sources);this.bar++;this.next+=beat*4;}};
      schedule();this.timer=setInterval(schedule,75);
    }
    stop(){
      clearInterval(this.timer);this.timer=null;this.serial++;this.key=null;
      if(this.bus){const bus=this.bus,compressor=this.compressor,t=this.ctx.currentTime;bus.gain.cancelScheduledValues(t);bus.gain.setTargetAtTime(0,t,.06);for(const source of this.sources){try{source.stop(t+.25);}catch{}}this.sources.clear();setTimeout(()=>{bus.disconnect();compressor.disconnect();},350);this.bus=null;}
    }
  }
  const API={tracks,route,intensity,score,Player,voice,noiseBuffer};
  if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.BloomMusic=API;
})(typeof window!=='undefined'?window:globalThis);
