// Use the same credited destination photographs as the route map.
(()=>{
 const panel=document.getElementById('selectedTripPreview');
 if(!panel)return;
 const boat={name:'Valeria · Elba 45',src:'images/valeria-segel-offener-steuerstand.webp'};
 const deck={name:'An Bord der Valeria',src:'images/valeria-platz-am-meer.webp'};
 function photosFor(trip){
  const name=trip.title_de||'';
  let ids=[];
  if(name.includes('→'))ids=['athens','kefalonia'];
  else if(name.includes('Porto Rafti'))return [boat,deck];
  else if(name.includes('Athen'))ids=['athens','poros'];
  else if(name.includes('Argostoli'))ids=['kefalonia','ithaca'];
  else if(name.includes('Zakynthos'))ids=['zakynthos','kefalonia'];
  else if(name.includes('Nydri'))ids=['lefkada','meganisi'];
  else if(name.includes('Preveza'))ids=['preveza','lefkada'];
  else if(name.includes('Korfu'))ids=['corfu','paxos'];
  const photos=ids.map(id=>(window.valeriaRoutePhotos||[]).find(p=>p.id===id)).filter(Boolean);
  return photos.length?photos:[boat,deck];
 }
 function show({trip,lang}){
  panel.replaceChildren();panel.hidden=!trip;if(!trip)return;
  const title=document.createElement('h3');title.textContent=trip['title_'+lang]||trip.title_de;
  const dates=document.createElement('p');dates.className='selected-trip-dates';dates.textContent=tripDates(trip)+' · '+availabilityText(trip);
  const note=document.createElement('p');note.className='selected-trip-note';
  note.textContent={de:'Einblicke ins Revier und an Bord. Die genaue Route stimmen wir gemeinsam ab.',en:'A glimpse of the sailing area and life aboard. We plan the exact route together.',ru:'Акватория и жизнь на борту. Точный маршрут согласуем вместе.'}[lang];
  const pictures=document.createElement('div');pictures.className='selected-trip-pictures';
  for(const photo of photosFor(trip)){
   const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');
   img.src=photo.src;img.alt=photo.name;img.loading='lazy';img.decoding='async';
   img.addEventListener('error',()=>{img.hidden=true;});
   const label=document.createElement('span');label.textContent=photo.name;caption.append(label);
   if(photo.source){const credit=document.createElement('a');credit.href=photo.source;credit.target='_blank';credit.rel='noopener';credit.textContent=photo.credit||photo.author;caption.append(credit);}
   if(photo.licurl){const license=document.createElement('a');license.href=photo.licurl;license.target='_blank';license.rel='noopener';license.textContent=photo.license;caption.append(license);}
   figure.append(img,caption);pictures.append(figure);
  }
  panel.append(title,dates,pictures,note);
 }
 window.addEventListener('valeria-trip-selected',e=>show(e.detail));
 updateTripSelection();
})();
