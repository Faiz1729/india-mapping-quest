/* Boot */
(function(){
 IMQ.touchDay;               // day rollover is handled on first answer; streak display uses liveStreak()
 Views.render('home');
 if('serviceWorker' in navigator&&location.protocol!=='file:'){
  navigator.serviceWorker.register('sw.js').catch(()=>{});
 }
 // refresh the home dashboard when the tab becomes visible again (new day, etc.)
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!Play.isOpen()&&document.getElementById('view-home').classList.contains('active'))Views.render('home')});
})();
