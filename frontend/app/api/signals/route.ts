import { connection } from "next/server";
import { createSignal, isTtlChoice, SignalError } from "@/lib/signals";

export async function POST(request: Request) {
  await connection();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Write a message before creating a link." }, { status: 400 });
  }

  const body =
    typeof payload === "object" && payload !== null && "body" in payload ? payload.body : "";
  const ttl =
    typeof payload === "object" && payload !== null && "ttl" in payload ? payload.ttl : undefined;

  if (typeof body !== "string" || !isTtlChoice(ttl)) {
    return Response.json({ error: "Choose how long the signal should last." }, { status: 400 });
  }

  try {
    const signal = await createSignal(body, ttl);
    return Response.json(signal, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SignalError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The signal could not be created." }, { status: 500 });
  }
}
