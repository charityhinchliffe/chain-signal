import { connection } from "next/server";
import { expireSignal } from "@/lib/signals";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connection();
  const { id } = await context.params;
  const result = await expireSignal(id);
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
