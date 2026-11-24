/* Views: Home · Atlas · Play (Quest + Arcade) · Learn (+ flashcards) · Me */
(function(){
const {$,$$,esc,shuffle,pick,uniq,dayKey,DAY,DECKS,WORLDS,deckById,POOL,ALL,Q,rById,short}=IMQ;
const S=()=>IMQ.S;
const GRPCOL={indus:'#2b6cb0',ganga:'#1b8f5a',brahma:'#8e44ad',east:'#d9822b',west:'#c0392b'};
const GRPNAME={indus:'Indus system',ganga:'Ganga system',brahma:'Brahmaputra & NE',east:'Peninsular east-flowing',west:'West-flowing & inland'};
const pct=x=>Math.round(x*100);
const deckMastery=d=>IMQ.mastery(IMQ.allIds(d.id));
let view='home',playTab='quest',scope='all',learnDeck=null;

/* ═════════ Home ═════════ */
function ring(n,goal){const r=34,c=2*Math.PI*r,f=Math.min(1,n/goal);return`<svg class="ring" viewBox="0 0 84 84"><circle cx="42" cy="42" r="${r}" class="rb"/><circle cx="42" cy="42" r="${r}" class="rf" style="stroke-dasharray:${c};stroke-dashoffset:${c*(1-f)}"/><text x="42" y="40" text-anchor="middle" class="rn">${n}</text><text x="42" y="55" text-anchor="middle" class="rg">/ ${goal}</text></svg>`}
function nextStage(){
 const s=S().stages;let d=DECKS.find(d=>!s[d.id]);
 if(!d)d=[...DECKS].sort((a,b)=>deckMastery(a)-deckMastery(b))[0];return d}
function weakDecks(){return DECKS.map(d=>({d,m:deckMastery(d),seen:IMQ.allIds(d.id).filter(i=>S().items[i]&&S().items[i].seen).length})).filter(x=>x.seen>0).sort((a,b)=>a.m-b.m).slice(0,3)}
function renderHome(){
 const s=S(),day=s.daily[dayKey()]||{n:0},goal=s.settings.goal||20,lv=IMQ.lvlOf(s.xp),lo=IMQ.xpForLvl(lv),hi=IMQ.xpForLvl(lv+1);
 const due=Q.dueIds().length,nd=nextStage(),hook=pick(window.HOOKS,1)[0];
 const totalIds=ALL.length,seenIds=ALL.filter(x=>s.items[x.id]&&s.items[x.id].seen).length,mastered=IMQ.learned(ALL.map(x=>x.id));
 $('#view-home').innerHTML=`
 <div class="hero">
  <div class="hero-l"><div class="eyebrow">Level ${lv} · ${IMQ.lvlName(lv)}</div><h1>Namaste, Geographer 🌏</h1>
   <div class="xpbar"><i style="width:${pct((s.xp-lo)/(hi-lo))}%"></i></div><div class="xpl"><span>${s.xp} XP</span><span>${hi-s.xp} to level ${lv+1}</span></div>
   <div class="pills"><span class="pill fire">🔥 ${IMQ.liveStreak()}-day streak</span><span class="pill">🎯 ${mastered}/${totalIds} mastered</span></div></div>
  <div class="hero-r">${ring(day.n,goal)}<small>today’s goal</small></div>
 </div>
 <button class="cta" data-act="daily"><div><b>Daily Quest</b><span>12 questions · ${due?due+' due for review + ':''}fresh picks</span></div><i>▶</i></button>
 <div class="row3">
  <button class="mini" data-act="review" ${due?'':'disabled'}><b>${due}</b><span>Review due</span></button>
  <button class="mini" data-act="speed"><b>60s</b><span>Speed round</span></button>
  <button class="mini" data-act="maptap"><b>🗺</b><span>Map drill</span></button>
 </div>
 <div class="card"><div class="card-h"><h3>Continue your Quest</h3><a data-go="play">All stages →</a></div>
  <div class="stage-line"><span class="ic">${nd.ic}</span><div><b>${nd.t}</b><small>${nd.d}</small><div class="bar"><i style="width:${pct(deckMastery(nd))}%"></i></div></div><button class="btn sm" data-stage="${nd.id}">Play</button></div></div>
 ${weakDecks().length?`<div class="card"><div class="card-h"><h3>Needs attention</h3></div>${weakDecks().map(w=>`<div class="stage-line slim"><span class="ic">${w.d.ic}</span><div><b>${w.d.t}</b><div class="bar warn"><i style="width:${pct(w.m)}%"></i></div></div><button class="btn sm ghost" data-stage="${w.d.id}">Practise</button></div>`).join('')}</div>`:''}
 ${hook?`<div class="card hook"><div class="eyebrow">Memory hook</div><b>${esc(hook.t)}</b><div class="hk-m">${esc(hook.m)}</div><div class="hk-h">${esc(hook.hook)}</div></div>`:''}
 <div class="card soft"><b>How to use this app</b><p>1) Explore the <a data-go="atlas">Atlas</a> and read a topic in <a data-go="learn">Learn</a>. 2) Play its <a data-go="play">Quest stage</a> to earn stars. 3) Come back daily — the Daily Quest brings back facts just before you forget them (spaced repetition).</p></div>`;
}

/* ═════════ Play hub ═════════ */
function scopeIds(sc){
 if(sc==='all')return DECKS.map(d=>d.id);
 if(sc.startsWith('w:'))return DECKS.filter(d=>d.world===sc.slice(2)).map(d=>d.id);
 return [sc.slice(2)];
}
function scopeSelect(){return`<label class="scope">Topic <select id="scope"><option value="all" ${scope==='all'?'selected':''}>Everything</option>${WORLDS.map(w=>`<option value="w:${esc(w)}" ${scope==='w:'+w?'selected':''}>${esc(w)}</option>`).join('')}<optgroup label="Single topic">${DECKS.map(d=>`<option value="d:${d.id}" ${scope==='d:'+d.id?'selected':''}>${d.ic} ${esc(d.t)}</option>`).join('')}</optgroup></select></label>`}
const ARCADE=[
 ['tap','🗺','Map Tap','Tap the named river, range, peak, dam…','scope'],
 ['name','🔎','Name It','A feature is highlighted — what is it?','scope'],
 ['source','🧭','Source Hunt','Tap the origin or mouth of a river.','scope'],
 ['quick','⚡','Quickfire MCQ','Fast facts: rivers, passes, peaks, dams.','scope'],
 ['lr','↔','Left or Right?','Sort tributaries by bank, east/west-flowing, ranges…',''],
 ['order','🔢','Order It','Sequence rivers, ranges, prayags, peaks by height.',''],
 ['match','🧩','Match Pairs','Dam↔river, city↔river, peak↔range…',''],
 ['tf','✅','True / False Blitz','Spot the false statement.',''],
 ['speed','⏱','Speed Round','60 seconds — how many can you get?','scope'],
 ['boss','👑','Boss Rush','20 mixed questions from every topic.',''],
 ['review','🔁','Review Due','Facts scheduled for revision now.','']
];
function renderPlay(){
 const s=S();
 const seg=`<div class="seg"><button data-pt="quest" class="${playTab==='quest'?'on':''}">Quest</button><button data-pt="arcade" class="${playTab==='arcade'?'on':''}">Arcade</button></div>`;
 let body='';
 if(playTab==='quest'){
  body=WORLDS.map((w,wi)=>`<div class="world"><h3><span>World ${wi+1}</span> ${esc(w)}</h3><div class="stages">${DECKS.filter(d=>d.world===w).map(d=>{const st=s.stages[d.id]||0,m=deckMastery(d);return`<div class="stage"><div class="stage-top"><span class="ic">${d.ic}</span><div class="stars">${[1,2,3].map(i=>`<span class="${i<=st?'on':''}">★</span>`).join('')}</div></div><b>${esc(d.t)}</b><small>${esc(d.d)}</small><div class="bar"><i style="width:${pct(m)}%"></i></div><div class="stage-b"><button class="btn sm" data-stage="${d.id}">Play</button><button class="btn sm ghost" data-learn="${d.id}">Study</button></div></div>`}).join('')}</div></div>`).join('');
 } else {
  body=`<div class="arc-top">${scopeSelect()}</div><div class="arcade">${ARCADE.map(a=>`<button class="game" data-game="${a[0]}"><span class="g-ic">${a[1]}</span><b>${a[2]}</b><small>${a[3]}</small>${a[4]?'':'<em>all topics</em>'}</button>`).join('')}</div>`;
 }
 $('#view-play').innerHTML=`<div class="sec-head"><h2>Play</h2>${seg}</div>${body}`;
}
function startCfg(cfg){cfg.again=cfg.again||(()=>cfg);Play.start(cfg)}
function empty(){IMQ.toast('No questions of that type in this topic — try another topic.','warn')}
function stage(id){
 const d=deckById[id];const make=()=>({title:d.ic+' '+d.t,mode:'quest',deck:id,qs:Q.deck(id,10,{mapBias:.4}),onClose:refresh});
 const c=make();c.again=make;Play.start(c);
}
function launch(kind){
 const ids=scopeIds(scope);let make;
 const need=(qs,cfg)=>{if(!qs.length){empty();return null}return Object.assign({onClose:refresh},cfg,{qs})};
 const M={
  tap:()=>need(Q.types(['mapFind'],10,ids),{title:'🗺 Map Tap',mode:'arcade'}),
  name:()=>need(Q.types(['mapName'],10,ids),{title:'🔎 Name It',mode:'arcade'}),
  source:()=>need(Q.types(['mapOrigin'],10,ids.filter(i=>deckById[i].type==='river').length?ids.filter(i=>deckById[i].type==='river'):DECKS.filter(d=>d.type==='river').map(d=>d.id)),{title:'🧭 Source Hunt',mode:'arcade'}),
  quick:()=>need(Q.types(['mcq','tf'],12,ids),{title:'⚡ Quickfire',mode:'arcade'}),
  lr:()=>{const sets=IMQ.bucketSets();const set=pick(sets,1)[0];const its=pick(set.items,Math.min(10,set.items.length));
   return{title:'↔ '+set.title,mode:'arcade',onClose:refresh,qs:its.map(it=>({type:'mcq',prompt:`${set.title}: ${it.t}`,options:set.classes,answer:set.classes[it.c],why:set.why||`${it.t} → ${set.classes[it.c]}`}))}},
  order:()=>({title:'🔢 Order It',mode:'arcade',onClose:refresh,qs:pick(IMQ.orderSets(),5).map(o=>({type:'order',prompt:o.prompt,items:o.items,why:'Correct order: '+o.items.join(' → ')}))}),
  match:()=>({title:'🧩 Match Pairs',mode:'arcade',onClose:refresh,qs:pick(IMQ.matchSets().filter(m=>m.pairs.length>=5),5).map(m=>{const used=new Set(),L=new Set(),pairs=[];shuffle(m.pairs).forEach(p=>{if(pairs.length<5&&!used.has(p[1])&&!L.has(p[0])){used.add(p[1]);L.add(p[0]);pairs.push(p)}});return{type:'match',prompt:m.title+' — tap an item on the left, then its partner',pairs,why:''}})}),
  tf:()=>need(Q.types(['tf'],12,['concepts']),{title:'✅ True / False',mode:'arcade'}),
  speed:()=>need(Q.types(['mcq','tf','mapName'],30,ids),{title:'⏱ Speed Round',mode:'speed',seconds:60}),
  boss:()=>({title:'👑 Boss Rush',mode:'arcade',onClose:refresh,qs:Q.mixed(20,{maxPerEnt:1})}),
  review:()=>{const qs=Q.review(15);if(!qs.length){IMQ.toast('Nothing due right now — great job! 🎉');return null}return{title:'🔁 Review',mode:'review',onClose:refresh,qs}}
 };
 const gen=M[kind];if(!gen)return;const cfg=gen();if(!cfg)return;
 cfg.again=()=>gen()||cfg;Play.start(cfg);
}
function daily(){const mk=()=>({title:'🌅 Daily Quest',mode:'daily',onClose:refresh,qs:Q.daily(12)});const c=mk();c.again=mk;Play.start(c)}

/* ═════════ Atlas ═════════ */
let atlas=null;
const LAYERS=[['rivers','Rivers','#2b7a99'],['states','States','#9fb09b'],['ranges','Ranges','#8a6a3f'],['regions','Landforms','#9a8a4a'],['peak','Peaks','#b4553a'],['pass','Passes','#7b4fa0'],['glacier','Glaciers','#4aa3c7'],['lake','Lakes','#2f8fb8'],['fall','Falls','#2aa198'],['dam','Dams','#555d66'],['city','Cities','#c27d1c'],['island','Islands','#3e8d5b'],['coast','Gulfs/Coasts','#4568a8']];
function renderAtlas(){
 const root=$('#view-atlas');
 if(atlas){setTimeout(()=>atlas.api.map.invalidateSize(),50);return}
 root.innerHTML=`<div class="atlas">
  <div class="at-bar"><input id="atq" class="search" placeholder="Search a river, peak, pass, dam…" autocomplete="off"><div id="atres" class="atres" hidden></div></div>
  <div class="chips" id="atchips">${LAYERS.map(l=>`<button class="chip" data-l="${l[0]}" style="--c:${l[2]}">${l[1]}</button>`).join('')}<button class="chip" data-l="labels">Aa Labels</button></div>
  <div class="at-map"><div id="atmap"></div><div class="legend" id="atleg"></div></div>
  <div class="at-info" id="atinfo"><div class="empty">Tap any river, mountain range, point or region on the map — or search above — to see notes, tributaries, and to start a quiz on it.</div></div></div>`;
 const api=MK.create($('#atmap'),{wheel:true});
 atlas={api,on:{rivers:true,states:true,ranges:false,regions:false,labels:false},layers:{},sel:null,selLayer:L.layerGroup().addTo(api.map)};
 MK.states(api,{fill:'#e4ecdc',border:'#a7b8a2',hover:false,onClick:(n)=>selectState(n)});
 LAYERS.forEach(l=>{if(['peak','pass','glacier','lake','fall','dam','city','island','coast'].includes(l[0]))atlas.on[l[0]]=false});
 buildAtlasLayers();syncChips();
 $('#atchips').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;const k=b.dataset.l;atlas.on[k]=!atlas.on[k];buildAtlasLayers();syncChips()};
 const q=$('#atq');q.oninput=()=>searchAtlas(q.value);q.onfocus=()=>searchAtlas(q.value);
 document.addEventListener('click',e=>{if(!e.target.closest('.at-bar'))$('#atres').hidden=true});
 setTimeout(()=>api.map.invalidateSize(),80);
}
function syncChips(){$$('#atchips .chip').forEach(b=>b.classList.toggle('on',!!atlas.on[b.dataset.l]));
 $('#atleg').innerHTML=atlas.on.rivers?Object.keys(GRPCOL).map(g=>`<span><i style="background:${GRPCOL[g]}"></i>${GRPNAME[g]}</span>`).join(''):''}
function buildAtlasLayers(){
 const A=atlas,map=A.api.map;Object.values(A.layers).forEach(l=>map.removeLayer(l));A.layers={};
 if(A.api.states){A.on.states?A.api.states.addTo(map):map.removeLayer(A.api.states);A.api.states.bringToBack()}
 const lab=A.on.labels;
 if(A.on.regions){const g=L.layerGroup();REGIONS.forEach(r=>{const p=MK.regionPoly(r,{weight:1,fillOpacity:.2}).on('click',()=>selectEntity('region',r.id));if(lab)p.bindTooltip(r.name,{permanent:true,direction:'center',className:'lbl'});else p.bindTooltip(r.name,{sticky:true});p.addTo(g)});A.layers.regions=g.addTo(map)}
 if(A.on.rivers){const g=L.layerGroup();RIVERS.forEach(r=>{if(!IMQ.hasGeo(r.id))return;const col=GRPCOL[r.grp];const ln=MK.riverLine(r.id,{color:col,weight:r.par?1.8:3,opacity:.9});const hit=MK.riverLine(r.id,{color:col,weight:16,opacity:0});[ln,hit].forEach(x=>x.on('click',e=>{L.DomEvent.stopPropagation(e);selectEntity('river',r.id)}));hit.bindTooltip(r.name,{sticky:true});g.addLayer(ln);g.addLayer(hit);
   if(lab){const lls=[...MK.riverLL(r.id)].sort((a,b)=>b.length-a.length)[0];if(lls){const m=lls[Math.floor(lls.length/2)];L.marker(m,{icon:L.divIcon({className:'rlbl',html:esc(r.name),iconSize:null}),interactive:false}).addTo(g)}}});A.layers.rivers=g.addTo(map)}
 if(A.on.ranges){const g=L.layerGroup();RANGES.forEach(r=>{const l=MK.rangeLine(r).on('click',()=>selectEntity('range',r.id));const h=MK.rangeLine(r,{weight:18,opacity:0,dashArray:null}).on('click',()=>selectEntity('range',r.id));h.bindTooltip(r.name,{sticky:true});g.addLayer(l);g.addLayer(h)});A.layers.ranges=g.addTo(map)}
 ['peak','pass','glacier','lake','fall','dam','city','island','coast'].forEach(c=>{if(!A.on[c])return;const g=L.layerGroup(),col=MK.COLORS[c];
  window.PLACES.filter(p=>p.cat===c).forEach(p=>{const m=MK.dot(p.ll,col,c==='city'?4.5:6.5).on('click',e=>{L.DomEvent.stopPropagation(e);selectEntity('place',p.id)});
   if(lab)m.bindTooltip(p.name,{permanent:true,direction:'right',className:'lbl',offset:[6,0]});else m.bindTooltip(p.name);g.addLayer(m)});A.layers[c]=g.addTo(map)});
}
function selectState(name){const s=IMQ.STATE_NAMES.find(x=>x===name);const rv=RIVERS.filter(r=>(r.states||[]).includes(name));
 atlas.selLayer.clearLayers();
 $('#atinfo').innerHTML=`<div class="info"><div class="mini-title">State / UT</div><h3>${esc(name)}</h3><p><b>Major rivers:</b> ${rv.length?rv.map(r=>`<a class="lk" data-sel="river:${r.id}">${esc(r.name)}</a>`).join(', '):'—'}</p></div>`;bindInfo()}
const ent={river:id=>RIVERS.find(r=>r.id===id),range:id=>RANGES.find(r=>r.id===id),region:id=>REGIONS.find(r=>r.id===id),place:id=>PLACES.find(p=>p.id===id)};
const PLACES=window.PLACES;
function selectEntity(kind,id,fly){
 const A=atlas,e=ent[kind](id);if(!e)return;A.sel={kind,id};A.selLayer.clearLayers();const map=A.api.map;let html='';
 if(kind==='river'){
  const r=e,kids=RIVERS.filter(x=>x.par===r.id),par=r.par?rById[r.par]:null;
  MK.riverLine(r.id,{color:'#e07a2f',weight:5,opacity:1}).addTo(A.selLayer);
  kids.filter(k=>IMQ.hasGeo(k.id)).forEach(k=>MK.riverLine(k.id,{color:'#f2b25c',weight:3,opacity:.95}).bindTooltip(k.name,{permanent:false}).on('click',()=>selectEntity('river',k.id)).addTo(A.selLayer));
  if(r.oll)MK.dot(r.oll,'#1b8f5a',8).bindTooltip('Source',{permanent:true,direction:'top',className:'ans-tip'}).addTo(A.selLayer);
  if(r.mll)MK.dot(r.mll,'#c0392b',8).bindTooltip(r.par?'Confluence':'Mouth',{permanent:true,direction:'top',className:'ans-tip'}).addTo(A.selLayer);
  const cs=PLACES.filter(p=>p.cat==='city'&&p.rv===r.name),ds=PLACES.filter(p=>p.cat==='dam'&&p.rv===r.name),fs=PLACES.filter(p=>p.cat==='fall'&&p.rv===r.name);
  [...cs,...ds,...fs].forEach(p=>MK.dot(p.ll,MK.COLORS[p.cat],5).bindTooltip(p.name+' ('+MK.CAT_LABEL[p.cat]+')').on('click',()=>selectEntity('place',p.id)).addTo(A.selLayer));
  const link=n=>{const k=RIVERS.find(x=>x.name===short(n));return k?`<a class="lk" data-sel="river:${k.id}">${esc(n)}</a>`:esc(n)};
  html=`<div class="mini-title" style="color:${GRPCOL[r.grp]}">${GRPNAME[r.grp]} · ${r.kind}${par?` · ${r.side==='L'?'left':'right'}-bank tributary of <a class="lk" data-sel="river:${par.id}">${par.name}</a>`:''}</div>
  <h3>${esc(r.name)} ${r.alt&&r.alt.length?`<small>${esc(r.alt.join(' · '))}</small>`:''}</h3>
  <div class="kv"><div><span>Origin</span><b>${esc(r.org)}</b></div><div><span>${r.par?'Joins':'Ends'}</span><b>${esc(r.into)}</b></div><div><span>Length</span><b>${esc(r.len)}</b></div><div><span>Flows</span><b>${esc(r.flow)}</b></div><div><span>States</span><b>${esc((r.states||[]).join(', '))}</b></div></div>
  ${(r.trib.L.length||r.trib.R.length)?`<div class="tribs"><div><span>Left-bank tributaries</span>${r.trib.L.map(link).join(' · ')||'—'}</div><div><span>Right-bank tributaries</span>${r.trib.R.map(link).join(' · ')||'—'}</div></div>`:''}
  ${cs.length?`<p class="pl"><span>🏙 Cities</span> ${cs.map(c=>`<a class="lk" data-sel="place:${c.id}">${esc(c.name)}</a>`).join(', ')}</p>`:''}
  ${ds.length?`<p class="pl"><span>🧱 Dams</span> ${ds.map(c=>`<a class="lk" data-sel="place:${c.id}">${esc(c.name)}</a>`).join(', ')}</p>`:''}
  ${fs.length?`<p class="pl"><span>🌈 Falls</span> ${fs.map(c=>`<a class="lk" data-sel="place:${c.id}">${esc(c.name)}</a>`).join(', ')}</p>`:''}
  <ul class="facts">${(r.clues||[]).map(c=>`<li>${esc(c)}</li>`).join('')}</ul>`;
  if(fly&&IMQ.hasGeo(r.id))map.flyToBounds(MK.riverLine(r.id).getBounds(),{padding:[30,30],maxZoom:7,duration:.7});
 } else if(kind==='range'){
  const g=e;MK.rangeLine(g,{color:'#e07a2f',weight:8,dashArray:null}).addTo(A.selLayer);
  html=`<div class="mini-title">${esc(g.grp)}</div><h3>${esc(g.name)}</h3><div class="kv"><div><span>Highest</span><b>${esc(g.hi)}</b></div><div><span>Where</span><b>${esc(g.st)}</b></div></div><p>${esc(g.info)}</p><ul class="facts">${g.clues.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>`;
  if(fly)map.flyToBounds(MK.rangeLine(g).getBounds(),{padding:[40,40],maxZoom:7,duration:.7});
 } else if(kind==='region'){
  const g=e;MK.regionPoly(g,{color:'#e07a2f',fillColor:'#e07a2f',fillOpacity:.35,weight:2.5}).addTo(A.selLayer);
  html=`<div class="mini-title">${esc(g.type)}</div><h3>${esc(g.name)}</h3><div class="kv"><div><span>Where</span><b>${esc(g.st)}</b></div></div><p>${esc(g.info)}</p><ul class="facts">${g.clues.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>`;
  if(fly)map.flyToBounds(MK.regionPoly(g).getBounds(),{padding:[30,30],maxZoom:7,duration:.7});
 } else {
  const p=e;MK.ring(p.ll,60,'#e07a2f').addTo(A.selLayer);MK.dot(p.ll,'#e07a2f',8).addTo(A.selLayer);
  const rv=p.rv&&RIVERS.find(r=>r.name===p.rv);
  html=`<div class="mini-title">${MK.CAT_LABEL[p.cat]}</div><h3>${esc(p.name)}</h3><div class="kv">${p.h?`<div><span>Height</span><b>${p.h.toLocaleString()} m</b></div>`:''}${p.rng?`<div><span>Range</span><b>${esc(p.rng)}</b></div>`:''}${p.st?`<div><span>Where</span><b>${esc(p.st)}</b></div>`:''}${p.rv?`<div><span>River</span><b>${rv?`<a class="lk" data-sel="river:${rv.id}">${esc(p.rv)}</a>`:esc(p.rv)}</b></div>`:''}</div>${p.info?`<p>${esc(p.info)}</p>`:''}${p.clues?`<ul class="facts">${p.clues.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>`:''}`;
  if(fly)map.setView(p.ll,Math.max(map.getZoom(),6),{animate:true});
 }
 const n=IMQ.ALL.filter(x=>x.ent===id).length;
 $('#atinfo').innerHTML=`<div class="info">${html}${n?`<button class="btn" data-quizme="${esc(id)}">🎯 Quiz me on this (${n} questions)</button>`:''}</div>`;
 bindInfo();
}
function bindInfo(){
 $$('#atinfo [data-sel]').forEach(a=>a.onclick=()=>{const [k,i]=a.dataset.sel.split(':');selectEntity(k,i,true)});
}
function searchAtlas(v){
 v=v.trim().toLowerCase();const box=$('#atres');if(!v){box.hidden=true;return}
 const hits=[];
 RIVERS.forEach(r=>{if([r.name,...(r.alt||[])].some(n=>n.toLowerCase().includes(v)))hits.push(['river',r.id,r.name,'River'])});
 RANGES.forEach(r=>{if(r.name.toLowerCase().includes(v))hits.push(['range',r.id,r.name,'Range'])});
 REGIONS.forEach(r=>{if(r.name.toLowerCase().includes(v))hits.push(['region',r.id,r.name,'Landform'])});
 PLACES.forEach(p=>{if(p.name.toLowerCase().includes(v))hits.push(['place',p.id,p.name,MK.CAT_LABEL[p.cat]])});
 box.hidden=false;box.innerHTML=hits.slice(0,12).map(h=>`<button data-k="${h[0]}" data-i="${h[1]}"><b>${esc(h[2])}</b><span>${h[3]}</span></button>`).join('')||'<div class="empty">No match</div>';
 box.onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k,i=b.dataset.i;
  if(k==='place'){const p=ent.place(i);if(!atlas.on[p.cat]){atlas.on[p.cat]=true;buildAtlasLayers();syncChips()}}
  if(k==='range'&&!atlas.on.ranges){atlas.on.ranges=true;buildAtlasLayers();syncChips()}
  if(k==='region'&&!atlas.on.regions){atlas.on.regions=true;buildAtlasLayers();syncChips()}
  if(k==='river'&&!atlas.on.rivers){atlas.on.rivers=true;buildAtlasLayers();syncChips()}
  selectEntity(k,i,true);box.hidden=true;$('#atq').value=''};
}

/* ═════════ Learn ═════════ */
function entName(e){return e.name}
function cardOf(d,e){
 if(d.type==='river'){const kids=RIVERS.filter(x=>x.par===e.id).map(x=>x.name);const cs=PLACES.filter(p=>(p.cat==='city'||p.cat==='dam')&&p.rv===e.name).map(p=>p.name);
  return{f:`<div class="fc-big">${esc(e.name)}</div><div class="fc-sub">${esc(e.alt&&e.alt.length?e.alt.join(' · '):GRPNAME[e.grp])}</div>`,
  b:`<div class="fc-row"><b>Origin</b> ${esc(e.org)}</div><div class="fc-row"><b>${e.par?'Joins':'Ends'}</b> ${esc(e.into)}</div><div class="fc-row"><b>Length</b> ${esc(e.len)}</div><div class="fc-row"><b>States</b> ${esc((e.states||[]).join(', '))}</div>${(e.trib.L.length||e.trib.R.length)?`<div class="fc-row"><b>Left</b> ${esc(e.trib.L.join(', ')||'—')}</div><div class="fc-row"><b>Right</b> ${esc(e.trib.R.join(', ')||'—')}</div>`:''}${cs.length?`<div class="fc-row"><b>On it</b> ${esc(cs.join(', '))}</div>`:''}<div class="fc-row hint-r">${esc((e.clues||[])[0]||'')}</div>`}}
 if(d.type==='range')return{f:`<div class="fc-big">${esc(e.name)}</div><div class="fc-sub">${esc(e.grp)}</div>`,b:`<div class="fc-row"><b>Highest</b> ${esc(e.hi)}</div><div class="fc-row"><b>Where</b> ${esc(e.st)}</div><div class="fc-row">${esc(e.info)}</div>`};
 if(d.type==='region')return{f:`<div class="fc-big">${esc(e.name)}</div><div class="fc-sub">${esc(e.type)}</div>`,b:`<div class="fc-row"><b>Where</b> ${esc(e.st)}</div><div class="fc-row">${esc(e.info)}</div>`};
 return{f:`<div class="fc-big">${esc(e.name)}</div><div class="fc-sub">${esc(MK.CAT_LABEL[e.cat])}</div>`,b:`${e.h?`<div class="fc-row"><b>Height</b> ${e.h.toLocaleString()} m</div>`:''}${e.rng?`<div class="fc-row"><b>Range</b> ${esc(e.rng)}</div>`:''}${e.rv?`<div class="fc-row"><b>River</b> ${esc(e.rv)}</div>`:''}${e.st?`<div class="fc-row"><b>Where</b> ${esc(e.st)}</div>`:''}${e.info?`<div class="fc-row">${esc(e.info)}</div>`:''}`};
}
function entitiesOfDeck(d){
 if(d.type==='river'||d.type==='range')return d.list();
 if(d.type==='region')return REGIONS.filter(r=>d.kinds.includes(r.type));
 if(d.type==='place')return PLACES.filter(p=>d.cat?p.cat===d.cat:d.cats.includes(p.cat));return[]}
function renderLearn(){
 const root=$('#view-learn');
 if(!learnDeck){
  root.innerHTML=`<div class="sec-head"><h2>Learn</h2></div><p class="sub">Read a topic, flip its flashcards, then play its Quest stage.</p>
  ${WORLDS.map(w=>`<div class="world"><h3>${esc(w)}</h3><div class="learn-list">${DECKS.filter(d=>d.world===w).map(d=>`<button class="ldeck" data-ld="${d.id}"><span class="ic">${d.ic}</span><div><b>${esc(d.t)}</b><small>${esc(d.d)}</small><div class="bar"><i style="width:${pct(deckMastery(d))}%"></i></div></div><em>${IMQ.learned(IMQ.allIds(d.id))}/${IMQ.allIds(d.id).length}</em></button>`).join('')}</div></div>`).join('')}
  <div class="world"><h3>Memory hooks</h3><div class="hooks">${window.HOOKS.map(h=>`<div class="hook-i"><b>${esc(h.t)}</b><div>${esc(h.m)}</div><em>${esc(h.hook)}</em></div>`).join('')}</div></div>`;
  return}
 const d=deckById[learnDeck];
 let list='';
 if(d.type==='concept'){list=window.CONCEPTS.map(c=>`<details class="ent"><summary>${esc(c.q)}</summary><div class="ent-b"><b>${esc(c.a)}</b><p>${esc(c.x)}</p></div></details>`).join('')}
 else{list=entitiesOfDeck(d).map(e=>{const c=cardOf(d,e);return`<details class="ent"><summary><b>${esc(e.name)}</b>${e.alt&&e.alt.length?`<small>${esc(e.alt[0])}</small>`:''}</summary><div class="ent-b">${c.b}<div class="ent-act"><button class="btn sm ghost" data-quizme="${esc(e.id)}">Quiz me</button><button class="btn sm ghost" data-atlas="${d.type}:${esc(e.id)}">Show on map</button></div></div></details>`}).join('')}
 root.innerHTML=`<div class="sec-head"><button class="back" data-lback>← Topics</button></div><div class="deck-h"><span class="ic big">${d.ic}</span><div><h2>${esc(d.t)}</h2><small>${esc(d.d)}</small></div></div>
 <div class="row2"><button class="btn" data-flash="${d.id}">🃏 Flashcards</button><button class="btn" data-stage="${d.id}">🎮 Play stage</button></div>
 <div class="bar big"><i style="width:${pct(deckMastery(d))}%"></i></div><small class="mut">${pct(deckMastery(d))}% mastery</small>
 <div class="ents">${list}</div>`;
}
function flash(id){
 const d=deckById[id];let items;
 if(d.type==='concept')items=window.CONCEPTS.map((c,i)=>({id:'c:'+i,f:`<div class="fc-q">${esc(c.q)}</div>`,b:`<div class="fc-big sm">${esc(c.a)}</div><div class="fc-row">${esc(c.x)}</div>`}));
 else items=entitiesOfDeck(d).map(e=>{const c=cardOf(d,e);return{id:(d.type==='river'?e.id+':clue':e.id+':'+(POOL[d.id].some(x=>x.id===e.id+':clue')?'clue':'find')),f:c.f,b:c.b}});
 items=shuffle(items);
 // due first
 items.sort((a,b)=>(IMQ.isDue(b.id)?1:0)-(IMQ.isDue(a.id)?1:0));
 const el=document.createElement('div');el.className='qz fcz';document.body.appendChild(el);document.body.classList.add('noscroll');
 let i=0,know=0;
 const close=()=>{el.remove();document.body.classList.remove('noscroll');refresh()};
 const draw=()=>{
  if(i>=items.length){el.innerHTML=`<div class="qz-top"><button class="qz-x">✕</button><div class="qz-prog"><i style="width:100%"></i></div><div class="qz-meta"></div></div><div class="qz-body"><div class="qz-card sum"><h2 class="qz-q">Deck complete 🎉</h2><div class="sum-grid"><div><b>${know}</b><span>got it</span></div><div><b>${items.length-know}</b><span>to revisit</span></div></div><p class="mut">Cards you marked “again” will come back in your Daily Quest.</p></div></div><div class="qz-foot"><button class="btn ghost" data-r>Again</button><button class="btn" data-x>Done</button></div>`;
   el.querySelector('.qz-x').onclick=el.querySelector('[data-x]').onclick=close;el.querySelector('[data-r]').onclick=()=>{i=0;know=0;items=shuffle(items);draw()};IMQ.confetti(40);return}
  const it=items[i];
  el.innerHTML=`<div class="qz-top"><button class="qz-x">✕</button><div class="qz-prog"><i style="width:${100*i/items.length}%"></i></div><div class="qz-meta"><b>${i+1}/${items.length}</b></div></div>
  <div class="qz-body"><div class="flip" id="flip"><div class="flip-in"><div class="flip-f">${it.f}<small class="tap">tap to flip</small></div><div class="flip-b">${it.b}</div></div></div></div>
  <div class="qz-foot"><button class="btn ghost bad" data-a disabled>Again</button><button class="btn good" data-k disabled>Got it</button></div>`;
  const fl=el.querySelector('#flip');fl.onclick=()=>{fl.classList.toggle('on');el.querySelector('[data-a]').disabled=false;el.querySelector('[data-k]').disabled=false};
  el.querySelector('.qz-x').onclick=close;
  const rate=ok=>{if(IMQ.Q.byId[it.id])IMQ.rec(it.id,ok);if(ok)know++;IMQ.touchDay();IMQ.save();i++;draw()};
  el.querySelector('[data-a]').onclick=()=>rate(false);el.querySelector('[data-k]').onclick=()=>rate(true);
 };
 draw();
}

/* ═════════ Me ═════════ */
function renderMe(){
 const s=S(),lv=IMQ.lvlOf(s.xp),acc=s.total?pct(s.correct/s.total):0;
 const days=[];for(let k=27;k>=0;k--){const key=dayKey(Date.now()-k*DAY);days.push({key,n:(s.daily[key]||{}).n||0})}
 const mx=Math.max(10,...days.map(d=>d.n));
 const weak=Object.entries(s.items).filter(([id,it])=>IMQ.Q.byId[id]&&it.bad>0).sort((a,b)=>(a[1].b-b[1].b)||(b[1].bad-a[1].bad)).slice(0,10);
 $('#view-me').innerHTML=`<div class="sec-head"><h2>Progress</h2></div>
 <div class="stats"><div><b>${lv}</b><span>level</span></div><div><b>${s.xp}</b><span>XP</span></div><div><b>${acc}%</b><span>accuracy</span></div><div><b>${s.best}</b><span>best streak</span></div><div><b>${s.total}</b><span>answered</span></div><div><b>${Object.values(s.stages).reduce((a,x)=>a+x,0)}</b><span>stars</span></div></div>
 <div class="card"><div class="card-h"><h3>Last 28 days</h3></div><div class="spark">${days.map(d=>`<i title="${d.key}: ${d.n}" style="height:${Math.max(4,100*d.n/mx)}%" class="${d.n>=(s.settings.goal||20)?'hit':''}"></i>`).join('')}</div></div>
 <div class="card"><div class="card-h"><h3>Mastery by topic</h3></div>${DECKS.map(d=>`<div class="mrow"><span>${d.ic} ${esc(d.t)}</span><div class="bar"><i style="width:${pct(deckMastery(d))}%"></i></div><b>${pct(deckMastery(d))}%</b></div>`).join('')}</div>
 <div class="card"><div class="card-h"><h3>Weak spots</h3></div>${weak.length?weak.map(([id,it])=>{const q=IMQ.Q.byId[id].make();return`<div class="weak"><b>${esc(q.answer||(q.target&&q.target.label)||'')}</b><span>${esc(q.prompt)}</span><small>${esc(q.why||'')}</small></div>`}).join(''):'<div class="empty">Nothing yet — play a few rounds and your tricky facts will collect here.</div>'}</div>
 <div class="card"><div class="card-h"><h3>Badges</h3></div><div class="badges">${IMQ.BADGES.map(b=>`<div class="badge ${s.badges[b[0]]?'on':''}" title="${esc(b[2])}"><span>${b[4]}</span><b>${esc(b[1])}</b><small>${esc(b[2])}</small></div>`).join('')}</div></div>
 <div class="card"><div class="card-h"><h3>Settings</h3></div>
  <div class="setrow"><span>Daily goal (questions)</span><select id="goal">${[10,20,30,50].map(g=>`<option ${s.settings.goal===g?'selected':''}>${g}</option>`).join('')}</select></div>
  <div class="setrow"><span>Sound & vibration</span><input type="checkbox" id="snd" ${s.sound?'checked':''}></div>
  <div class="row2"><button class="btn ghost" id="exp">⬇ Export backup</button><label class="btn ghost" for="imp">⬆ Import backup</label><input type="file" id="imp" accept=".json" hidden></div>
  <button class="btn ghost danger" id="rst">Reset all progress</button></div>
 <div class="card soft"><b>About the data</b><p class="small">Boundaries: state outlines from the open <i>india-maps-data</i> set (Census-based), simplified. River courses: Natural Earth where available, otherwise hand-placed schematic paths. Mountain axes and landform shapes are learning sketches, not survey boundaries. Facts are study notes — cross-check key figures with NCERT / your standard atlas before the exam.</p></div>`;
 $('#goal').onchange=e=>{s.settings.goal=+e.target.value;IMQ.save()};
 $('#snd').onchange=e=>{s.sound=e.target.checked;IMQ.save()};
 $('#exp').onclick=()=>{const b=new Blob([JSON.stringify(s)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='india-mapping-quest-backup-'+dayKey()+'.json';a.click()};
 $('#imp').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{IMQ.importState(JSON.parse(t));IMQ.toast('Backup restored ✓');refresh()}catch(x){IMQ.toast('That file is not a valid backup','warn')}})};
 $('#rst').onclick=()=>{if(confirm('Erase all progress on this device? This cannot be undone.')){IMQ.reset();refresh()}};
}

