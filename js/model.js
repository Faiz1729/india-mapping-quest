/* Model: decks + question generators (every question is built fresh so options reshuffle). */
(function(){
const {shuffle,pick,uniq,slug,isDue}=IMQ;
const R=window.RIVERS, PL=window.PLACES, RG=window.RANGES, RE=window.REGIONS, GEO=window.GEO_RIVERS||{};
const STATE_NAMES=window.GEO_STATES.features.map(f=>f.properties.name);
const rById={};R.forEach(r=>rById[r.id]=r);
const hasGeo=id=>!!(GEO[id]&&GEO[id].length);
const byCat=c=>PL.filter(p=>p.cat===c);
const short=s=>String(s).replace(/\s*\(.*?\)\s*/g,'').trim();
const sameGrp=r=>R.filter(x=>x.grp===r.grp&&x.id!==r.id);
const RADIUS={peak:110,pass:90,glacier:100,lake:90,fall:90,dam:80,city:70,island:110,coast:140};
const LENGTH={ganga:2525,godavari:1465,krishna:1400,yamuna:1376,narmada:1312,mahanadi:858,kaveri:800,brahmani:799,tapi:724,pennar:597,mahi:583,periyar:244,sabarmati:371,beas:470};

/* ── decks ── */
const DECKS=[
 {id:'indus',t:'Indus System',ic:'🏔',world:'Rivers of India',d:'Indus, Jhelum, Chenab, Ravi, Beas, Sutlej, Zanskar',type:'river',list:()=>R.filter(r=>r.grp==='indus')},
 {id:'ganga',t:'Ganga System',ic:'🪔',world:'Rivers of India',d:'Ganga, Yamuna, Chambal, Son, Gandak, Kosi, Damodar…',type:'river',list:()=>R.filter(r=>r.grp==='ganga')},
 {id:'brahma',t:'Brahmaputra & North-East',ic:'🌊',world:'Rivers of India',d:'Brahmaputra, Teesta, Manas, Subansiri, Barak…',type:'river',list:()=>R.filter(r=>r.grp==='brahma')},
 {id:'east',t:'Peninsular East-flowing',ic:'🌅',world:'Rivers of India',d:'Mahanadi, Godavari, Krishna, Kaveri, Pennar…',type:'river',list:()=>R.filter(r=>r.grp==='east')},
 {id:'west',t:'West-flowing & Inland',ic:'🌇',world:'Rivers of India',d:'Narmada, Tapi, Mahi, Luni, Periyar, Mandovi…',type:'river',list:()=>R.filter(r=>r.grp==='west')},
 {id:'ranges',t:'Mountain Ranges',ic:'⛰',world:'Mountains',d:'Himalayan divisions, Aravalli, Vindhya, Satpura, Ghats',type:'range',list:()=>RG},
 {id:'peaks',t:'Peaks',ic:'🗻',world:'Mountains',d:'Kangchenjunga, Nanda Devi, Anamudi, Guru Shikhar…',type:'place',cat:'peak'},
 {id:'passes',t:'Passes',ic:'🛤',world:'Mountains',d:'Himalayan passes and Western Ghat gaps',type:'place',cat:'pass'},
 {id:'glaciers',t:'Glaciers',ic:'🧊',world:'Mountains',d:'Siachen, Gangotri, Zemu, Pindari…',type:'place',cat:'glacier'},
 {id:'plateaus',t:'Plateaus & Valleys',ic:'🏜',world:'Landforms',d:'Deccan, Malwa, Chota Nagpur, Meghalaya, Kashmir valley…',type:'region',kinds:['plateau','valley']},
 {id:'plains',t:'Plains, Deserts & Coasts',ic:'🌾',world:'Landforms',d:'Indo-Gangetic plain, Thar, Konkan, Malabar, Coromandel…',type:'region',kinds:['plain','desert','coast']},
 {id:'islands',t:'Islands, Gulfs & Straits',ic:'🏝',world:'Landforms',d:'Andaman, Lakshadweep, Palk Strait, Rann of Kachchh…',type:'place',cats:['island','coast']},
 {id:'lakes',t:'Lakes & Wetlands',ic:'💧',world:'Water bodies',d:'Wular, Chilika, Sambhar, Loktak, Vembanad…',type:'place',cat:'lake'},
 {id:'falls',t:'Waterfalls',ic:'🌈',world:'Water bodies',d:'Kunchikal, Jog, Dudhsagar, Chitrakote…',type:'place',cat:'fall'},
 {id:'dams',t:'Dams & Barrages',ic:'🧱',world:'Water bodies',d:'Tehri, Bhakra, Hirakud, Sardar Sarovar, Nagarjuna Sagar…',type:'place',cat:'dam'},
 {id:'cities',t:'Cities on Rivers',ic:'🏙',world:'Water bodies',d:'Which city stands on which river',type:'place',cat:'city'},
 {id:'concepts',t:'Concepts & Rules',ic:'🧠',world:'Final Exam',d:'Drainage patterns, Panch Prayag, treaties, waterways…',type:'concept'}
];
const WORLDS=uniq(DECKS.map(d=>d.world));
const deckById={};DECKS.forEach(d=>deckById[d.id]=d);

function entitiesOf(d){
 if(d.type==='river')return d.list();
 if(d.type==='range')return d.list();
 if(d.type==='region')return RE.filter(r=>d.kinds.includes(r.type));
 if(d.type==='place')return PL.filter(p=>d.cat?p.cat===d.cat:d.cats.includes(p.cat));
 return [];
}

/* ── distractor helpers ── */
function opts(correct,pool,n=4){
 const wrong=shuffle(uniq(pool.filter(x=>x!==correct&&x!=null&&x!=='')));
 return shuffle([correct,...wrong.slice(0,n-1)]);
}
const stNames=()=>STATE_NAMES;
const riverNames=()=>R.map(r=>r.name);
const geoRivers=()=>R.filter(r=>hasGeo(r.id));
const tribList=r=>[...(r.trib.L||[]),...(r.trib.R||[])].filter(t=>!/^Panjnad/.test(t)).map(short);
const TRIBPOOL=uniq(R.flatMap(r=>tribList(r)).concat(riverNames()));
const why=(parts)=>parts.filter(Boolean).join(' ');

/* ── river questions ── */
function riverQs(r){
 const out=[],id=r.id,peers=sameGrp(r),all=R.filter(x=>x.id!==id);
 const riverFacts=()=>why([`${r.name}${r.alt&&r.alt.length?' ('+r.alt[0]+')':''}: rises at ${r.org}; ${r.into?'ends at '+r.into+'.':''}`,r.len?'Length '+r.len+'.':'']);
 if(hasGeo(id)){
  out.push({id:id+':find',type:'mapFind',tag:'river',make:()=>({prompt:`Tap the ${r.name} river on the map.`,target:{kind:'river',id,label:r.name},why:riverFacts()})});
  out.push({id:id+':name',type:'mapName',tag:'river',make:()=>{const dist=shuffle(peers.filter(x=>hasGeo(x.id))).concat(shuffle(geoRivers().filter(x=>x.grp!==r.grp&&x.id!==id))).slice(0,3).map(x=>x.name);
   return{prompt:'Which river is highlighted on the map?',target:{kind:'river',id,label:r.name},options:shuffle([r.name,...dist]),answer:r.name,why:riverFacts()}}});
 }
 if(r.oll){
  out.push({id:id+':orgmap',type:'mapOrigin',tag:'river',make:()=>({prompt:`Tap the origin (source) of the ${r.name}.`,target:{kind:'point',ll:r.oll,rad:140,label:r.name+' source',river:hasGeo(id)?id:null},why:`${r.name} rises at ${r.org}.`})});
  out.push({id:id+':org',type:'mcq',tag:'river',make:()=>({prompt:`Where does the ${r.name} originate?`,options:opts(r.org,peers.map(x=>x.org).concat(all.map(x=>x.org))),answer:r.org,why:riverFacts()})});
  out.push({id:id+':orgrev',type:'mcq',tag:'river',make:()=>({prompt:`Which river rises at: ${r.org}?`,options:opts(r.name,peers.map(x=>x.name).concat(riverNames())),answer:r.name,why:riverFacts()})});
 }
 if(r.mll&&hasGeo(id)&&!r.par){
  out.push({id:id+':mouth',type:'mapOrigin',tag:'river',make:()=>({prompt:`Tap where the ${r.name} ends (mouth / outfall).`,target:{kind:'point',ll:r.mll,rad:150,label:r.name+' mouth',river:id},why:`${r.name} ends at: ${r.into}.`})});
 }
 if(r.into)out.push({id:id+':into',type:'mcq',tag:'river',make:()=>({prompt:r.par?`The ${r.name} joins which river — and where?`:`Where does the ${r.name} end?`,options:opts(r.into,peers.map(x=>x.into).concat(all.map(x=>x.into))),answer:r.into,why:riverFacts()})});
 const clues=r.clues||[];
 if(clues.length)out.push({id:id+':clue',type:'mcq',tag:'river',make:()=>{const c=pick(clues,1)[0];return{prompt:`Which river?  “${c}”`,options:opts(r.name,peers.map(x=>x.name).concat(riverNames())),answer:r.name,why:riverFacts()}}});
 const tl=tribList(r);
 if(tl.length)out.push({id:id+':trib',type:'mcq',tag:'river',make:()=>{const t=pick(tl,1)[0];return{prompt:`Which of these is a tributary of the ${r.name}?`,options:opts(t,TRIBPOOL.filter(x=>!tl.includes(x)&&x!==r.name)),answer:t,why:`Tributaries of ${r.name}: Left bank — ${(r.trib.L||[]).join(', ')||'—'}. Right bank — ${(r.trib.R||[]).join(', ')||'—'}.`}}});
 if(r.par&&r.side){
  const p=rById[r.par];
  out.push({id:id+':side',type:'mcq',tag:'river',make:()=>({prompt:`The ${r.name} is a ___ tributary of the ${p.name}.`,options:['Left-bank','Right-bank'],answer:r.side==='L'?'Left-bank':'Right-bank',why:`Banks are named facing downstream. ${p.name} — Left: ${(p.trib.L||[]).join(', ')}. Right: ${(p.trib.R||[]).join(', ')}.`})});
 }
 if(r.states&&r.states.length)out.push({id:id+':state',type:'mcq',tag:'river',make:()=>{const s=pick(r.states,1)[0];return{prompt:`The ${r.name} flows through which of these states/UTs?`,options:opts(s,stNames().filter(x=>!r.states.includes(x))),answer:s,why:`${r.name} flows through: ${r.states.join(', ')}.`}}});
 const cs=PL.filter(p=>p.cat==='city'&&p.rv===r.name);
 if(cs.length)out.push({id:id+':city',type:'mcq',tag:'river',make:()=>{const c=pick(cs,1)[0];return{prompt:`Which city lies on the banks of the ${r.name}?`,options:opts(c.name,byCat('city').filter(x=>x.rv!==r.name).map(x=>x.name)),answer:c.name,why:`Cities on ${r.name}: ${cs.map(x=>x.name).join(', ')}.`}}});
 const ds=PL.filter(p=>p.cat==='dam'&&p.rv===r.name);
 if(ds.length)out.push({id:id+':dam',type:'mcq',tag:'river',make:()=>{const d=pick(ds,1)[0];return{prompt:`Which dam/barrage is built on the ${r.name}?`,options:opts(d.name,byCat('dam').filter(x=>x.rv!==r.name).map(x=>x.name)),answer:d.name,why:`Dams on ${r.name}: ${ds.map(x=>x.name).join(', ')}.`}}});
 if(r.alt&&r.alt.length)out.push({id:id+':alt',type:'mcq',tag:'river',make:()=>{const a=pick(r.alt,1)[0];return{prompt:`Which river is also known as “${a}”?`,options:opts(r.name,peers.map(x=>x.name).concat(riverNames())),answer:r.name,why:`${r.name} — also called: ${r.alt.join(', ')}.`}}});
 return out;
}

/* ── generic place / range / region questions ── */
function placeQs(p){
 const out=[],cat=p.cat,pool=byCat(cat);
 const facts=()=>why([`${p.name}${p.st?' — '+p.st:''}.`,p.info]);
 if(cat!=='city'){
  out.push({id:p.id+':find',type:'mapFind',tag:cat,make:()=>({prompt:`Tap ${p.name} on the map.`,target:{kind:'point',ll:p.ll,rad:RADIUS[cat]||100,label:p.name,id:p.id},why:facts()})});
  out.push({id:p.id+':name',type:'mapName',tag:cat,make:()=>({prompt:'Which feature is marked on the map?',target:{kind:'point',ll:p.ll,rad:0,label:p.name,id:p.id},options:opts(p.name,pool.map(x=>x.name)),answer:p.name,why:facts()})});
 } else {
  out.push({id:p.id+':find',type:'mapFind',tag:cat,make:()=>({prompt:`Tap ${p.name} on the map.`,target:{kind:'point',ll:p.ll,rad:RADIUS.city,label:p.name,id:p.id},why:`${p.name} lies on the ${p.rv} (${p.st}).`})});
 }
 if(p.rv&&(cat==='dam'||cat==='city'||cat==='fall'))out.push({id:p.id+':river',type:'mcq',tag:cat,make:()=>{
   const rvs=uniq(pool.map(x=>x.rv).filter(Boolean));
   return{prompt:cat==='city'?`${p.name} stands on the banks of which river?`:(cat==='dam'?`${p.name} is built on which river?`:`${p.name} is formed by which river?`),options:opts(p.rv,rvs.concat(riverNames())),answer:p.rv,why:facts()}}});
 if(p.st&&cat!=='city')out.push({id:p.id+':st',type:'mcq',tag:cat,make:()=>({prompt:`${p.name} is located in/at:`,options:opts(p.st,pool.map(x=>x.st).concat(stNames())),answer:p.st,why:facts()})});
 if(p.clues&&p.clues.length)out.push({id:p.id+':clue',type:'mcq',tag:cat,make:()=>({prompt:`Identify: “${pick(p.clues,1)[0]}”`,options:opts(p.name,pool.map(x=>x.name)),answer:p.name,why:facts()})});
 if(cat==='peak')out.push({id:p.id+':rng',type:'mcq',tag:cat,make:()=>({prompt:`${p.name} (${p.h.toLocaleString()} m) belongs to which range?`,options:opts(p.rng,pool.map(x=>x.rng)),answer:p.rng,why:facts()})});
 if(cat==='pass'&&p.rng)out.push({id:p.id+':rng',type:'mcq',tag:cat,make:()=>({prompt:`${p.name} crosses which range?`,options:opts(p.rng,pool.map(x=>x.rng)),answer:p.rng,why:facts()})});
 return out;
}
function rangeQs(g){
 const out=[],facts=()=>why([`${g.name} (${g.grp}). Highest: ${g.hi}. ${g.st}.`,g.info]);
 out.push({id:g.id+':find',type:'mapFind',tag:'range',make:()=>({prompt:`Tap the ${g.name} on the map.`,target:{kind:'range',id:g.id,label:g.name},why:facts()})});
 out.push({id:g.id+':name',type:'mapName',tag:'range',make:()=>({prompt:'Which mountain range is highlighted?',target:{kind:'range',id:g.id,label:g.name},options:opts(g.name,RG.filter(x=>x.grp===g.grp).map(x=>x.name).concat(RG.map(x=>x.name))),answer:g.name,why:facts()})});
 out.push({id:g.id+':clue',type:'mcq',tag:'range',make:()=>({prompt:`Identify: “${pick(g.clues,1)[0]}”`,options:opts(g.name,RG.map(x=>x.name)),answer:g.name,why:facts()})});
 out.push({id:g.id+':hi',type:'mcq',tag:'range',make:()=>({prompt:`Highest point / peak of the ${g.name}:`,options:opts(g.hi,RG.map(x=>x.hi)),answer:g.hi,why:facts()})});
 return out;
}
function regionQs(g){
 const out=[],pool=RE.filter(x=>x.type===g.type),facts=()=>why([`${g.name} — ${g.st}.`,g.info]);
 out.push({id:g.id+':find',type:'mapFind',tag:'region',make:()=>({prompt:`Tap the ${g.name} on the map.`,target:{kind:'region',id:g.id,label:g.name},why:facts()})});
 out.push({id:g.id+':name',type:'mapName',tag:'region',make:()=>({prompt:'Which region is highlighted?',target:{kind:'region',id:g.id,label:g.name},options:opts(g.name,pool.map(x=>x.name).concat(RE.map(x=>x.name))),answer:g.name,why:facts()})});
 out.push({id:g.id+':clue',type:'mcq',tag:'region',make:()=>({prompt:`Identify: “${pick(g.clues,1)[0]}”`,options:opts(g.name,pool.map(x=>x.name).concat(RE.map(x=>x.name))),answer:g.name,why:facts()})});
 out.push({id:g.id+':st',type:'mcq',tag:'region',make:()=>({prompt:`${g.name} lies mainly in:`,options:opts(g.st,RE.map(x=>x.st)),answer:g.st,why:facts()})});
 return out;
}
function conceptQs(){
 const out=[];
 CONCEPTS.forEach((c,i)=>out.push({id:'c:'+i,type:'mcq',tag:'concept',make:()=>({prompt:c.q,options:shuffle([c.a,...c.w]),answer:c.a,why:c.x})}));
 TRUEFALSE.forEach((c,i)=>out.push({id:'t:'+i,type:'tf',tag:'concept',make:()=>({prompt:c.s,options:['True','False'],answer:c.t?'True':'False',why:c.x})}));
 return out;
}

/* ── pools ── */
const POOL={};   // deckId -> descriptors
DECKS.forEach(d=>{
 let ds=[];
 if(d.type==='concept')ds=conceptQs();
 else entitiesOf(d).forEach(e=>{ds=ds.concat(d.type==='river'?riverQs(e):d.type==='range'?rangeQs(e):d.type==='region'?regionQs(e):placeQs(e))});
 ds.forEach(x=>{x.deck=d.id;x.ent=x.id.split(':')[0]});
 POOL[d.id]=ds;
});
const allIds=id=>POOL[id].map(x=>x.id);
const ALL=DECKS.flatMap(d=>POOL[d.id]);
const byId={};ALL.forEach(x=>byId[x.id]=x);

/* ── selection: prefers due → unseen → weak, spreads over entities ── */
function weight(x){
 const it=IMQ.S.items[x.id];
 if(!it||!it.seen)return 2.2;
 if(it.due<=Date.now())return 3+((5-it.b)/5)*2;
 return 0.3+(5-it.b)*0.25;
}
function choose(descs,n,{types,maxPerEnt=2,mapBias=0}={}){
 let pool=descs;if(types)pool=pool.filter(x=>types.includes(x.type));
 const scored=pool.map(x=>({x,s:Math.random()*weight(x)*(x.type.startsWith('map')?1+mapBias:1)})).sort((a,b)=>b.s-a.s);
 const out=[],cnt={};
 for(const {x} of scored){if(out.length>=n)break;if((cnt[x.ent]||0)>=maxPerEnt)continue;cnt[x.ent]=(cnt[x.ent]||0)+1;out.push(x)}
 for(const {x} of scored){if(out.length>=n)break;if(!out.includes(x))out.push(x)}
 return out;
}
function build(descs){return descs.map(d=>{const q=d.make();q.id=d.id;q.deck=d.deck;q.type=d.type;q.tag=d.tag;return q})}
const Q={
 deck:(id,n=10,o={})=>build(choose(POOL[id],n,o)),
 decks:(ids,n=10,o={})=>build(choose(ids.flatMap(i=>POOL[i]),n,o)),
 mixed:(n=10,o={})=>build(choose(ALL,n,o)),
 types:(types,n=10,ids=null)=>build(choose((ids?ids.flatMap(i=>POOL[i]):ALL),n,{types,maxPerEnt:1})),
 dueIds:()=>ALL.filter(x=>isDue(x.id)).map(x=>x.id),
 review:(n=12)=>{const due=ALL.filter(x=>isDue(x.id));return build(choose(due,n,{maxPerEnt:3}))},
 daily:(n=12)=>{const due=ALL.filter(x=>isDue(x.id));const a=choose(due,Math.min(6,n),{maxPerEnt:2});const rest=choose(ALL.filter(x=>!a.includes(x)),n-a.length,{mapBias:.5});return build(shuffle(a.concat(rest)))},
 byId,
 ofEntity:(ent)=>build(ALL.filter(x=>x.ent===ent))
};

/* ── order / bucket / match generators ── */
const ORDERS=[
 {t:'Punjab rivers',p:'Arrange the five rivers of Punjab from WEST to EAST',items:['Jhelum','Chenab','Ravi','Beas','Sutlej']},
 {t:'Punjab doabs',p:'Arrange the doabs of Punjab from WEST to EAST',items:['Sindh Sagar','Chaj','Rachna','Bari','Bist (Jalandhar)']},
 {t:'Ganga left bank',p:'Ganga’s left-bank tributaries, WEST to EAST',items:['Ramganga','Gomti','Ghaghara','Gandak','Kosi','Mahananda']},
 {t:'Panch Prayag',p:'Panch Prayag from UPSTREAM to DOWNSTREAM (by the river that joins the Alaknanda)',items:['Vishnuprayag','Nandaprayag','Karnaprayag','Rudraprayag','Devprayag']},
 {t:'Himalaya',p:'Himalayan divisions from SOUTH to NORTH',items:['Shiwalik','Lesser Himalaya','Great Himalaya (Himadri)','Trans-Himalaya']},
 {t:'East coast rivers',p:'East-flowing rivers from NORTH to SOUTH (by mouth)',items:['Subarnarekha','Mahanadi','Godavari','Krishna','Pennar','Kaveri','Vaigai']},
 {t:'West coast rivers',p:'West-flowing rivers from NORTH to SOUTH (by mouth)',items:['Sabarmati','Mahi','Narmada','Tapi','Mandovi','Sharavati','Periyar']},
 {t:'Ghats hills',p:'Western Ghats hills from NORTH to SOUTH',items:['Nilgiri','Anamalai','Cardamom','Agasthyamalai']},
 {t:'Peninsular ranges',p:'Arrange from NORTH to SOUTH',items:['Aravalli','Vindhya','Satpura','Western Ghats']},
 {t:'Brahmaputra',p:'Names of the Brahmaputra from SOURCE to MOUTH',items:['Tsangpo (Tibet)','Siang / Dihang (Arunachal)','Brahmaputra (Assam)','Jamuna (Bangladesh)']}
];
function orderSets(){
 const sets=ORDERS.map(o=>({title:o.t,prompt:o.p,items:o.items,id:'o:'+slug(o.t)}));
 // computed: peaks by height (descending)
 const peaks=byCat('peak').filter(p=>p.h);
 for(let k=0;k<3;k++){const s=shuffle(peaks).slice(0,5).sort((a,b)=>b.h-a.h);let ok=true;for(let i=1;i<s.length;i++)if(s[i-1].h-s[i].h<150)ok=false;if(ok)sets.push({title:'Peaks by height',prompt:'Arrange these peaks from TALLEST to SHORTEST',items:s.map(p=>p.name),id:'o:peaks'+k})}
 // rivers by length (descending)
 const L=Object.keys(LENGTH).map(id=>({n:rById[id].name,l:LENGTH[id]}));
 for(let k=0;k<3;k++){const s=shuffle(L).slice(0,5).sort((a,b)=>b.l-a.l);let ok=true;for(let i=1;i<s.length;i++)if(s[i-1].l/s[i].l<1.12)ok=false;if(ok)sets.push({title:'Rivers by length',prompt:'Arrange these rivers from LONGEST to SHORTEST (length in India)',items:s.map(x=>x.n),id:'o:len'+k})}
 return sets;
}
function bucketSets(){
 const sides=(rid,title)=>{const r=rById[rid];return{id:'b:'+rid,title,classes:['Left-bank','Right-bank'],items:[...(r.trib.L||[]).map(t=>({t:short(t),c:0})),...(r.trib.R||[]).map(t=>({t:short(t),c:1}))],why:`Banks are named facing downstream.`}};
 const sets=[sides('ganga','Ganga tributaries'),sides('brahmaputra','Brahmaputra tributaries'),sides('krishna','Krishna tributaries'),sides('godavari','Godavari tributaries'),sides('narmada','Narmada tributaries'),sides('kaveri','Kaveri tributaries'),sides('mahanadi','Mahanadi tributaries')];
 const pen=R.filter(r=>r.kind==='Peninsular'&&['east','west'].includes(r.grp)&&!r.par&&r.id!=='luni');
 sets.push({id:'b:flow',title:'East- or west-flowing?',classes:['East-flowing (Bay of Bengal)','West-flowing (Arabian Sea)'],items:pen.map(r=>({t:r.name,c:r.grp==='east'?0:1}))});
 sets.push({id:'b:kind',title:'Himalayan or Peninsular river?',classes:['Himalayan','Peninsular'],items:R.filter(r=>!r.par||r.id==='chambal'||r.id==='betwa'||r.id==='ken'||r.id==='son').map(r=>({t:r.name,c:r.kind==='Himalayan'?0:1}))});
 const rgc=g=>g.grp==='Peninsular'?2:g.grp==='Purvanchal'?1:0;
 sets.push({id:'b:ranges',title:'Which mountain system?',classes:['Himalaya (incl. Trans-Himalaya)','Purvanchal (eastern hills)','Peninsular'],items:RG.map(g=>({t:g.name,c:rgc(g)}))});
 const regOf=s=>/Jammu|Ladakh|J&K/.test(s)?0:/Himachal/.test(s)?1:/Uttarakhand/.test(s)?2:/Sikkim|Arunachal/.test(s)?3:4;
 sets.push({id:'b:passes',title:'Where is this pass?',classes:['J&K / Ladakh','Himachal Pradesh','Uttarakhand','Sikkim / Arunachal','Western Ghats (Kerala/TN/Maharashtra)'],items:byCat('pass').map(p=>({t:p.name,c:regOf(p.st)}))});
 return sets;
}
function matchSets(){
 const mk=(title,arr,l,r)=>({title,pairs:arr.filter(x=>l(x)&&r(x)).map(x=>[l(x),r(x)])});
 return [
  mk('River ↔ Origin',R.filter(r=>r.oll&&!r.par||r.oll&&r.par&&r.org),x=>x.name,x=>x.org),
  mk('Dam ↔ River',byCat('dam'),x=>x.name,x=>x.rv),
  mk('City ↔ River',byCat('city'),x=>x.name,x=>x.rv),
  mk('Waterfall ↔ River',byCat('fall').filter(x=>x.rv&&!/Cherrapunji|Budhabalanga/.test(x.rv)),x=>x.name,x=>x.rv),
  mk('Pass ↔ State/Region',byCat('pass'),x=>x.name,x=>x.st),
  mk('Peak ↔ Range',byCat('peak'),x=>x.name,x=>x.rng),
  mk('Lake ↔ State',byCat('lake'),x=>x.name,x=>x.st),
  mk('Glacier ↔ State',byCat('glacier'),x=>x.name,x=>x.st),
  mk('Tributary ↔ Confluence',R.filter(r=>r.conf),x=>x.name,x=>x.conf),
  mk('Range ↔ Highest point',RG,x=>x.name,x=>x.hi)
 ];
}

window.IMQ=Object.assign(window.IMQ,{DECKS,WORLDS,deckById,POOL,ALL,Q,hasGeo,rById,orderSets,bucketSets,matchSets,STATE_NAMES,short,allIds,tribList});
})();
