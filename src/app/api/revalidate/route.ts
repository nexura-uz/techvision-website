import { revalidateTag } from "next/cache";

// the API calls this after every admin change: every cached API answer is dropped, the next visit gets fresh data
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) return new Response("forbidden", { status: 403 });
  revalidateTag("api", { expire: 0 });
  return Response.json({ ok: true });
}