/* ═════════ router ═════════ */
function refresh(){render(view)}
function render(v){
 view=v;$$('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+v));$$('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.go===v));
 if(v==='home')renderHome();else if(v==='play')renderPlay();else if(v==='atlas')renderAtlas();else if(v==='learn')renderLearn();else if(v==='me')renderMe();
 window.scrollTo(0,0);
}
function go(v){if(v!=='learn')learnDeck=null;render(v)}
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-go],[data-act],[data-stage],[data-pt],[data-game],[data-ld],[data-lback],[data-flash],[data-learn],[data-atlas]');if(!t)return;
 if(t.dataset.go){go(t.dataset.go);return}
 if(t.dataset.act){const a=t.dataset.act;if(a==='daily')daily();else if(a==='review')launch('review');else if(a==='speed'){scope='all';launch('speed')}else if(a==='maptap'){scope='all';launch('tap')}return}
 if(t.dataset.stage){stage(t.dataset.stage);return}
 if(t.dataset.pt){playTab=t.dataset.pt;renderPlay();return}
 if(t.dataset.game){launch(t.dataset.game);return}
 if(t.dataset.ld){learnDeck=t.dataset.ld;renderLearn();window.scrollTo(0,0);return}
 if(t.dataset.lback!==undefined){learnDeck=null;renderLearn();return}
 if(t.dataset.flash){flash(t.dataset.flash);return}
 if(t.dataset.learn){learnDeck=t.dataset.learn;render('learn');return}
 if(t.dataset.atlas){const [k,i]=t.dataset.atlas.split(':');render('atlas');setTimeout(()=>{atlas.on.rivers=true;buildAtlasLayers();syncChips();selectEntity(k==='river'?'river':k==='range'?'range':k==='region'?'region':'place',i,true)},120);return}
});
document.addEventListener('click',e=>{const b=e.target.closest('[data-quizme]');if(!b)return;const id=b.dataset.quizme;const mk=()=>({title:'🎯 Practice',mode:'arcade',qs:shuffle(Q.ofEntity(id)).slice(0,10),onClose:refresh});const c=mk();c.again=mk;Play.start(c)});
document.addEventListener('change',e=>{if(e.target.id==='scope')scope=e.target.value});
window.Views={render,go,refresh,daily};
})();
