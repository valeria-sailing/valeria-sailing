export async function onRequestGet({env}) {
  if(!env.DB) return Response.json([]);
  const {results}=await env.DB.prepare(`SELECT t.id,t.title_de,t.title_en,t.title_ru,t.start_date,t.end_date,t.price_eur,
    CASE WHEN t.available_places IS NULL THEN NULL ELSE MAX(0,t.available_places-COALESCE((
      SELECT SUM(r.guests) FROM requests r WHERE r.trip_id=t.id AND r.status='approved'),0)) END AS available_places
    FROM trips t WHERE t.published=1 AND t.end_date>=date('now') ORDER BY t.start_date`).all();
  return Response.json(results,{headers:{'Cache-Control':'no-store'}});
}
