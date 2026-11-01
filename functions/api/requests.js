import { sendICloud } from './_icloud-smtp.js';
const json=(obj,status=200)=>Response.json(obj,{status,headers:{'Cache-Control':'no-store'}});
export async function onRequestGet({env}) {return json({enabled:env.ENABLE_REQUESTS==='true'&&!!env.DB});}
export async function onRequestPost({request,env}) {
  if(env.ENABLE_REQUESTS!=='true'||!env.DB)return json({error:'Booking requests are not yet active'},503);
  const length=Number(request.headers.get('content-length')||0);
  if(length>12000)return json({error:'Request too large'},413);
  let b;try{b=await request.json()}catch{return json({error:'Invalid JSON'},400)}
  if(!b||typeof b!=='object')return json({error:'Invalid request'},400);
  if(b.website)return json({ok:true},201); // trap obvious form bots, no database insertion
  const name=String(b.name||'').trim(), email=String(b.email||'').trim(), trip=String(b.trip_id||'').trim();
  const guests=Number(b.guests),kind=String(b.kind||''),message=String(b.message||'').trim();
  const language=['de','en','ru'].includes(b.language)?b.language:'de';
  if(!name||name.length>120||!/^\S+@\S+\.\S+$/.test(email)||email.length>200||!Number.isInteger(guests)||guests<1||guests>4||!['inquiry','booking'].includes(kind)||message.length>3000||!trip||!b.privacy)
    return json({error:'Please check all required fields'},400);
  if(trip!=='general'){
    const row=await env.DB.prepare("SELECT available_places FROM trips WHERE id=? AND published=1 AND end_date>=date('now')").bind(trip).first();
    if(!row)return json({error:'Trip unavailable'},409);
    if(row.available_places!==null&&row.available_places<guests)return json({error:'Not enough places available'},409);
  }
  await env.DB.prepare('INSERT INTO requests (trip_id,name,email,guests,kind,message,language) VALUES (?,?,?,?,?,?,?)')
    .bind(trip,name,email,guests,kind,message,language).run();
  // Sending is configured separately; never claim an email was sent unless the provider confirms it.
  const details = trip === 'general' ? null : await env.DB.prepare(
    'SELECT title_de,title_en,title_ru,start_date,end_date,price_eur FROM trips WHERE id=?'
  ).bind(trip).first();
  const subject = kind === 'booking'
    ? {de:'Dein Buchungswunsch für die Valeria ⛵',en:'Your Valeria booking request ⛵',ru:'Твоя заявка на Valeria ⛵'}[language]
    : {de:'Deine Nachricht an die Valeria ⛵',en:'Your message to Valeria ⛵',ru:'Твоё сообщение для Valeria ⛵'}[language];
  const route = details ? (details['title_'+language] || details.title_de) : 'Valeria';
  const dates = details ? `${details.start_date} – ${details.end_date}` : '';
  const total = details ? Number(details.price_eur) * guests : null;
  const amount = total === null ? '' : `${total.toLocaleString('de-DE')} €`;
  const lines = language === 'en'
    ? [`Ahoy ${name}!`, '', 'Thanks for getting in touch – your request has arrived!',
       `Voyage: ${route}`, `Dates: ${dates}`, `Guests: ${guests}`, total===null?'':`Total: ${amount}`, '',
       kind==='booking'?'Your booking offer is binding; your place is only confirmed after our personal acceptance.':'This is a non-binding enquiry.',
       'After confirmation, a 50% deposit is due, with the remainder 14 days before departure. No payment is due now.',
       'We’ll be in touch soon.','Herman & Valeria']
    : language === 'ru'
    ? [`Привет, ${name}!`, '', 'Спасибо! Твоя заявка дошла до нас.',
       `Маршрут: ${route}`, `Даты: ${dates}`, `Гостей: ${guests}`, total===null?'':`Стоимость: ${amount}`, '',
       kind==='booking'?'Твоё предложение о бронировании обязывает тебя; место подтверждается только после нашего согласия.':'Это ни к чему не обязывающий запрос.',
       'После нашего подтверждения предоплата 50%, остаток за 14 дней до начала. Сейчас платить не нужно.',
       'Скоро свяжемся!','Herman & Valeria']
    : [`Ahoi ${name}!`, '', 'Schön, dass du mit uns in See stechen möchtest! Dein Buchungswunsch ist angekommen.',
       `Törn: ${route}`, `Zeitraum: ${dates}`, `Personen: ${guests}`, total===null?'':`Gesamtpreis: ${amount}`, '',
       kind==='booking'?'Dein Buchungsangebot ist verbindlich. Dein Platz ist aber erst mit unserem Okay fest gebucht.':'Deine Anfrage ist ganz unverbindlich.',
       'Nach unserer Bestätigung sind 50 % Anzahlung fällig, der Rest 14 Tage vor dem Törn. Jetzt musst du noch nichts bezahlen.',
       'Wir melden uns bald!','Herman & Valeria'];
  const text = lines.filter(v=>v!==''||true).join('\n');
  let emailSent=false;
  let ownerNotified=false;
  // Resend requires a verified sending domain. Never expose the API key in browser code.
  if(env.RESEND_API_KEY && env.EMAIL_FROM && env.ICLOUD_SMTP_ENABLED!=='true'){
    const send=async (to,subject,text,key)=>{
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method:'POST', headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':key},
          body:JSON.stringify({from:env.EMAIL_FROM,to:[to],subject,text})
        });
        return response.ok;
      } catch { return false; }
    };
    // No message/body content goes to the site visitor in an error response.
    const idKey=crypto.randomUUID();
    emailSent=await send(email,subject,text,`${idKey}-guest`);
    if(env.OWNER_EMAIL){
      ownerNotified=await send(env.OWNER_EMAIL,`Valeria: ${kind==='booking'?'Buchungswunsch':'Anfrage'} von ${name}`,
        `Name: ${name}\nE-Mail: ${email}\nTörn: ${route} ${dates}\nPersonen: ${guests}\nArt: ${kind}\nNachricht: ${message}\n\nBitte im Adminbereich prüfen.`,`${idKey}-owner`);
    }
  }
  if(env.ICLOUD_EMAIL && env.ICLOUD_APP_PASSWORD && env.ICLOUD_SMTP_ENABLED==='true') {
    try { emailSent = await sendICloud(env,{to:email,subject,text}); }
    catch(e) { console.error('Guest mail failed:',String(e)); }
    if(env.OWNER_EMAIL || env.ICLOUD_EMAIL) {
      try { ownerNotified=await sendICloud(env,{
        to: env.OWNER_EMAIL || env.ICLOUD_EMAIL,
        subject:`Valeria: ${kind==='booking'?'Buchungswunsch':'Anfrage'} von ${name}`,
        text:`Name: ${name}\nE-Mail: ${email}\nTörn: ${route} ${dates}\nPersonen: ${guests}\nArt: ${kind}\nNachricht: ${message}\nBitte im Adminbereich prüfen.`
      }); } catch(e) { console.error('Owner mail failed:',String(e)); }
    }
  }
  return json({ok:true,email_sent:emailSent,owner_notified:ownerNotified,message:'Request stored; pending personal review'},201);
}
