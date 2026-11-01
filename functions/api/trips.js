
export async function onRequestGet({ env }) {
  if (!env.DB) return Response.json([]);

  const { results } = await env.DB.prepare(
    "SELECT id,title_de,title_en,title_ru,start_date,end_date,price_eur,available_places FROM trips WHERE published=1 AND end_date>=date('now') ORDER BY start_date"
  ).all();

  return Response.json(results, {
    headers: { "Cache-Control": "no-store" }
  });
}
