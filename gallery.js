const valeriaPhotos=[
 {id:'000062',de:'Unsere Valeria – Elba 45',en:'Our Valeria – Elba 45',ru:'Наша Valeria – Elba 45'},
 {id:'000245',de:'Unterwegs an der Felsküste',en:'Along the rocky coast',ru:'Вдоль скалистого берега'},
 {id:'000330',de:'Gemeinsam am Bug',en:'Together at the bow',ru:'Вместе на носу катамарана'},
 {id:'000148',de:'Sonnenuntergang vor Anker',en:'Sunset at anchor',ru:'Закат на якорной стоянке'},
 {id:'000085',de:'Entspannen im Cockpit',en:'Relaxing in the cockpit',ru:'Отдых в кокпите'},
 {id:'000614',de:'Baden in türkisblauem Wasser',en:'Swimming in turquoise water',ru:'Купание в бирюзовой воде'},
 {id:'000538',de:'Erinnerungen vom Mittelmeer',en:'Memories from the Mediterranean',ru:'Воспоминания о Средиземном море'},
 {id:'000825',de:'Ein Sprung ins Meer',en:'A dip in the sea',ru:'Купание в море'},
 {id:'000269',de:'Ein Drink mit Meerblick',en:'Drinks with a sea view',ru:'Напитки с видом на море'},
 {id:'000924',de:'Zeit zum Genießen',en:'Time to unwind',ru:'Время для отдыха'}
];
const galleryGrid=document.getElementById('galleryGrid'), photoModal=document.getElementById('photoModal'),modalPhoto=document.getElementById('modalPhoto');
function renderGallery(){const l=window.lang||document.documentElement.lang||'de';galleryGrid.replaceChildren();valeriaPhotos.forEach((o,i)=>{const btn=document.createElement('button');btn.className='gallery-item';btn.type='button';const img=document.createElement('img');img.src='images/'+o.id+'.webp';img.alt=o[l]||o.de;img.loading=i<3?'eager':'lazy';const label=document.createElement('span');label.textContent=o[l]||o.de;btn.append(img,label);btn.onclick=()=>{modalPhoto.src=img.src;modalPhoto.alt=img.alt;photoModal.classList.add('open')};galleryGrid.append(btn)})}
document.getElementById('closePhoto').onclick=()=>photoModal.classList.remove('open');photoModal.addEventListener('click',e=>{if(e.target===photoModal)photoModal.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')photoModal.classList.remove('open')});document.getElementById('lang').addEventListener('change',()=>setTimeout(renderGallery,0));renderGallery();
