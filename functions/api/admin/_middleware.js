export async function onRequest({request,env,next}) {
  if (!env.ADMIN_TOKEN || !env.DB) return Response.json({error:'Admin not configured'},{status:503});
  const supplied=request.headers.get('Authorization')||'';
  const expected='Bearer '+env.ADMIN_TOKEN;
  const a=new TextEncoder().encode(supplied), b=new TextEncoder().encode(expected);
  if (a.length!==b.length) return Response.json({error:'Unauthorized'},{status:401});
  let diff=0; for(let i=0;i<a.length;i++)diff|=a[i]^b[i];
  if(diff) return Response.json({error:'Unauthorized'},{status:401});
  return next();
}
