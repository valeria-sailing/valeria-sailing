(() => {
  const header=document.querySelector('.nav');
  const toggle=document.getElementById('navToggle');
  const menu=document.getElementById('nav');
  if(!header||!toggle||!menu)return;
  function close(){header.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Menü öffnen')}
  toggle.addEventListener('click',()=>{const open=header.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen')});
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  document.addEventListener('click',e=>{if(!header.contains(e.target))close()});
  window.matchMedia('(min-width: 901px)').addEventListener('change',close);
})();
