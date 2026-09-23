/* Visual playback is independent of the atomic game rules and never changes the save. */
(() => {
  'use strict';
  const D=window.BloomData;
  const palettes={knight:['#ff9fc9','#ffe6ef','#ed669e'],witch:['#8fcfff','#f0faff','#ab9cff'],alchemist:['#9ff1ad','#fff4a1','#cfa2ff'],dragoon:['#ff9748','#fff3a0','#ff514e'],ranger:['#bba5ff','#e7fbff','#79deee']};
  const atlasOriginal='./assets/ultimates-original.png',atlasExtra='./assets/ultimates-extra.png';
  for(const src of [atlasOriginal,atlasExtra]){const art=new Image();art.src=src;}
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function portrait(hero,index,cls=''){
    const original=['knight','witch','alchemist'].includes(hero),row=(original?['knight','witch','alchemist']:['dragoon','ranger']).indexOf(hero);
    const size=512,w=1536,h=original?1536:1024;
    return `<svg class="ultimate-portrait ${cls}" viewBox="0 0 512 512" aria-hidden="true"><svg width="512" height="512" viewBox="${index*size} ${row*size} 512 512" overflow="hidden"><image href="${original?atlasOriginal:atlasExtra}" width="${w}" height="${h}" preserveAspectRatio="none"/></svg></svg>`;
  }
  let active=null;
  class Playback {
    constructor(options){
      this.options=options;this.motion=options.motion!==false&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.color=palettes[options.hero]||palettes.knight;this.cancelled=false;this.waiters=new Set();this.animations=[];this.particles=[];
      this.root=document.createElement('div');this.root.className='battle-effects';this.root.setAttribute('aria-hidden','true');
      this.canvas=document.createElement('canvas');this.root.appendChild(this.canvas);document.body.appendChild(this.root);this.ctx=this.canvas.getContext('2d');
      this.resize=()=>{this.w=innerWidth;this.h=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=this.w*dpr;this.canvas.height=this.h*dpr;this.canvas.style.width=this.w+'px';this.canvas.style.height=this.h+'px';this.ctx.setTransform(dpr,0,0,dpr,0,0);};this.resize();window.addEventListener('resize',this.resize);
      this.key=e=>{if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();this.skip();}};document.addEventListener('keydown',this.key,true);
      this.tick=this.tick.bind(this);if(this.motion)this.frame=requestAnimationFrame(this.tick);
    }
    wait(ms){if(this.cancelled)return Promise.resolve();return new Promise(resolve=>{const entry={resolve,timer:setTimeout(()=>{this.waiters.delete(entry);resolve();},this.motion?ms:0)};this.waiters.add(entry);});}
    skip(){this.cancelled=true;for(const e of this.waiters){clearTimeout(e.timer);e.resolve();}this.waiters.clear();}
    dispose(){this.skip();cancelAnimationFrame(this.frame);for(const a of this.animations)a.cancel();this.root.remove();this.cutin?.remove();this.skipButton?.remove();window.removeEventListener('resize',this.resize);document.removeEventListener('keydown',this.key,true);if(this.focusBefore?.isConnected)this.focusBefore.focus({preventScroll:true});}
    point(target){const node=document.querySelector(`[data-entity="${target}"] .combat-sprite`);if(node){const r=node.getBoundingClientRect();return {x:r.left+r.width*.52,y:r.top+r.height*.5,node:node.parentElement};}return {x:this.w*(target==='player'?.24:.73),y:this.h*(this.options.preview?.53:.4)};}
    animate(node,frames,duration,easing='ease-out'){if(!node||!this.motion||this.cancelled)return;const a=node.animate(frames,{duration,easing});this.animations.push(a);return a;}
    sound(name,...args){if(!this.cancelled)this.options.sound?.[name]?.(...args);}
    add(item){if(this.motion&&!this.cancelled)this.particles.push({start:performance.now(),life:500,...item});}
    ring(p,color=this.color[0],radius=95,life=650,delay=0){this.add({kind:'ring',x:p.x,y:p.y,color,radius,life,start:performance.now()+delay});}
    burst(p,n=24,color=this.color[0],kind='spark',power=1){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=(60+Math.random()*180)*power;this.add({kind,x:p.x,y:p.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,color,size:2+Math.random()*5,life:400+Math.random()*500,spin:Math.random()*6});}}
    slash(p,angle=-.6,color=this.color[1],scale=1,delay=0){this.add({kind:'slash',x:p.x,y:p.y,angle,color,radius:110*scale,life:430,start:performance.now()+delay});}
    beam(from,to,color=this.color[0],width=12,life=450){this.add({kind:'beam',x:from.x,y:from.y,tx:to.x,ty:to.y,color,size:width,life});}
    projectile(from,to,color,kind='bolt'){
      this.add({kind,x:from.x,y:from.y,tx:to.x,ty:to.y,color,size:12,life:320});
      for(let i=0;i<10;i++)this.add({kind:'trail',x:from.x,y:from.y,tx:to.x,ty:to.y,color,size:8-i*.6,life:320,start:performance.now()+i*12});
    }
    tick(now){
      this.ctx.clearRect(0,0,this.w,this.h);this.particles=this.particles.filter(p=>now-p.start<p.life);
      for(const p of this.particles){const age=now-p.start;if(age<0)continue;const t=Math.min(1,age/p.life);this.paint(p,t,age/1000);}
      if(!this.cancelled)this.frame=requestAnimationFrame(this.tick);
    }
    paint(p,t,sec){
      const c=this.ctx;c.save();c.globalCompositeOperation='lighter';c.globalAlpha=Math.max(0,1-t);c.strokeStyle=p.color;c.fillStyle=p.color;c.shadowColor=p.color;c.shadowBlur=12;
      if(p.kind==='ring'){
        c.lineWidth=3*(1-t)+1;c.beginPath();c.ellipse(p.x,p.y,Math.max(1,p.radius*(.15+t)),Math.max(1,p.radius*(.15+t)*(p.flat||1)),0,0,Math.PI*2);c.stroke();
      }else if(p.kind==='slash'){
        c.translate(p.x,p.y);c.rotate(p.angle);c.scale(1,.23);c.lineWidth=13*(1-t)+1;c.beginPath();c.arc(0,0,p.radius*(.7+t*.5),Math.PI*1.04,Math.PI*(1.12+Math.min(1,t*3)*.8));c.stroke();c.lineWidth=3;c.strokeStyle='#ffffff';c.stroke();
      }else if(p.kind==='beam'){
        c.lineWidth=p.size*Math.sin(Math.PI*t);c.lineCap='round';c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.tx,p.ty);c.stroke();c.strokeStyle='#fff';c.lineWidth=Math.max(1,c.lineWidth*.25);c.stroke();
      }else if(['bolt','trail'].includes(p.kind)){
        const u=Math.min(1,t*1.12);const x=p.x+(p.tx-p.x)*u,y=p.y+(p.ty-p.y)*u-Math.sin(t*Math.PI)*40;
        c.beginPath();c.arc(x,y,p.size*(1-t*.3),0,Math.PI*2);c.fill();
      }else if(p.kind==='crystal'){
        c.translate(p.x+p.vx*sec,p.y+p.vy*sec);c.rotate(p.spin+t*3);const s=p.size*(1-t*.4);c.beginPath();c.moveTo(0,-s*2);c.lineTo(s*.6,0);c.lineTo(0,s*2);c.lineTo(-s*.6,0);c.closePath();c.fill();
      }else if(p.kind==='mote'){
        const x=p.x+Math.sin(t*8+p.spin)*30+p.vx*sec,y=p.y+p.vy*sec;c.beginPath();c.arc(x,y,p.size*Math.sin(Math.PI*t),0,Math.PI*2);c.fill();
      }else{
        c.translate(p.x+p.vx*sec,p.y+p.vy*sec+45*sec*sec);c.rotate(p.spin+t*5);
        if(p.kind==='petal'){c.beginPath();c.ellipse(0,0,p.size*1.7,p.size*.65,.3,0,Math.PI*2);c.fill();}
        else {c.lineWidth=p.size*.5;c.beginPath();c.moveTo(0,0);c.lineTo(-p.vx*.05,-p.vy*.05);c.stroke();}
      }c.restore();
    }
    pop(e){
      if(this.cancelled)return;const p=this.point(e.target),target=p.node;
      if(['damage','poison','heal','block','buff','status'].includes(e.type)){
        const pop=document.createElement('span');pop.className=`impact-number fx-${e.type}`;pop.style.left=p.x+'px';pop.style.top=(p.y-32)+'px';
        pop.textContent=(e.type==='heal'?'+':'')+(e.label&&['status','buff'].includes(e.type)?e.label+' ':'')+e.value;
        if(e.blocked&&e.type==='damage'){const sub=document.createElement('small');sub.textContent=`防御 ${e.blocked}`;pop.appendChild(sub);}this.root.appendChild(pop);
        if(e.hp!==undefined&&target){const bar=target.querySelector('.health-bar');if(bar){bar.setAttribute('aria-label',`HP ${e.hp} / ${e.maxHP}`);bar.querySelector('span').style.width=e.hp/e.maxHP*100+'%';const b=bar.querySelector('b');b.innerHTML=`${b.querySelector('svg')?.outerHTML||''}${e.hp}<small>/ ${e.maxHP}</small>`;}}
      }
      if(e.type==='damage'||e.type==='poison'){
        this.burst(p,e.type==='poison'?12:20,e.type==='poison'?'#a2ee90':this.color[0],e.type==='poison'?'mote':'spark');
        this.animate(target?.querySelector('.combat-sprite'),[{transform:'translateX(0)',filter:'brightness(1)'},{transform:'translateX(12px) rotate(3deg)',filter:'brightness(1.8)'},{transform:'translateX(-5px)'},{transform:'translateX(0)',filter:'brightness(1)'}],280);this.sound('hit');
      }else if(e.type==='block'){
        this.ring(p,'#98dbff',85);this.animate(target?.querySelector('.combat-sprite'),[{filter:'drop-shadow(0 0 0 #91d5ff)'},{filter:'drop-shadow(0 0 22px #91d5ff)'},{filter:'drop-shadow(0 0 0 #91d5ff)'}],500);this.sound('block');
      }else if(e.type==='heal'||e.type==='buff'){
        for(let i=0;i<16;i++)this.add({kind:'mote',x:p.x+(Math.random()-.5)*100,y:p.y+80,vx:0,vy:-80-Math.random()*60,color:e.type==='heal'?'#b6f4a2':this.color[0],size:3+Math.random()*3,spin:i,life:800});
      }else if(e.type==='defeat'){
        this.burst(p,30,this.color[0],'mote');this.animate(target,[{opacity:1,filter:'brightness(1)'},{opacity:.8,filter:'brightness(2)',transform:'translateY(-8px)'},{opacity:0,filter:'brightness(1)',transform:'translateY(14px) scale(.8)'}],430);if(target)target.style.opacity='0';
      }
    }
    async cutIn(card){
      const u=card.ultimate,h=D.heroes[u.hero];
      if(!this.motion){this.options.announce?.(`${h.name}の必殺技、${card.name}`);return;}
      this.focusBefore=document.activeElement;
      const cut=document.createElement('div');cut.className=`ultimate-cutin composition-${u.index}`;cut.style.setProperty('--ult-color',h.color);cut.dataset.effect=u.fx;cut.setAttribute('role','status');
      cut.innerHTML=`<div class="cutin-shade"></div><div class="cutin-band"><div class="cutin-speed"></div><span class="cutin-watermark" aria-hidden="true">${u.en}</span><div class="cutin-halo"></div><div class="cutin-character">${portrait(u.hero,u.index)}</div><div class="cutin-copy"><p class="cutin-kicker">${this.options.preview?'SPECIAL PREVIEW':'ULTIMATE ART'} <span>0${u.index+1}</span></p><span class="cutin-hero">${h.name} <i>／ ${h.role}</i></span><h2>${esc(card.name.replace('＋',''))}</h2><p class="cutin-en">${u.en}</p><span class="cutin-rule"></span><p class="cutin-quote">「${h.quote}」</p></div><span class="cutin-seal">奥義</span></div>`;
      document.body.appendChild(cut);this.cutin=cut;
      const skip=document.createElement('button');skip.className='cutin-skip';skip.textContent='演出をスキップ [Esc]';skip.addEventListener('click',()=>this.skip());document.body.appendChild(skip);this.skipButton=skip;skip.focus({preventScroll:true});
      this.options.announce?.(`${h.name}、${card.name}！`);this.sound('charge',u.index);
      await this.wait(1350);cut.classList.add('cutin-out');await this.wait(300);cut.remove();
    }
    ultimateImpact(card,targets){
      const fx=card.ultimate.fx,from=this.point('player');const points=targets.length?targets.map(t=>this.point(t)):[from];
      const center=points.reduce((a,p)=>({x:a.x+p.x/points.length,y:a.y+p.y/points.length}),{x:0,y:0});
      this.sound('ultimate',card.ultimate.index);
      for(const p of points){
        switch(fx){
          case 'rose-slash':this.slash(p,-.65,this.color[1],1.8);this.slash(p,-.65,this.color[0],1.5,80);this.burst(p,65,this.color[0],'petal',1.4);break;
          case 'petal-sanctuary':for(let i=0;i<5;i++)this.ring(p,this.color[i%3],70+i*30,900,i*90);this.burst(p,60,'#ffe1a0','petal',.7);break;
          case 'bloom-finale':for(let i=0;i<3;i++){this.slash(p,i%2?.6:-.6,this.color[i],1.8,i*150);this.ring(p,this.color[0],180,850,i*130);}this.burst(p,80,this.color[0],'petal',1.6);break;
          case 'lunar-eclipse':this.ring(p,'#af9dff',175,900);this.slash(p,-1.4,'#d4f0ff',2);this.beam(from,p,'#a7baff',25,800);this.burst(p,50,'#bab5ff','crystal');break;
          case 'absolute-zero':for(let i=0;i<12;i++){const q={x:p.x+(i-6)*19,y:p.y+80};this.beam(q,{x:q.x,y:p.y-120-Math.random()*80},'#a3e7ff',10,800);}this.ring(p,'#d0f5ff',180,900);this.burst(p,60,'#b5e9ff','crystal',1.3);break;
          case 'supernova':this.beam({x:p.x,y:0},p,'#afd7ff',64,800);for(let i=0;i<4;i++)this.ring(p,i%2?'#fff0b6':'#b3bcff',100+i*50,850,i*60);this.burst(p,110,'#f2e6ff','spark',2);break;
          case 'venom-eden':for(let i=0;i<5;i++)this.projectile({x:from.x,y:from.y-i*12},{x:p.x+(i-2)*28,y:p.y},i%2?'#c490ff':'#98e7a3');this.burst(p,65,'#bd91f5','mote',1.2);this.ring(p,'#93dcaa',150,950);break;
          case 'golden-elixir':for(let i=0;i<40;i++)this.add({kind:'mote',x:p.x+Math.sin(i)*70,y:p.y+130,vx:0,vy:-160-i*3,color:i%2?'#ffe8a3':'#c7ffc1',size:5,spin:i,life:1100});for(let i=0;i<3;i++)this.ring(p,'#ffe4a0',70+i*35,900,i*120);break;
          case 'prism-burst':['#fb9cc9','#ffcf85','#a7f5ab','#8de6fc','#c4a4ff'].forEach((color,i)=>{this.ring(p,color,95+i*30,1000,i*70);this.burst(p,18,color,'crystal',1.6);});break;
          case 'crimson-lance':this.beam(from,p,'#ff6f36',44,650);this.beam({x:from.x,y:from.y-20},{x:p.x+90,y:p.y-20},'#ffe8ae',9,700);this.burst(p,70,'#ffa855','spark',1.7);break;
          case 'dragon-flare':for(let i=-3;i<=3;i++)this.beam(from,{x:p.x+30,y:p.y+i*28},i%2?'#ff7145':'#ffd082',22,800);this.ring(p,'#ffb15e',210,850);this.burst(p,70,'#ff964f','mote',1.6);break;
          case 'sun-fall':for(let i=0;i<3;i++){const q={x:p.x+(i-1)*45,y:p.y};this.add({kind:'beam',x:q.x-140,y:-80,tx:q.x,ty:q.y,color:i%2?'#fff0b1':'#ff8844',size:30,life:650,start:performance.now()+i*160});this.ring(q,'#ffab68',140,700,i*160);}this.burst(p,80,'#ffc17d','spark',1.8);break;
          case 'cross-fang':this.slash(p,-.65,'#b79dff',2);this.slash(p,.65,'#c8f7ff',2,100);this.burst(p,60,'#cdc0ff','crystal',1.3);break;
          case 'midnight-draw':this.beam({x:0,y:p.y},{x:this.w,y:p.y},'#dad4ff',7,800);this.slash(p,0,'#a195f4',2.4,180);this.burst(p,60,'#b5c7ff','spark',1.5);break;
          case 'silver-waltz':for(let i=0;i<4;i++){this.slash(p,i*.9-1.4,i%2?'#91eaff':'#b39afa',1.6,i*130);this.ring(p,'#b6c7ff',70+i*28,750,i*100);}this.burst(p,65,'#c1e5ff','crystal',1.7);break;
        }
      }
      return center;
    }
    async ordinary(card,targets){
      const from=this.point('player'),attack=!!card.effects.damage;
      this.animate(from.node?.querySelector('.combat-sprite'),attack?[{transform:'translateX(0)'},{transform:'translateX(-14px) rotate(-6deg)',offset:.25},{transform:'translateX(55px) rotate(7deg)',offset:.55},{transform:'translateX(0)'}]:[{transform:'translateY(0)'},{transform:'translateY(-16px)'},{transform:'translateY(0)'}],480,'cubic-bezier(.2,.8,.3,1)');
      this.sound('whoosh');
      if(attack&&['knight','ranger','dragoon'].includes(this.options.hero)&&!card.effects.aoe){await this.wait(160);for(const id of targets){const p=this.point(id);this.slash(p,this.options.hero==='ranger'?.6:-.6);if(this.options.hero==='dragoon')this.beam(from,p,this.color[0],8);}}
      else if(targets.length){for(const id of targets)this.projectile(from,this.point(id),this.color[0]);await this.wait(290);for(const id of targets)this.ring(this.point(id),this.color[0],65,440);}
      else {this.ring(from,card.effects.block?'#a8dcff':this.color[0],100,650);await this.wait(150);}
    }
    async run(effects){
      const opener=effects.find(e=>e.type==='card'),card=opener&&D.getCard(opener.cardId,this.options.hero);
      if(card?.ultimate){await this.cutIn(card);if(this.cancelled)return;this.ultimateImpact(card,opener.targets);await this.wait(170);}
      else if(card)await this.ordinary(card,opener.targets);
      let damageIndex=0;
      for(const e of effects){
        if(this.cancelled)break;
        if(e.type==='card')continue;
        if(e.type==='enemyAction'){
          const from=this.point(e.target),to=this.point('player');
          this.animate(from.node?.querySelector('.combat-sprite'),[{transform:'translateX(0)'},{transform:'translateX(12px)',offset:.3},{transform:'translateX(-40px) rotate(-6deg)',offset:.65},{transform:'translateX(0)'}],450);
          if(['attack','debuff'].includes(e.label)){this.projectile(from,to,'#ffc4aa');this.sound('whoosh');await this.wait(300);}else {this.ring(from,'#ffe4ad',70);await this.wait(200);}continue;
        }
        if(e.type==='damage'||e.type==='poison'){
          if(damageIndex++)await this.wait(card?.ultimate?120:110);
          if(card?.effects.hits>1)this.slash(this.point(e.target),damageIndex%2?.6:-.6,this.color[damageIndex%3],card.ultimate?1.25:.7);
        }
        this.pop(e);
        if(e.type==='victory')this.sound('chime');
        if(['block','heal','buff','status'].includes(e.type))await this.wait(80);
      }
      await this.wait(card?.ultimate?850:480);
    }
  }
  const API={portrait,
    async play(effects,options){if(active)return;const playback=new Playback(options);active=playback;try{await playback.run(effects);}finally{playback.dispose();if(active===playback)active=null;}},
    async preview(id,options){const c=D.getCard(id);if(!c?.ultimate)return;const targets=c.effects.damage||c.effects.poison||c.effects.frost?['preview-enemy']:[];await API.play([{type:'card',cardId:id,hero:c.hero,ultimate:c.ultimate,targets}],{...options,hero:c.hero,preview:true});},
    skip(){active?.skip();},get running(){return !!active;}
  };
  window.addEventListener('pagehide',()=>API.skip());
  window.BloomFX=API;
})();
