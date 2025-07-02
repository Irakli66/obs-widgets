// app/api/kick/stream/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const slug = "tynite";

  try {
    // 1️⃣ Fetch channel info to get livestream status and metadata
    const infoRes = await fetch(`https://kick.com/api/v1/channels/${slug}`);
    if (!infoRes.ok) throw new Error("Channel info fetch failed");
    const info = await infoRes.json();

    const live = info.livestream;
    const isLive = live?.is_live ?? false;
    const title = live?.session_title ?? "";
    const startedAt = live?.started_at ?? null;
    const game = live?.categories?.[0]?.name ?? "";

    // 2️⃣ Get viewer count using livestream id
    let viewers = 0;
    if (isLive && live.id) {
      const viewRes = await fetch(
        `https://kick.com/api/v1/live-channels/${slug}/search`
      );
      if (viewRes.ok) {
        const viewInfo = await viewRes.json();
        viewers = viewInfo.viewer_count ?? 0;
      }
    }

    // 3️⃣ Fetch followers from channel info
    const followers = info.followersCount ?? 0;

    return NextResponse.json({
      isLive,
      title,
      viewers,
      followers,
      startedAt,
      game,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
