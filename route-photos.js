// Revierfotos: authentische Orte, mit sichtbaren Bildquellen.
(()=>{
const stops=[
  {
    "name": "Korfu · Gouvia Marina",
    "x": 218.6,
    "y": 160.9,
    "file": "Guvia marina.jpg",
    "author": "Marc Ryckaert",
    "license": "CC0",
    "licurl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Guvia_marina.jpg/960px-Guvia_marina.jpg",
    "desc": "Marina und Yachten auf Korfu – Ausgangspunkt für Törns im nördlichen Ionischen Meer.",
    "id": "corfu",
    "mapLabel": "KORFU",
    "source": "https://commons.wikimedia.org/wiki/File:Guvia_marina.jpg",
    "credit": "Marc Ryckaert · Wikimedia Commons"
  },
  {
    "name": "Paxos · Gaios",
    "x": 262.9,
    "y": 252.5,
    "file": "GaiosPaxiJuly192022 01.jpg",
    "author": "Hagai Agmon-Snir",
    "license": "CC BY-SA 4.0",
    "licurl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/GaiosPaxiJuly192022_01.jpg/960px-GaiosPaxiJuly192022_01.jpg",
    "desc": "Die vorgelagerten Inseln und die Hafeneinfahrt von Gaios vom Wasser entdecken.",
    "id": "paxos",
    "mapLabel": "PAXOS",
    "source": "https://commons.wikimedia.org/wiki/File:GaiosPaxiJuly192022_01.jpg",
    "credit": "Hagai Agmon-Snir · Wikimedia Commons"
  },
  {
    "id": "preveza",
    "name": "Preveza · Hafen in der Abenddämmerung",
    "mapLabel": "PREVEZA",
    "x": 383.5,
    "y": 312.7,
    "file": "Wharf in Preveza, Greece.jpg",
    "author": "Annatsach",
    "license": "CC BY-SA 4.0",
    "licurl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Wharf_in_Preveza,_Greece.jpg/960px-Wharf_in_Preveza,_Greece.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Wharf_in_Preveza,_Greece.jpg",
    "credit": "Annatsach · Wikimedia Commons",
    "desc": "Segelboote am Kai, warme Lichter und das letzte Blau des Abends – Prevezas Hafenpromenade am Wasser."
  },
  {
    "name": "Lefkada · Nydri",
    "x": 369.4,
    "y": 368.2,
    "file": "2018 in Lefkada, Nidri Port, b.jpg",
    "author": "Thomas Dahlstrøm Nielsen",
    "license": "CC BY-SA 4.0",
    "licurl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/2018_in_Lefkada,_Nidri_Port,_b.jpg/960px-2018_in_Lefkada,_Nidri_Port,_b.jpg",
    "desc": "Yachten vor Nydri, zwischen Lefkada und der Inselwelt um Meganisi.",
    "id": "lefkada",
    "mapLabel": "LEFKADA",
    "source": "https://commons.wikimedia.org/wiki/File:2018_in_Lefkada,_Nidri_Port,_b.jpg",
    "credit": "Thomas Dahlstrøm Nielsen · Wikimedia Commons"
  },
  {
    "id": "meganisi",
    "name": "Meganisi · Buchten zum Verlieben",
    "mapLabel": "MEGANISI",
    "x": 387.5,
    "y": 385,
    "file": "Meganisi.jpg",
    "author": "Sarantis Karydas",
    "license": "CC BY-SA 4.0",
    "licurl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Meganisi.jpg/960px-Meganisi.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Meganisi.jpg",
    "credit": "Sarantis Karydas · Wikimedia Commons",
    "desc": "Grüne Halbinseln und glasklares Wasser: Meganisis Küste gehört zu den schönsten Kulissen zwischen Lefkada und Ithaka."
  },
  {
    "name": "Atokos · One House Bay",
    "x": 400,
    "y": 428,
    "file": "Atokos.jpg",
    "author": "Matchkick",
    "src": "https://images.squarespace-cdn.com/content/v1/681417070d98617d1517af74/bf19645c-e1d6-4d83-8295-b2a69f75e7b6/Atokos%2BPig%2BBeach%2BLefkada%2BWild%2BBoars.jpg?format=1000w",
    "desc": "Atokos ist bekannt für frei laufende Schweine, die bis an die Kiesstrände kommen. Ob sie sich zeigen und ein Besuch möglich ist, hängt vom Tag und den örtlichen Bedingungen ab.",
    "id": "atokos",
    "mapLabel": "ATOKOS",
    "source": "https://www.cycladicspaces.com.au/blog/atokos-the-island-where-wild-pigs-join-your-beach-party",
    "credit": "Bildquelle: Cycladic Spaces"
  },
  {
    "id": "ithaca",
    "name": "Ithaka · Vathy & der Golf von Molos",
    "mapLabel": "ITHAKA",
    "x": 367.4,
    "y": 454.9,
    "file": "Ithaki-Vathy.jpg",
    "author": "auteur",
    "license": "CC BY-SA 2.0",
    "licurl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Ithaki-Vathy.jpg/960px-Ithaki-Vathy.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Ithaki-Vathy.jpg",
    "credit": "auteur · Wikimedia Commons",
    "desc": "Der Blick über den Golf von Molos bis zur Bucht von Vathy zeigt die grüne, weit verzweigte Küste Ithakas."
  },
  {
    "name": "Kefalonia · Fiskardo",
    "x": 331.2,
    "y": 491.1,
    "file": "Fiskardo.JPG",
    "author": "Vaso Minetou",
    "license": "CC BY-SA 3.0",
    "licurl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Fiskardo.JPG/960px-Fiskardo.JPG",
    "desc": "Bunte Häuser und Boote am Hafen von Fiskardo im Norden Kefalonias.",
    "id": "kefalonia",
    "mapLabel": "KEFALONIA",
    "source": "https://commons.wikimedia.org/wiki/File:Fiskardo.JPG",
    "credit": "Vaso Minetou · Wikimedia Commons"
  },
  {
    "name": "Zakynthos · Navagio",
    "x": 413.6,
    "y": 597.1,
    "file": "Navagio Beach. View of the Shipwreck Beach.jpg",
    "author": "Andrzej Rękas",
    "license": "CC BY-SA 4.0",
    "licurl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Navagio_Beach._View_of_the_Shipwreck_Beach.jpg/960px-Navagio_Beach._View_of_the_Shipwreck_Beach.jpg",
    "desc": "Weiße Felsen, türkisfarbenes Meer und das berühmte Wrack. Historische Aufnahme; Zugang und Anlanden können eingeschränkt sein.",
    "id": "zakynthos",
    "mapLabel": "ZAKYNTHOS",
    "source": "https://commons.wikimedia.org/wiki/File:Navagio_Beach._View_of_the_Shipwreck_Beach.jpg",
    "credit": "Andrzej Rękas · Wikimedia Commons"
  },
  {
    "id": "rio-antirrio",
    "name": "Rio-Antirrio-Brücke",
    "mapLabel": "RIO-ANTIRRIO-BRÜCKE",
    "x": 589,
    "y": 467,
    "file": "Rio-Antirrio Bridge.jpg",
    "author": "Erik Drost",
    "license": "CC BY 2.0",
    "licurl": "https://creativecommons.org/licenses/by/2.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Rio-Antirrio_Bridge.jpg/960px-Rio-Antirrio_Bridge.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Rio-Antirrio_Bridge.jpg",
    "credit": "Erik Drost · Wikimedia Commons",
    "desc": "Die eleganten Pylone der Rio-Antirrio-Brücke überspannen die Meerenge bei Patras – ein besonderer Anblick auf dem Weg in den Golf von Korinth."
  },
  {
    "id": "corinth",
    "name": "Korinth-Kanal · An Bord der Valeria",
    "mapLabel": "KORINTH-KANAL",
    "x": 829.7,
    "y": 554.9,
    "src": "images/favoriten/A4-IMG_8507.webp",
    "source": "#corinth",
    "credit": "Herman & Valeria · Originalaufnahme",
    "desc": "Unser Blick von der Valeria zwischen den steilen Felswänden des Korinth-Kanals. Eine Passage, die lange in Erinnerung bleibt."
  },
  {
    "id": "athens",
    "name": "Athen · Sonnenuntergang in Alimos",
    "mapLabel": "ATHEN / ALIMOS",
    "x": 972.4,
    "y": 565.8,
    "file": "Sunset at Alimos Marina, Athens.jpg",
    "author": "s9-4pr",
    "license": "CC BY 2.0",
    "licurl": "https://creativecommons.org/licenses/by/2.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Sunset_at_Alimos_Marina,_Athens.jpg/960px-Sunset_at_Alimos_Marina,_Athens.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Sunset_at_Alimos_Marina,_Athens.jpg",
    "credit": "s9-4pr · Wikimedia Commons",
    "desc": "Masten im Abendlicht an der Athener Riviera. Von Alimos aus beginnt die Inselwelt des Saronischen Golfs."
  },
  {
    "id": "poros",
    "name": "Poros · Hafen & Altstadt",
    "mapLabel": "POROS",
    "x": 928.2,
    "y": 664.6,
    "file": "Griechenland Insel Poros Hafen.JPG",
    "author": "ArnoWinter",
    "license": "CC BY 3.0",
    "licurl": "https://creativecommons.org/licenses/by/3.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Griechenland_Insel_Poros_Hafen.JPG/960px-Griechenland_Insel_Poros_Hafen.JPG",
    "source": "https://commons.wikimedia.org/wiki/File:Griechenland_Insel_Poros_Hafen.JPG",
    "credit": "ArnoWinter · Wikimedia Commons",
    "desc": "Pastellfarbene Häuser am Hang und Boote direkt vor der Altstadt – Poros zeigt seine schönste Seite vom Wasser."
  },
  {
    "name": "Hydra · Hafen",
    "x": 926.2,
    "y": 700.8,
    "file": "Hydra harbour.jpg",
    "author": "didi46",
    "license": "CC BY-SA 3.0",
    "licurl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Hydra_harbour.jpg",
    "desc": "Der Hafen von Hydra: dicht beieinander liegende Boote und die Häuser am Hang.",
    "id": "hydra",
    "mapLabel": "HYDRA",
    "source": "https://commons.wikimedia.org/wiki/File:Hydra_harbour.jpg",
    "credit": "didi46 · Wikimedia Commons"
  },
  {
    "id": "ermioni",
    "name": "Ermioni · Am Wasser zu Hause",
    "mapLabel": "ERMIONI",
    "x": 883.9,
    "y": 693.5,
    "file": "Ermioni 12.jpg",
    "author": "Donarreiskoffer",
    "license": "CC BY-SA 4.0",
    "licurl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Ermioni_12.jpg/960px-Ermioni_12.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Ermioni_12.jpg",
    "credit": "Donarreiskoffer · Wikimedia Commons",
    "desc": "Zwischen der bewaldeten Halbinsel Bisti und dem Meer liegt Ermioni – ein Küstenort für einen entspannten Abend am Wasser."
  },
  {
    "id": "spetses",
    "name": "Spetses · Der alte Hafen",
    "mapLabel": "SPETSES",
    "x": 865.9,
    "y": 720,
    "file": "The old port of Spetses.jpg",
    "author": "Camerawalker",
    "license": "CC BY 3.0",
    "licurl": "https://creativecommons.org/licenses/by/3.0/",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/The_old_port_of_Spetses.jpg/960px-The_old_port_of_Spetses.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:The_old_port_of_Spetses.jpg",
    "credit": "Camerawalker · Wikimedia Commons",
    "desc": "Boote, sanfte Abendfarben und Häuser rund um das Wasser: der alte Hafen von Spetses als stimmungsvoller Abschluss im Saronischen Revier."
  }
];
window.valeriaRoutePhotos=stops;
const svg=document.getElementById('ionian-map'),route=document.getElementById('valeria-route');
const select=document.getElementById('routeStop'),pause=document.getElementById('routePause');
const panel=document.querySelector('.route-photo-panel'),image=document.getElementById('routePhoto');
if(!svg||!route||!select||!pause||!panel||!image)return;
const length=route.getTotalLength(),ns='http://www.w3.org/2000/svg';
const pins=document.createElementNS(ns,'g');pins.setAttribute('aria-label','Fotostationen');svg.append(pins);
let active=null,paused=false,request=0;
for(const stop of stops){
 select.add(new Option(stop.name,stop.id));
 let best=Infinity;for(let n=0;n<=3000;n++){const p=route.getPointAtLength(length*n/3000),d=(p.x-stop.x)**2+(p.y-stop.y)**2;if(d<best){best=d;stop.fraction=n/3000}}
 const pin=document.createElementNS(ns,'g');pin.classList.add('route-stop');pin.setAttribute('role','button');pin.setAttribute('tabindex','0');pin.setAttribute('aria-label',stop.name);pin.dataset.stop=stop.id;
 const hit=document.createElementNS(ns,'circle');hit.setAttribute('cx',stop.x);hit.setAttribute('cy',stop.y);hit.setAttribute('r','16');hit.setAttribute('fill','transparent');
 const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',stop.x);dot.setAttribute('cy',stop.y);dot.setAttribute('r','5');dot.classList.add('photo-stop-pin');
 const title=document.createElementNS(ns,'title');title.textContent=stop.name;pin.append(title,hit,dot);pins.append(pin);stop.pin=pin;
 pin.addEventListener('click',()=>seek(stop));pin.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();seek(stop)}});
 const label=[...svg.querySelectorAll('.place')].find(t=>t.textContent===stop.mapLabel);
 if(label){label.classList.add('route-stop-label');label.addEventListener('click',()=>seek(stop));}
}
function show(stop){
 if(active===stop)return;active=stop;const token=++request;
 select.value=stop.id;panel.setAttribute('aria-busy','true');panel.classList.add('is-loading');
 stops.forEach(s=>{s.pin.classList.toggle('active',s===stop);s.pin.setAttribute('aria-pressed',String(s===stop))});
 const incoming=new Image();incoming.decoding='async';
 function display(loaded){
  if(token!==request)return;
  image.hidden=!loaded;image.alt=stop.name;image.dataset.stop=stop.id;if(loaded)image.src=stop.src;
  document.getElementById('routePhotoTitle').textContent=stop.name;
  document.getElementById('routePhotoText').textContent=stop.desc;
  const source=document.getElementById('routePhotoSource');source.href=stop.source;source.textContent=stop.credit;
  const license=document.getElementById('routePhotoLicense');license.hidden=!stop.license;license.textContent=stop.license||'';
  if(stop.licurl)license.href=stop.licurl;else license.removeAttribute('href');
  document.getElementById('routeCreditSeparator').hidden=!stop.license;
  document.getElementById('routePhotoError').hidden=loaded;
  panel.setAttribute('aria-busy','false');panel.classList.remove('is-loading');
  if(loaded){const next=stops[(stops.indexOf(stop)+1)%stops.length];const prefetch=new Image();prefetch.src=next.src;}
 }
 incoming.onload=()=>display(true);incoming.onerror=()=>display(false);incoming.src=stop.src;
}
function setPaused(value){paused=value;pause.textContent=paused?'Weitersegeln':'Pause';pause.setAttribute('aria-pressed',String(paused));window.dispatchEvent(new CustomEvent('valeria-route-pause',{detail:paused}));}
function seek(stop){setPaused(true);window.dispatchEvent(new CustomEvent('valeria-route-seek',{detail:stop.fraction}));show(stop)}
select.addEventListener('change',()=>seek(stops.find(s=>s.id===select.value)));pause.addEventListener('click',()=>setPaused(!paused));
window.addEventListener('valeria-route-position',e=>{
 if(paused)return;let nearest=stops[0],best=Infinity;
 for(const stop of stops){const d=Math.abs(stop.fraction-e.detail.fraction);if(d<best){best=d;nearest=stop}}
 show(nearest);
});show(stops[0]);
})();
