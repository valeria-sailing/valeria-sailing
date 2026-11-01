import { sendICloud } from '../_icloud-smtp.js';
export async function onRequestPost({env}) {
  if (!env.ICLOUD_EMAIL || !env.ICLOUD_APP_PASSWORD) return Response.json({ok:false,error:'ICLOUD_EMAIL or ICLOUD_APP_PASSWORD missing'},{status:503});
  try {
    await sendICloud(env,{
      to:env.ICLOUD_EMAIL,
      subject:'Valeria – iCloud-E-Mail-Test',
      text:'Ahoi! Das ist eine Testnachricht deiner Valeria-Webseite. Es wurde keine Buchung ausgelöst.'
    });
    return Response.json({ok:true,message:'SMTP accepted test message. Check your iCloud inbox.'});
  } catch(err) {
    console.error('SMTP test error:', String(err));
    return Response.json({ok:false,error:'SMTP connection or delivery failed; check Cloudflare function logs.'},{status:502});
  }
}
