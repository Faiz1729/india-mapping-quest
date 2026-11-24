/* Core: utilities, persistent store, spaced repetition (Leitner), XP / levels / badges. */
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=(a,n)=>shuffle(a).slice(0,n);
const uniq=a=>[...new Set(a)];
const DAY=86400000;
const dayKey=(t=Date.now())=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

/* ───────── store ───────── */
const KEY='imq2_state';
const blank=()=>({v:2,xp:0,total:0,correct:0,streak:0,best:0,lastDay:'',freezes:0,sound:true,daily:{},items:{},stages:{},badges:{},hist:[],settings:{goal:20}});
let S;
function load(){try{S=Object.assign(blank(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){S=blank()}
 // one-time migration from v1 progress
 try{const old=JSON.parse(localStorage.getItem('imq_v1_progress')||'null');if(old&&!S.migrated){S.xp+=old.xp||0;S.total+=old.played||0;S.correct+=old.correct||0;S.migrated=1}}catch(e){}
 return S}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
load();

/* ───────── SRS ───────── */
const INTERVALS=[0,1,2,5,12,30]; // days per box
function item(id){return S.items[id]||(S.items[id]={b:0,due:0,seen:0,ok:0,bad:0,last:0})}
function rec(id,ok){
 const it=item(id);it.seen++;it.last=Date.now();
 if(ok){it.ok++;it.b=Math.min(5,it.b+1)}else{it.bad++;it.b=Math.max(0,it.b-2)}
 it.due=ok?Date.now()+INTERVALS[it.b]*DAY:Date.now();
 return it}
const isDue=id=>{const it=S.items[id];return it&&it.due<=Date.now()&&it.seen>0};
const mastery=ids=>{if(!ids.length)return 0;let s=0;ids.forEach(i=>{const it=S.items[i];if(it)s+=it.b/5});return s/ids.length};
const learned=ids=>ids.filter(i=>S.items[i]&&S.items[i].b>=3).length;

/* ───────── XP / levels ───────── */
const LEVELS=['Wanderer','Trailblazer','Cartographer','Surveyor','Geographer','Atlas Keeper','Dhruva (Pole Star)','Bhugol Guru'];
const lvlOf=xp=>Math.floor(Math.sqrt(xp/60))+1;
const xpForLvl=l=>60*(l-1)*(l-1);
const lvlName=l=>LEVELS[Math.min(LEVELS.length-1,Math.floor((l-1)/2))];

function touchDay(){
 const d=dayKey();
 if(S.lastDay!==d){
  const y=dayKey(Date.now()-DAY);
  if(S.lastDay===y)S.streak++; else if(S.lastDay&&dayKey(Date.now()-2*DAY)===S.lastDay&&S.freezes>0){S.freezes--;S.streak++} else S.streak=1;
  S.best=Math.max(S.best,S.streak);S.lastDay=d;
 }
 S.daily[d]=S.daily[d]||{n:0,ok:0,xp:0};return S.daily[d]}
function liveStreak(){const d=dayKey(),y=dayKey(Date.now()-DAY);return(S.lastDay===d||S.lastDay===y)?S.streak:0}

/* ───────── badges ───────── */
const BADGES=[
 ['first','First Step','Answer your first question',s=>s.total>=1,'🌱'],
 ['c100','Century','100 correct answers',s=>s.correct>=100,'💯'],
 ['c500','Scholar','500 correct answers',s=>s.correct>=500,'📚'],
 ['s3','On a Roll','3-day streak',s=>s.best>=3,'🔥'],
 ['s7','Week Warrior','7-day streak',s=>s.best>=7,'⚡'],
 ['s30','Unstoppable','30-day streak',s=>s.best>=30,'🏔'],
 ['stars10','Star Collector','Earn 10 stars in the Quest',s=>Object.values(s.stages).reduce((a,x)=>a+x,0)>=10,'⭐'],
 ['stars30','Constellation','Earn 30 stars in the Quest',s=>Object.values(s.stages).reduce((a,x)=>a+x,0)>=30,'🌟'],
 ['perfect','Flawless','Finish a round with 100%',s=>!!s.flawless,'🎯'],
 ['speed','Quick Draw','Score 15+ in a Speed Round',s=>(s.speedBest||0)>=15,'⏱'],
 ['mapper','Pathfinder','Get 25 map-tap answers right',s=>(s.mapOk||0)>=25,'🧭'],
 ['l5','Level 5','Reach level 5',s=>lvlOf(s.xp)>=5,'🎖'],
 ['l10','Level 10','Reach level 10',s=>lvlOf(s.xp)>=10,'🏆']
];
function checkBadges(){const out=[];BADGES.forEach(b=>{if(!S.badges[b[0]]&&b[3](S)){S.badges[b[0]]=Date.now();out.push(b)}});return out}

/* ───────── effects ───────── */
let ac;
function beep(f,d=0.12,t='sine',v=0.06){if(!S.sound)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(ac.destination);o.start();g.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+d);o.stop(ac.currentTime+d)}catch(e){}}
const sfx={ok(){beep(660,.09);setTimeout(()=>beep(880,.12),90)},bad(){beep(220,.2,'triangle')},win(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.15),i*110))},tick(){beep(440,.04)}};
const vib=p=>{try{S.sound&&navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function toast(msg,cls=''){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}
 const el=document.createElement('div');el.className='toast-i '+cls;el.innerHTML=msg;t.appendChild(el);setTimeout(()=>el.classList.add('in'),10);setTimeout(()=>{el.classList.remove('in');setTimeout(()=>el.remove(),300)},2800)}
function confetti(n=60){const c=document.createElement('div');c.className='confetti';document.body.appendChild(c);const cols=['#e49a54','#1b6655','#d9edb7','#5e9bb0','#c0563b','#f2d36b'];
 for(let i=0;i<n;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'vw';p.style.background=cols[i%cols.length];p.style.animationDelay=Math.random()*.4+'s';p.style.transform='rotate('+Math.random()*360+'deg)';c.appendChild(p)}setTimeout(()=>c.remove(),2600)}

window.IMQ=Object.assign(window.IMQ||{},{ $,$$,esc,shuffle,pick,uniq,DAY,dayKey,slug,
 get S(){return S},save,load,item,rec,isDue,mastery,learned,lvlOf,xpForLvl,lvlName,LEVELS,touchDay,liveStreak,BADGES,checkBadges,sfx,vib,toast,confetti,
 reset(){S=blank();save()},
 importState(j){S=Object.assign(blank(),j);save()}});
})();
