import { sendICloud } from '../_icloud-smtp.js';
const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});

export async function onRequestGet({env}) {
  const {results}=await env.DB.prepare('SELECT r.*,t.title_de,t.start_date,t.end_date FROM requests r LEFT JOIN trips t ON r.trip_id=t.id ORDER BY r.created_at DESC LIMIT 300').all();
  return json(results);
}
export async function onRequestPatch({request,env}) {
  let body;
  try { body=await request.json(); } catch { return json({error:'Ungültige Anfrage'},400); }
  if(!body || !Number.isInteger(body.id) || !['pending','contacted','rejected','approved','cancelled'].includes(body.status))return json({error:'Ungültige Anfrage'},400);
  const existing=await env.DB.prepare('SELECT * FROM requests WHERE id=?').bind(body.id).first();
  if(!existing)return json({error:'Anfrage nicht gefunden'},404);
  if(existing.status===body.status)return json({ok:true,unchanged:true});
  if(existing.status==='approved' && body.status!=='cancelled')return json({error:'Eine bestätigte Buchung kann nur storniert werden.'},409);
  if(existing.status==='cancelled')return json({error:'Bitte für eine neue Buchung eine neue Anfrage anlegen.'},409);
  let result;
  if(body.status==='approved') {
    // One SQL statement checks capacity and confirms. Concurrent approvals cannot overbook.
    result=await env.DB.prepare(`UPDATE requests SET status='approved'
      WHERE id=? AND status IN ('pending','contacted') AND EXISTS (
        SELECT 1 FROM trips t WHERE t.id=requests.trip_id AND t.published=1
        AND t.end_date>=date('now') AND t.available_places IS NOT NULL
        AND t.available_places >= requests.guests + COALESCE((
          SELECT SUM(r.guests) FROM requests r WHERE r.trip_id=t.id AND r.status='approved'
        ),0))`).bind(body.id).run();
  } else {
    result=await env.DB.prepare('UPDATE requests SET status=? WHERE id=? AND status=?')
      .bind(body.status,body.id,existing.status).run();
  }
  if(!result.meta.changes)return json({error:'Nicht geändert. Bitte aktualisieren und freie Plätze sowie Status prüfen. Vor der ersten Zusage muss das Online-Kontingent des Törns feststehen.'},409);
  let emailSent=false;
  if(['approved','cancelled'].includes(body.status) && env.ICLOUD_SMTP_ENABLED==='true' && env.ICLOUD_EMAIL && env.ICLOUD_APP_PASSWORD) {
    const trip=await env.DB.prepare('SELECT title_de,start_date,end_date FROM trips WHERE id=?').bind(existing.trip_id).first();
    const approved=body.status==='approved';
    const lang=['de','en','ru'].includes(existing.language)?existing.language:'de';
    const copy={
      de:{yes:'Deine Buchung auf der Valeria ist bestätigt ⛵',no:'Deine Buchung auf der Valeria wurde storniert',greet:'Ahoi',confirmed:'Wir bestätigen deine Buchung auf der Valeria.',cancelled:'Wir bestätigen die Stornierung deiner Buchung auf der Valeria.',trip:'Törn',dates:'Zeitraum',guests:'Personen',payment:'Die Zahlungsdetails stimmen wir persönlich mit dir ab.',contact:'Bei Fragen melde dich bitte direkt bei uns.'},
      en:{yes:'Your Valeria booking is confirmed ⛵',no:'Your Valeria booking has been cancelled',greet:'Ahoy',confirmed:'We confirm your booking aboard Valeria.',cancelled:'We confirm the cancellation of your booking aboard Valeria.',trip:'Voyage',dates:'Dates',guests:'Guests',payment:'We will arrange payment details with you personally.',contact:'Please contact us directly if you have any questions.'},
      ru:{yes:'Твоё бронирование на Valeria подтверждено ⛵',no:'Твоё бронирование на Valeria отменено',greet:'Привет',confirmed:'Подтверждаем твоё бронирование на Valeria.',cancelled:'Подтверждаем отмену твоего бронирования на Valeria.',trip:'Маршрут',dates:'Даты',guests:'Гостей',payment:'Детали оплаты согласуем с тобой лично.',contact:'Если есть вопросы, свяжись с нами напрямую.'}
    }[lang];
    try {
      emailSent=await sendICloud(env,{
        to:existing.email,
        subject:approved?copy.yes:copy.no,
        text:[`${copy.greet} ${existing.name}!`,'',approved?copy.confirmed:copy.cancelled,
          `${copy.trip}: ${trip?.title_de||existing.trip_id}`,`${copy.dates}: ${trip?.start_date||''} – ${trip?.end_date||''}`,`${copy.guests}: ${existing.guests}`,'',
          approved?copy.payment:copy.contact,'Herman & Valeria'].join('\n')
      });
    } catch { /* The saved status is authoritative; the admin sees the mail failure. */ }
  }
  return json({ok:true,email_sent:emailSent});
}
