import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher/pusher-server";
import { pickWeightedOutcome } from "@/lib/spin-store";

async function triggerSpin(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  if (secret !== process.env.TIKFINITY_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const spin = {
    id: crypto.randomUUID(),
    outcome: pickWeightedOutcome(),
    createdAt: Date.now(),
  };

  await pusherServer.trigger("spin-channel", "spin-started", spin);

  return NextResponse.json({ ok: true, spin });
}

export async function GET(req: Request) {
  return triggerSpin(req);
}

export async function POST(req: Request) {
  return triggerSpin(req);
}
