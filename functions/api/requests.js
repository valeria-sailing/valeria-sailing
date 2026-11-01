import { sendICloud } from './_icloud-smtp.js';
const json=(obj,status=200)=>Response.json(obj,{status,headers:{'Cache-Control':'no-store'}});
const mailReady=env=>env.ICLOUD_SMTP_ENABLED==='true'&&!!env.ICLOUD_EMAIL&&!!env.ICLOUD_APP_PASSWORD;

export async function onRequestGet({env}) {return json({enabled:env.ENABLE_REQUESTS==='true'&&!!env.DB,mail_ready:mailReady(env)});}
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
  if(kind==='booking' && !mailReady(env))return json({error:'Booking email service temporarily unavailable'},503);
  if(!name||name.length>120||!/^\S+@\S+\.\S+$/.test(email)||email.length>200||!Number.isInteger(guests)||guests<1||guests>4||!['inquiry','booking'].includes(kind)||message.length>3000||!trip||!b.privacy)
    return json({error:'Please check all required fields'},400);
  if(kind==='booking' && trip==='general') return json({error:'Please select a trip for a binding booking offer'},400);
  if(kind==='booking' && b.booking_ack!==true) return json({error:'Please explicitly confirm your binding booking offer'},400);
  const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM requests WHERE email=? AND created_at>=datetime('now','-1 hour')").bind(email).first();
  if(Number(recent?.n||0)>=3)return json({error:'Too many requests. Please try again later.'},429);
  const dupe=await env.DB.prepare("SELECT id FROM requests WHERE email=? AND trip_id=? AND kind=? AND created_at>=datetime('now','-2 minutes') LIMIT 1").bind(email,trip,kind).first();
  if(dupe)return json({error:'This request has already been received.'},409);
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
       kind==='booking'?'After our OK, a 50% deposit is due; the remainder is due 14 days before the trip. Nothing to pay right now.':'No payment is due for an enquiry.',
       'We’ll be in touch soon.','Herman & Valeria']
    : language === 'ru'
    ? [`Привет, ${name}!`, '', 'Спасибо! Твоя заявка дошла до нас.',
       `Маршрут: ${route}`, `Даты: ${dates}`, `Гостей: ${guests}`, total===null?'':`Стоимость: ${amount}`, '',
       kind==='booking'?'Твоё предложение о бронировании обязывает тебя; место подтверждается только после нашего согласия.':'Это ни к чему не обязывающий запрос.',
       kind==='booking'?'После нашего согласия — предоплата 50%, остаток за 14 дней до отплытия. Сейчас платить не нужно.':'За вопрос платить ничего не нужно.',
       'Скоро свяжемся!','Herman & Valeria']
    : [`Ahoi ${name}!`, '', 'Schön, dass du mit uns in See stechen möchtest! Dein Buchungswunsch ist angekommen.',
       `Törn: ${route}`, `Zeitraum: ${dates}`, `Personen: ${guests}`, total===null?'':`Gesamtpreis: ${amount}`, '',
       kind==='booking'?'Dein Buchungsangebot ist verbindlich. Dein Platz ist aber erst mit unserem Okay fest gebucht.':'Deine Anfrage ist ganz unverbindlich.',
       kind==='booking'?'Nach unserem Okay werden 50 % Anzahlung fällig, der Rest zwei Wochen vor dem Törn. Jetzt musst du noch nichts bezahlen.':'Für deine unverbindliche Anfrage ist natürlich keine Zahlung fällig.',
       'Wir melden uns bald!','Herman & Valeria'];
  const text = lines.join('\n');
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
  if(mailReady(env)) {
    try { emailSent = await sendICloud(env,{to:email,subject,text}); }
    catch(e) { console.error('Guest mail failed:',String(e)); }
    if(env.ICLOUD_EMAIL) {
      try { ownerNotified=await sendICloud(env,{
        to: env.ICLOUD_EMAIL,
        subject:`Valeria: ${kind==='booking'?'Buchungswunsch':'Anfrage'} von ${name}`,
        text:`Name: ${name}\nE-Mail: ${email}\nTörn: ${route} ${dates}\nPersonen: ${guests}\nArt: ${kind}\nNachricht: ${message}\nBitte im Adminbereich prüfen.`
      }); } catch(e) { console.error('Owner mail failed:',String(e)); }
    }
  }
  // The request is always stored even if SMTP fails. Guests never receive a false confirmation.
  return json({ok:true,email_sent:emailSent,owner_notified:ownerNotified,message:'Request stored; pending personal review'},201);
}
