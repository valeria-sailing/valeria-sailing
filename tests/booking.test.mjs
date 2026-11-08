import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
const root=new URL('../',import.meta.url);
async function load(path){
  const source=(await readFile(new URL(path,root),'utf8')).replace(/^import \{ sendICloud \} from .*;$/m,'const sendICloud=async()=>false;');
  return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
}
const admin=await load('functions/api/admin/requests.js');
const trips=await load('functions/api/trips.js');
const editTrips=await load('functions/api/admin/trips.js');
const requests=await load('functions/api/requests.js');
const db=new DatabaseSync(':memory:');
db.exec(await readFile(new URL('schema.sql',root),'utf8'));
const env={ENABLE_REQUESTS:'true',DB:{prepare(sql){
  let args=[];
  return {bind(...values){args=values;return this},async first(){return db.prepare(sql).get(...args)||null},
    async all(){return {results:db.prepare(sql).all(...args)}},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}}}};
}}};
const trip=(id,places)=>db.prepare("INSERT INTO trips VALUES (?, 'Törn', '', '', '2027-06-01', '2027-06-07',1500,?,1)").run(id,places);
const req=(id,guests)=>Number(db.prepare("INSERT INTO requests(trip_id,name,email,guests,kind) VALUES (?,'Gast',?,?,'inquiry')").run(id,crypto.randomUUID()+'@example.com',guests).lastInsertRowid);
const patch=(id,status)=>admin.onRequestPatch({env,request:new Request('https://example.com',{method:'PATCH',body:JSON.stringify({id,status})})});
const remaining=async id=>(await (await trips.onRequestGet({env})).json()).find(t=>t.id===id).available_places;
trip('unknown',null);const unknown=req('unknown',2);assert.equal((await patch(unknown,'approved')).status,409);
trip('normal',4);const a=req('normal',2);assert.equal((await patch(a,'approved')).status,200);assert.equal(await remaining('normal'),2);
assert.equal((await patch(a,'approved')).status,200);assert.equal(await remaining('normal'),2);
assert.equal((await patch(a,'pending')).status,409);
const edit=await editTrips.onRequestPut({env,request:new Request('https://example.com',{method:'PUT',body:JSON.stringify({id:'normal',title_de:'Törn',title_en:'',title_ru:'',start_date:'2027-06-01',end_date:'2027-06-07',price_eur:1500,available_places:1,published:1})})});assert.equal(edit.status,409);
const inquiry=await requests.onRequestPost({env,request:new Request('https://example.com',{method:'POST',body:JSON.stringify({name:'Gast',email:'new@example.com',trip_id:'normal',guests:3,kind:'inquiry',privacy:true})})});assert.equal(inquiry.status,409);
assert.equal((await patch(a,'cancelled')).status,200);assert.equal(await remaining('normal'),4);
assert.equal((await patch(a,'cancelled')).status,200);assert.equal(await remaining('normal'),4);
assert.equal((await patch(a,'approved')).status,409);
trip('competing',4);const b=req('competing',3),c=req('competing',3);
const results=await Promise.all([patch(b,'approved'),patch(c,'approved')]);assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);assert.equal(await remaining('competing'),1);
const pending=req('competing',1);assert.equal(await remaining('competing'),1);assert.equal((await patch(pending,'contacted')).status,200);assert.equal(await remaining('competing'),1);
const general=req('general',1);assert.equal((await patch(general,'approved')).status,409);
assert.equal((await patch(999999,'approved')).status,404);
const adminTrips=await (await editTrips.onRequestGet({env})).json();assert.equal(adminTrips.find(t=>t.id==='competing').booked_places,3);
assert.equal((await patch(pending,'rejected')).status,200);
console.log('Passed: confirmation, cancellation, repeat actions, competing bookings, unknown capacity, inquiry availability, inventory edits and admin totals.');
db.close();
