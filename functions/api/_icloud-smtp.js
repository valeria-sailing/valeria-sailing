import { connect } from 'cloudflare:sockets';

function mimeHeader(value) {
  return '=?UTF-8?B?' + btoa(String.fromCharCode(...new TextEncoder().encode(String(value)))) + '?=';
}
function sanitizeAddr(value) {
  const s = String(value || '').trim();
  if (/[\r\n<>]/.test(s) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) throw new Error('Invalid address');
  return s;
}
function b64(s) {
  const bytes = new TextEncoder().encode(s);
  let output = '';
  for(let i=0;i<bytes.length;i+=8192) output += String.fromCharCode(...bytes.subarray(i,i+8192));
  return btoa(output);
}
function encodeBody(text) {
  const normalized = String(text).replace(/\r\n|\r|\n/g,'\r\n');
  return b64(normalized).replace(/.{1,76}/g, '$&\r\n').trimEnd();
}

export async function sendICloud(env, { to, subject, text }) {
  if (!env.ICLOUD_EMAIL || !env.ICLOUD_APP_PASSWORD) throw new Error('SMTP not configured');
  const from = sanitizeAddr(env.ICLOUD_EMAIL);
  to = sanitizeAddr(to);
  let socket, writer, reader;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let pending = '';
  async function command(line) { await writer.write(encoder.encode(line + '\r\n')); }
  async function response(expected) {
    const codes = [];
    for (;;) {
      let idx;
      while((idx = pending.indexOf('\n')) === -1) {
        const {value,done} = await reader.read();
        if(done) throw new Error('SMTP closed unexpectedly');
        pending += decoder.decode(value,{stream:true});
        if(pending.length > 64000) throw new Error('SMTP response too large');
      }
      const line = pending.slice(0,idx).replace(/\r$/,'');
      pending = pending.slice(idx+1);
      if(!/^\d{3}[ -]/.test(line)) throw new Error('Malformed SMTP response');
      codes.push(line.slice(0,3));
      if(line[3] === ' ') {
        const code = Number(line.slice(0,3));
        if(expected && !expected.includes(code)) throw new Error('SMTP rejected command ('+code+')');
        return code;
      }
    }
  }
  try {
    socket = connect({hostname:'smtp.mail.me.com',port:587},{secureTransport:'starttls',allowHalfOpen:false});
    writer = socket.writable.getWriter(); reader = socket.readable.getReader();
    await response([220]);
    await command('EHLO valeria-sailing.pages.dev'); await response([250]);
    await command('STARTTLS'); await response([220]);
    // Release stream locks before STARTTLS. The unencrypted socket is retired by startTls().
    writer.releaseLock(); reader.releaseLock();
    socket = socket.startTls(); pending = '';
    writer = socket.writable.getWriter(); reader = socket.readable.getReader();
    await command('EHLO valeria-sailing.pages.dev'); await response([250]);
    await command('AUTH LOGIN'); await response([334]);
    await command(b64(from)); await response([334]);
    await command(b64(env.ICLOUD_APP_PASSWORD)); await response([235]);
    await command(`MAIL FROM:<${from}>`); await response([250]);
    await command(`RCPT TO:<${to}>`); await response([250,251]);
    await command('DATA'); await response([354]);
    const mail = [
      `From: ${from}`, `To: ${to}`, `Subject: ${mimeHeader(subject)}`,
      `Date: ${new Date().toUTCString()}`, `Message-ID: <${crypto.randomUUID()}@valeria-sailing.pages.dev>`,
      'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64', '', encodeBody(text), '.'
    ].join('\r\n');
    await writer.write(encoder.encode(mail+'\r\n')); await response([250]);
    await command('QUIT'); await response([221]);
    return true;
  } finally {
    try { await reader?.cancel(); } catch {}
    try { writer?.releaseLock(); } catch {}
    try { reader?.releaseLock(); } catch {}
    try { socket?.close(); } catch {}
  }
}
