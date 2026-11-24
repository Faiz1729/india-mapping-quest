/* Play: the quiz engine — an overlay that runs any list of questions (mcq, tf, map taps, order, match). */
(function(){
const {$,esc,shuffle,pick,rec,touchDay,save,sfx,vib,toast,confetti,checkBadges,lvlOf}=IMQ;
const byId=IMQ.Q.byId;
const I=()=>IMQ; // always read live (state may be replaced by import/reset)
let st=null, ui=null, mapApi=null, dyn=null;

const BASE={mcq:10,tf:6,mapFind:15,mapName:12,mapOrigin:15,order:20,match:20};

function open(){
 if(ui)return;
 const el=document.createElement('div');el.className='qz';el.innerHTML=`
 <div class="qz-top"><button class="qz-x" aria-label="Close">✕</button><div class="qz-prog"><i></i></div><div class="qz-meta"><b class="qz-combo"></b><b class="qz-xp">0 XP</b></div></div>
 <div class="qz-body">
  <div class="qz-map" hidden></div>
  <div class="qz-card"><div class="qz-tag"></div><h2 class="qz-q"></h2><div class="qz-a"></div><div class="qz-fb" hidden></div></div>
 </div>
 <div class="qz-foot"><button class="btn ghost qz-skip">I don’t know</button><button class="btn qz-next" disabled>Next</button></div>`;
 document.body.appendChild(el);document.body.classList.add('noscroll');
 ui={el,top:$('.qz-top',el),bar:$('.qz-prog i',el),combo:$('.qz-combo',el),xp:$('.qz-xp',el),map:$('.qz-map',el),tag:$('.qz-tag',el),q:$('.qz-q',el),a:$('.qz-a',el),fb:$('.qz-fb',el),skip:$('.qz-skip',el),next:$('.qz-next',el),foot:$('.qz-foot',el)};
 $('.qz-x',el).onclick=()=>{if(!st||st.done||confirm('Leave this round? Progress on answered questions is kept.'))close()};
 ui.skip.onclick=()=>giveUp();
 ui.next.onclick=()=>onNext();
 document.addEventListener('keydown',keys);
}
function close(){
 if(!ui)return;
 if(st&&st.timer)clearInterval(st.timer);
 document.removeEventListener('keydown',keys);
 if(mapApi){try{mapApi.map.remove()}catch(e){}mapApi=null;dyn=null}
 ui.el.remove();ui=null;document.body.classList.remove('noscroll');
 const cb=st&&st.onClose;st=null;if(cb)cb();
}
function keys(e){
 if(!ui||!st)return;
 if(e.key==='Enter'||e.key===' '){if(!ui.next.disabled&&e.target.tagName!=='BUTTON'){e.preventDefault();onNext()}}
 const n=parseInt(e.key);if(n>=1&&n<=6){const b=ui.a.querySelectorAll('.opt:not([disabled])')[n-1];if(b)b.click()}
}

/* ───────── session ───────── */
function start(cfg){
 // cfg: {title, qs, mode:'quest'|'arcade'|'speed'|'review'|'daily', deck, onClose, seconds}
 open();
 st=Object.assign({i:0,ok:0,xp:0,combo:0,best:0,log:[],retried:false,answered:false,done:false,seen:0},cfg);
 st.total=cfg.qs.length;
 ui.skip.hidden=false;ui.foot.hidden=cfg.mode==='speed';
 if(cfg.mode==='speed'){st.left=cfg.seconds||60;st.speedN=0;st.timer=setInterval(()=>{st.left--;ui.bar.style.width=(100*st.left/(cfg.seconds||60))+'%';if(st.left<=5)sfx.tick();if(st.left<=0){clearInterval(st.timer);finish()}},1000)}
 touchDay();
 showQ();
}
function ensureMap(){
 if(mapApi)return;
 ui.map.hidden=false;
 mapApi=MK.create(ui.map,{});
 MK.states(mapApi,{fill:'#e4ecdc',border:'#a7b8a2'});
 dyn=L.layerGroup().addTo(mapApi.map);
 setTimeout(()=>{mapApi.map.invalidateSize();mapApi.fit()},60);
}
function hideMap(){if(mapApi){try{mapApi.map.remove()}catch(e){}mapApi=null;dyn=null}ui.map.hidden=true}

function showQ(){
 const q=st.qs[st.i];
 if(!q){if(st.mode==='speed'){st.qs=st.qs.concat(IMQ.Q.types(['mcq','tf','mapName'],10));return showQ()}return finish()}
 st.answered=false;st.q=q;
 if(st.mode!=='speed')ui.bar.style.width=(100*st.i/st.total)+'%';
 ui.fb.hidden=true;ui.fb.className='qz-fb';ui.a.innerHTML='';ui.next.disabled=true;ui.skip.disabled=false;ui.next.textContent=st.i===st.total-1&&!(st.wrong&&st.wrong.length)?'Finish':'Next →';
 ui.tag.textContent=(st.title||'')+(q.retry?' · retry':'');
 ui.q.textContent=q.prompt;ui.el.querySelector('.qz-body').scrollTop=0;
 const t=q.type;
 if(t==='mapFind'||t==='mapOrigin'){ensureMap();dyn.clearLayers();mapApi.fit();
  if(q.target.kind==='river'){window._ctx=IMQ.RIVERS_WITH_GEO||(IMQ.RIVERS_WITH_GEO=window.RIVERS.filter(r=>IMQ.hasGeo(r.id)).map(r=>r.id));
   window._ctx.forEach(id=>MK.riverLine(id,{color:'#9db8c4',weight:2,opacity:.9}).addTo(dyn))}
  ui.a.innerHTML=`<div class="hint">👆 Tap the map. Pinch / scroll to zoom for accuracy.</div>`;
  mapApi.map.off('click');mapApi.map.on('click',onMapTap);}
 else if(t==='mapName'){ensureMap();dyn.clearLayers();mapApi.fit();drawHighlight(q.target);renderOpts(q)}
 else if(t==='order'){hideMap();renderOrder(q)}
 else if(t==='match'){hideMap();renderMatch(q)}
 else{hideMap();renderOpts(q)}
 if(st.mode==='speed'){ui.skip.hidden=true}
 setCombo();
}
function drawHighlight(tg){
 const hi='#e07a2f';
 if(tg.kind==='river'){MK.riverLine(tg.id,{color:hi,weight:5,opacity:1}).addTo(dyn)}
 else if(tg.kind==='range'){MK.rangeLine(RANGES.find(x=>x.id===tg.id),{color:hi,weight:8,dashArray:null}).addTo(dyn)}
 else if(tg.kind==='region'){MK.regionPoly(REGIONS.find(x=>x.id===tg.id),{color:hi,fillColor:hi,fillOpacity:.45,weight:2.5}).addTo(dyn)}
 else{MK.ring(tg.ll,70,hi).addTo(dyn);MK.dot(tg.ll,hi,9).addTo(dyn)}
}
function renderOpts(q){
 const tf=q.type==='tf';
 ui.a.innerHTML=`<div class="opts ${tf?'tf':''} ${q.options.length>4?'many':''}">${q.options.map((o,i)=>`<button class="opt" data-i="${i}"><span class="k">${tf?(o==='True'?'✓':'✗'):i+1}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
 ui.a.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answerOpt(+b.dataset.i,b));
}
function answerOpt(i,btn){
 if(st.answered)return;const q=st.q,val=q.options[i],ok=val===q.answer;
 ui.a.querySelectorAll('.opt').forEach(b=>{b.disabled=true;if(q.options[+b.dataset.i]===q.answer)b.classList.add('good')});
 if(!ok)btn.classList.add('bad');
 if(q.type==='mapName'&&mapApi){dyn.clearLayers();const g=MK.drawAnswer(mapApi,q.target,ok);g.addTo(dyn);zoomTo(q.target)}
 settle(ok,ok?'':`Answer: ${q.answer}`);
}
function onMapTap(e){
 if(st.answered)return;const q=st.q;
 const ctx=window._ctx||[];
 const r=MK.hitTest(mapApi.map,e.latlng,q.target,ctx);
 dyn.clearLayers();const g=MK.drawAnswer(mapApi,q.target,r.ok,e.latlng);g.addTo(dyn);zoomTo(q.target,true);
 st.mapTap=true;
 settle(r.ok,r.detail);
}
function zoomTo(t,keep){
 try{if(t.kind==='point'){const z=Math.max(mapApi.map.getZoom(),5.5);mapApi.map.setView(t.ll,keep?Math.max(z,5.5):z,{animate:true})}
 else{let b;if(t.kind==='river')b=MK.riverLine(t.id).getBounds();else if(t.kind==='range')b=MK.rangeLine(RANGES.find(x=>x.id===t.id)).getBounds();else b=MK.regionPoly(REGIONS.find(x=>x.id===t.id)).getBounds();mapApi.map.flyToBounds(b,{padding:[30,30],maxZoom:7,duration:.6})}}catch(e){}
}
function giveUp(){
 if(!st||st.answered)return;const q=st.q;
 if(q.type==='mapFind'||q.type==='mapOrigin'){dyn.clearLayers();MK.drawAnswer(mapApi,q.target,false).addTo(dyn);zoomTo(q.target);settle(false,'Here it is!')}
 else if(q.type==='order'){settle(false,'',{reveal:true})}
 else if(q.type==='match'){settle(false,'',{reveal:true})}
 else{ui.a.querySelectorAll('.opt').forEach(b=>{b.disabled=true;if(q.options[+b.dataset.i]===q.answer)b.classList.add('good')});if(q.type==='mapName'&&mapApi){dyn.clearLayers();MK.drawAnswer(mapApi,q.target,false).addTo(dyn);zoomTo(q.target)}settle(false,`Answer: ${q.answer}`)}
}

/* ───────── order ───────── */
function renderOrder(q){
 const picked=[];const items=shuffle(q.items);
 const draw=()=>{
  ui.a.innerHTML=`<div class="ord-lab">Your order</div><div class="ord-ans">${q.items.map((_,i)=>`<div class="slot ${picked[i]?'on':''}" data-s="${i}"><b>${i+1}</b><span>${picked[i]?esc(picked[i]):''}</span></div>`).join('')}</div>
  <div class="ord-lab">Tap items in order</div><div class="ord-pool">${items.filter(x=>!picked.includes(x)).map(x=>`<button class="chip2" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>
  <button class="btn ord-check" ${picked.length===items.length?'':'disabled'}>Check order</button>`;
  ui.a.querySelectorAll('.chip2').forEach(b=>b.onclick=()=>{if(st.answered)return;picked.push(b.dataset.v);draw()});
  ui.a.querySelectorAll('.slot.on').forEach(b=>b.onclick=()=>{if(st.answered)return;picked.splice(+b.dataset.s,1);draw()});
  const c=ui.a.querySelector('.ord-check');if(c)c.onclick=()=>checkOrder();
 };
 st.ord={picked,draw};draw();
}
function checkOrder(){
 const q=st.q,p=st.ord.picked;let right=0;
 const slots=[...ui.a.querySelectorAll('.slot')];
 q.items.forEach((x,i)=>{const ok=p[i]===x;if(ok)right++;slots[i].classList.add(ok?'good':'bad');if(!ok)slots[i].querySelector('span').innerHTML=`<s>${esc(p[i])}</s> → ${esc(x)}`});
 const ok=right===q.items.length;
 ui.a.querySelectorAll('.chip2,.ord-check').forEach(b=>b.disabled=true);
 settle(ok,ok?'':`${right}/${q.items.length} in the right place.`,{partial:right/q.items.length});
}

/* ───────── match ───────── */
function renderMatch(q){
 const L=shuffle(q.pairs.map(p=>p[0])),Rr=shuffle(q.pairs.map(p=>p[1]));const map=Object.fromEntries(q.pairs);
 let selL=null,done=0,mistakes=0;
 ui.a.innerHTML=`<div class="mt"><div class="mt-col">${L.map(x=>`<button class="mt-i" data-side="l" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="mt-col">${Rr.map(x=>`<button class="mt-i" data-side="r" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>`;
 const all=[...ui.a.querySelectorAll('.mt-i')];
 all.forEach(b=>b.onclick=()=>{
  if(st.answered||b.classList.contains('done'))return;
  if(b.dataset.side==='l'){all.filter(x=>x.dataset.side==='l').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');selL=b;return}
  if(!selL){toast('Pick an item on the left first');return}
  if(map[selL.dataset.v]===b.dataset.v){selL.classList.remove('sel');selL.classList.add('done');b.classList.add('done');selL=null;done++;sfx.ok();
   if(done===L.length){settle(mistakes===0,mistakes?`${mistakes} wrong tap${mistakes>1?'s':''}.`:'Perfect match!',{partial:Math.max(0,1-mistakes/L.length)})}}
  else{mistakes++;b.classList.add('shake');sfx.bad();vib(60);setTimeout(()=>b.classList.remove('shake'),400)}
 });
 st.mt={map,L,all};
}
function revealMatch(){const {map,all}=st.mt;all.forEach(b=>b.classList.add('done'));ui.a.insertAdjacentHTML('beforeend',`<div class="mt-rev">${Object.entries(map).map(([a,b])=>`<div><b>${esc(a)}</b> → ${esc(b)}</div>`).join('')}</div>`)}

/* ───────── scoring ───────── */
function setCombo(){ui.combo.textContent=st.combo>=2?`🔥 ×${st.combo}`:'';ui.xp.textContent=st.xp+' XP'}
function settle(ok,detail,o={}){
 if(st.answered)return;st.answered=true;const q=st.q,s=I().S;
 // retries and match/order partials
 let gain=0;
 if(ok){st.combo++;st.best=Math.max(st.best,st.combo);gain=(BASE[q.type]||10)+Math.min(st.combo-1,5)*2;if(q.retry)gain=Math.ceil(gain/2);if(st.mode==='speed')gain=5}
 else{st.combo=0;if(o.partial)gain=Math.round((BASE[q.type]||10)*o.partial*0.5)}
 st.xp+=gain;s.xp+=gain;s.total++;if(ok)s.correct++;
 const d=touchDay();d.n++;if(ok)d.ok++;d.xp+=gain;
 if(ok&&(q.type==='mapFind'||q.type==='mapOrigin'))s.mapOk=(s.mapOk||0)+1;
 if(q.id&&byId[q.id]&&!q.retry)rec(q.id,ok);
 if(ok)st.ok++;
 st.log.push({q,ok});
 if(!ok&&!q.retry&&st.mode!=='speed'){st.wrong=(st.wrong||[]);st.wrong.push(Object.assign({},q,{retry:true}))}
 save();setCombo();
 ok?(sfx.ok(),vib(15)):(sfx.bad(),vib([40,40,40]));
 if(o.reveal&&q.type==='match')revealMatch();
 if(o.reveal&&q.type==='order'){const sl=[...ui.a.querySelectorAll('.slot')];q.items.forEach((x,i)=>{sl[i].classList.add('good');sl[i].querySelector('span').textContent=x});ui.a.querySelectorAll('.chip2,.ord-check').forEach(b=>b.disabled=true)}
 // feedback
 if(st.mode==='speed'){const f=ui.fb;f.hidden=false;f.className='qz-fb '+(ok?'good':'bad');f.innerHTML=`<b>${ok?'✓':'✗'}</b> ${esc(ok?'':'Answer: '+q.answer)}`;st.speedN+=ok?1:0;setTimeout(()=>{if(st&&!st.done){st.i++;showQ()}},ok?450:1100);return}
 ui.fb.hidden=false;ui.fb.className='qz-fb '+(ok?'good':'bad');
 ui.fb.innerHTML=`<div class="fb-h">${ok?'✓ Correct':'✗ Not quite'}${gain?` <span class="gain">+${gain} XP</span>`:''}</div>${detail?`<div class="fb-d">${esc(detail)}</div>`:''}${q.why?`<div class="fb-w">${esc(q.why)}</div>`:''}`;
 ui.next.disabled=false;ui.skip.disabled=true;ui.next.focus();
 ui.fb.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function onNext(){
 if(!st||!st.answered)return;
 st.i++;
 if(st.i>=st.qs.length&&st.mode!=='speed'){
  if(st.wrong&&st.wrong.length&&!st.retried){st.retried=true;const w=st.wrong;st.wrong=[];st.qs=st.qs.concat(shuffle(w));st.total=st.qs.length;toast('Let’s retry what you missed 💪')}
  else return finish();
 }
 showQ();
}

/* ───────── finish ───────── */
function finish(){
 if(!st||st.done)return;st.done=true;if(st.timer)clearInterval(st.timer);
 const s=I().S,first=st.log.filter(x=>!x.q.retry),n=first.length||1,right=first.filter(x=>x.ok).length,acc=right/n;
 let stars=0,extra='';
 if(st.mode==='quest'&&st.deck){stars=acc>=.95?3:acc>=.8?2:acc>=.6?1:0;const prev=s.stages[st.deck]||0;if(stars>prev){s.stages[st.deck]=stars;extra=`<div class="sum-new">New best: ${'★'.repeat(stars)}</div>`}}
 if(acc===1&&n>=8)s.flawless=1;
 if(st.mode==='speed'){s.speedBest=Math.max(s.speedBest||0,st.speedN);extra=`<div class="sum-new">Best speed score: ${s.speedBest}</div>`}
 const bonus=st.mode==='speed'?0:(acc>=.8?15:0);if(bonus){s.xp+=bonus;st.xp+=bonus;touchDay().xp+=bonus}
 const oldLv=lvlOf(s.xp-st.xp),newLv=lvlOf(s.xp);
 const bs=checkBadges();save();
 if(acc>=.8||st.mode==='speed'){sfx.win();confetti(acc===1?100:50)}
 const wrongList=st.log.filter(x=>!x.ok&&!x.q.retry);
 ui.map.hidden=true;if(mapApi){try{mapApi.map.remove()}catch(e){}mapApi=null}
 ui.foot.hidden=false;ui.skip.hidden=true;ui.bar.style.width='100%';ui.xp.textContent=st.xp+' XP';ui.combo.textContent='';
 ui.tag.textContent=st.title||'';
 ui.q.textContent=st.mode==='speed'?`${st.speedN} correct in ${st.seconds||60}s`:acc>=.95?'Brilliant!':acc>=.8?'Great round!':acc>=.6?'Good progress':'Keep going — repetition wins';
 ui.a.innerHTML=`<div class="sum">
  ${st.mode==='quest'?`<div class="sum-stars">${[1,2,3].map(i=>`<span class="${i<=stars?'on':''}">★</span>`).join('')}</div>`:''}
  <div class="sum-grid"><div><b>${st.mode==='speed'?st.speedN:Math.round(acc*100)+'%'}</b><span>${st.mode==='speed'?'correct':'accuracy'}</span></div><div><b>+${st.xp}</b><span>XP</span></div><div><b>${st.best}</b><span>best combo</span></div></div>
  ${extra}${newLv>oldLv?`<div class="sum-new">⬆ Level ${newLv}: ${IMQ.lvlName(newLv)}</div>`:''}
  ${bs.map(b=>`<div class="sum-badge">${b[4]} <b>${esc(b[1])}</b> — ${esc(b[2])}</div>`).join('')}
  ${wrongList.length?`<div class="ord-lab">To remember</div><div class="sum-wrong">${wrongList.slice(0,8).map(x=>`<div><b>${esc(x.q.answer||'')}</b><span>${esc(x.q.prompt)}</span><small>${esc(x.q.why||'')}</small></div>`).join('')}</div>`:''}
 </div>`;
 ui.fb.hidden=true;ui.skip.hidden=false;ui.skip.disabled=false;ui.skip.textContent='Play again';ui.next.disabled=false;ui.next.textContent='Done';
 ui.skip.onclick=()=>{const cfg=st.again;close();if(cfg)setTimeout(()=>start(cfg()),30)};
 ui.next.onclick=()=>close();
}
window.Play={start,close,isOpen:()=>!!ui};
})();
