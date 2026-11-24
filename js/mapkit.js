/* MapKit: Leaflet helpers — blank-canvas India map (no tiles, fully offline), hit-testing for lines/polygons/points. */
(function(){
const {RIVERS,RANGES,REGIONS,PLACES}=window;
const GEO=window.GEO_RIVERS;
const rad=d=>d*Math.PI/180;
const km=(a,b)=>{const R=6371,dLat=rad(b[0]-a[0]),dLon=rad(b[1]-a[1]);const x=Math.sin(dLat/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(x))};
const COLORS={river:'#2b7a99',riverDim:'#9db8c4',range:'#8a6a3f',peak:'#b4553a',pass:'#7b4fa0',glacier:'#4aa3c7',lake:'#2f8fb8',fall:'#2aa198',dam:'#555d66',city:'#c27d1c',island:'#3e8d5b',coast:'#4568a8',region:'#9a8a4a',good:'#1b8f5a',bad:'#c0392b'};
const CAT_LABEL={peak:'Peak',pass:'Pass',glacier:'Glacier',lake:'Lake / wetland',fall:'Waterfall',dam:'Dam / barrage',city:'City',island:'Island',coast:'Gulf / strait / coast'};

function create(el,{zoom=4,interactive=true,wheel=false}={}){
 const map=L.map(el,{zoomControl:interactive,attributionControl:false,zoomSnap:.25,zoomDelta:.5,minZoom:3.5,maxZoom:10,preferCanvas:true,scrollWheelZoom:wheel,dragging:true,tap:true,doubleClickZoom:interactive,boxZoom:false,keyboard:false});
 map.setMaxBounds([[2,60],[41,104]]);
 const fit=()=>map.fitBounds([[7.2,68.0],[36.0,97.6]],{padding:[4,4],animate:false});
 fit();
 const api={map,fit,states:null,reset(){fit()}};
 return api;
}
function states(api,{fill='#dfe8d8',border='#9fb09b',weight:w=1,hover=false,labels=false,onClick}={}){
 if(api.states)api.states.remove();
 api.states=L.geoJSON(window.GEO_STATES,{style:()=>({color:border,weight:w,fillColor:fill,fillOpacity:.95}),
  onEachFeature:(f,l)=>{if(labels)l.bindTooltip(f.properties.name,{sticky:true});if(onClick)l.on('click',e=>onClick(f.properties.name,e));
   if(hover){l.on('mouseover',()=>l.setStyle({fillColor:'#cfe0c6'}));l.on('mouseout',()=>l.setStyle({fillColor:fill}))}}}).addTo(api.map);
 api.states.bringToBack();
 return api.states;
}
const riverLL=id=>GEO[id]||[];
function riverLine(id,style){return L.polyline(riverLL(id),Object.assign({color:COLORS.river,weight:2.2,opacity:.9,lineCap:'round',lineJoin:'round',smoothFactor:1},style))}
function rangeLine(g,style){return L.polyline(g.line,Object.assign({color:COLORS.range,weight:5,opacity:.85,lineCap:'round',dashArray:'1 9'},style))}
function regionPoly(g,style){return L.polygon(g.poly,Object.assign({color:COLORS.region,weight:1.5,fillColor:COLORS.region,fillOpacity:.28},style))}
function dot(ll,color,r=6,extra){return L.circleMarker(ll,Object.assign({radius:r,color:'#fff',weight:1.5,fillColor:color,fillOpacity:1},extra))}
function ring(ll,radiusKm,color){return L.circle(ll,{radius:radiusKm*1000,color,weight:2,fillColor:color,fillOpacity:.12,dashArray:'4 4'})}

/* geometry */
function distPtSeg(p,a,b){const dx=b.x-a.x,dy=b.y-a.y;const l2=dx*dx+dy*dy;let t=l2?((p.x-a.x)*dx+(p.y-a.y)*dy)/l2:0;t=Math.max(0,Math.min(1,t));return Math.hypot(p.x-(a.x+t*dx),p.y-(a.y+t*dy))}
function distToLinesPx(map,pt,lines){let best=1e9;for(const ln of lines){let prev=null;for(const c of ln){const q=map.latLngToContainerPoint(c);if(prev)best=Math.min(best,distPtSeg(pt,prev,q));prev=q}}return best}
function inPoly(lat,lon,poly){let ins=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [yi,xi]=poly[i],[yj,xj]=poly[j];if(((yi>lat)!==(yj>lat))&&(lon<(xj-xi)*(lat-yi)/(yj-yi)+xi))ins=!ins}return ins}
function distToPolyPx(map,pt,poly){return distToLinesPx(map,pt,[poly.concat([poly[0]])])}
function kmPerPx(map){const c=map.getCenter(),p=map.latLngToContainerPoint(c),q=L.point(p.x+100,p.y),ll=map.containerPointToLatLng(q);return km([c.lat,c.lng],[ll.lat,ll.lng])/100}
function nearestRiver(map,latlng,ids,maxPx=22){
 const pt=map.latLngToContainerPoint(latlng);let best=null,bd=1e9;
 for(const id of ids){const d=distToLinesPx(map,pt,riverLL(id));if(d<bd){bd=d;best=id}}
 return bd<=maxPx?{id:best,px:bd}:null;
}

/* hit test a click against a target; returns {ok,detail} */
function hitTest(map,latlng,target,riverIds){
 const pt=map.latLngToContainerPoint(latlng),ll=[latlng.lat,latlng.lng];
 if(target.kind==='river'){const d=distToLinesPx(map,pt,riverLL(target.id));
  if(d<=22)return{ok:true,detail:'On the river!'};
  const n=nearestRiver(map,latlng,riverIds||[],22);
  return{ok:false,detail:n?`You tapped near the ${RIVERS.find(r=>r.id===n.id).name}.`:'Not near any river line.'}}
 if(target.kind==='range'){const g=RANGES.find(x=>x.id===target.id);const d=distToLinesPx(map,pt,[g.line]);return{ok:d<=26,detail:d<=26?'Right on the range axis.':'Missed the range axis.'}}
 if(target.kind==='region'){const g=REGIONS.find(x=>x.id===target.id);const inside=inPoly(ll[0],ll[1],g.poly),d=distToPolyPx(map,pt,g.poly);return{ok:inside||d<=12,detail:inside?'Inside the region.':'Outside the region.'}}
 const dist=km([latlng.lat,latlng.lng],target.ll);const tol=Math.max(target.rad,14*kmPerPx(map));
 return{ok:dist<=tol,km:Math.round(dist),detail:dist<=tol?`≈${Math.round(dist)} km away — within range.`:`≈${Math.round(dist)} km away.`};
}
function drawAnswer(api,target,ok,userLL){
 const g=L.layerGroup().addTo(api.map);const col=ok?COLORS.good:COLORS.bad;let center=null;
 if(target.kind==='river'){const l=riverLine(target.id,{color:COLORS.good,weight:5,opacity:1}).addTo(g);center=l.getBounds().getCenter()}
 else if(target.kind==='range'){const gr=RANGES.find(x=>x.id===target.id);const l=rangeLine(gr,{color:COLORS.good,weight:7,dashArray:null,opacity:.9}).addTo(g);center=l.getBounds().getCenter()}
 else if(target.kind==='region'){const gr=REGIONS.find(x=>x.id===target.id);const l=regionPoly(gr,{color:COLORS.good,fillColor:COLORS.good,fillOpacity:.4,weight:2.5}).addTo(g);center=l.getBounds().getCenter()}
 else{ring(target.ll,Math.max(target.rad,10),COLORS.good).addTo(g);dot(target.ll,COLORS.good,8).addTo(g);if(target.river){riverLine(target.river,{color:COLORS.river,weight:3.5,opacity:.95}).addTo(g)}center=L.latLng(target.ll)}
 if(target.label&&center)L.tooltip({permanent:true,direction:'top',className:'ans-tip',offset:[0,-6]}).setLatLng(center).setContent(target.label).addTo(g);
 if(userLL){dot([userLL.lat,userLL.lng],col,6).addTo(g);if(target.kind==='point')L.polyline([[userLL.lat,userLL.lng],target.ll],{color:col,weight:2,dashArray:'5 5'}).addTo(g)}
 return g;
}
window.MK={create,states,riverLine,rangeLine,regionPoly,dot,ring,hitTest,drawAnswer,nearestRiver,km,kmPerPx,riverLL,inPoly,COLORS,CAT_LABEL};
})();
