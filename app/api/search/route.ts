// app/api/search/route.ts
import { tmdb } from "@/lib/tmdb";
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") || "";
  const data = await tmdb.searchAll(q);
  return Response.json(data);
}
