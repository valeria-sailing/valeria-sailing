// Geographic overview only: these pins do not promise a stop on any particular trip.
(function(){if(typeof L==='undefined')return;const el=document.getElementById('regionMap');if(!el)return;
const map=L.map(el,{scrollWheelZoom:false}).setView([38.82,21.1],7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
const places=[['Korfu / Corfu',39.6243,19.9217],['Paxos',39.199,20.163],['Preveza',38.958,20.751],['Lefkada / Nydri',38.709,20.715],['Meganisi',38.663,20.778],['Ithaka / Ithaca',38.366,20.717],['Kefalonia / Argostoli',38.176,20.49],['Zakynthos',37.787,20.899],['Korinth-Kanal / Corinth Canal',37.934,22.984],['Athen / Athens',37.942,23.649],['Porto Rafti',37.888,24.010]];
places.forEach(([name,lat,lng])=>L.circleMarker([lat,lng],{radius:name.includes('Korinth')?8:6,color:'#fff',weight:2,fillColor:name.includes('Korinth')?'#be9860':'#0e5162',fillOpacity:1}).bindPopup(name).addTo(map));
map.fitBounds([[37.63,19.65],[40.00,24.32]],{padding:[20,20]});
})();