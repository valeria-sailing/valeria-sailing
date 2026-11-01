const fields=['title_de','title_en','title_ru','start_date','end_date','price_eur','available_places','published'];
function validate(b){
  if(typeof b.title_de!=='string'||!b.title_de.trim()||b.title_de.length>200)return 'Titel fehlt';
  if(!/^\d{4}-\d{2}-\d{2}$/.test(b.start_date)||!/^\d{4}-\d{2}-\d{2}$/.test(b.end_date)||b.end_date<b.start_date)return 'Datum ungültig';
  if(!Number.isInteger(b.price_eur)||b.price_eur<0||b.price_eur>100000)return 'Preis ungültig';
  if(b.available_places!==null&&(!Number.isInteger(b.available_places)||b.available_places<0||b.available_places>4))return 'Kojen 0–4 oder unbekannt';
  if(![0,1].includes(b.published))return 'Sichtbarkeit ungültig';
  return null;
}
export async function onRequestGet({env}){const {results}=await env.DB.prepare('SELECT * FROM trips ORDER BY start_date').all();return Response.json(results,{headers:{'Cache-Control':'no-store'}})}
export async function onRequestPost({request,env}){let b;try{b=await request.json()}catch{return Response.json({error:'JSON ungültig'},{status:400})}const err=validate(b);if(err)return Response.json({error:err},{status:400});const id=crypto.randomUUID();await env.DB.prepare('INSERT INTO trips (id,title_de,title_en,title_ru,start_date,end_date,price_eur,available_places,published) VALUES (?,?,?,?,?,?,?,?,?)').bind(id,...fields.map(k=>b[k]??(k==='published'?0:null))).run();return Response.json({id},{status:201})}
export async function onRequestPut({request,env}){let b;try{b=await request.json()}catch{return Response.json({error:'JSON ungültig'},{status:400})}const err=validate(b);if(err||typeof b.id!=='string')return Response.json({error:err||'ID fehlt'},{status:400});const res=await env.DB.prepare('UPDATE trips SET title_de=?,title_en=?,title_ru=?,start_date=?,end_date=?,price_eur=?,available_places=?,published=? WHERE id=?').bind(...fields.map(k=>b[k]??(k==='published'?0:null)),b.id).run();return Response.json({ok:res.meta.changes>0},{status:res.meta.changes?200:404})}
export async function onRequestDelete({request,env}){let b;try{b=await request.json()}catch{return Response.json({error:'JSON ungültig'},{status:400})}if(!b.id)return Response.json({error:'ID fehlt'},{status:400});const req=await env.DB.prepare('SELECT COUNT(*) n FROM requests WHERE trip_id=?').bind(b.id).first();if(req?.n)return Response.json({error:'Törn hat Anfragen. Bitte stattdessen deaktivieren.'},{status:409});await env.DB.prepare('DELETE FROM trips WHERE id=?').bind(b.id).run();return Response.json({ok:true})}
