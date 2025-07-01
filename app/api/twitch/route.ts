// /app/api/twitch/route.ts
import { NextResponse } from "next/server";

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

async function getAccessToken() {
  const now = Date.now();

  if (accessToken && tokenExpiresAt && now < tokenExpiresAt) {
    return accessToken;
  }

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }),
  });

  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;
  return accessToken;
}

export async function GET() {
  const token = await getAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const username = process.env.TWITCH_USERNAME!;

  const headers = {
    "Client-ID": clientId,
    Authorization: `Bearer ${token}`,
  };

  try {
    // Get user ID
    const userRes = await fetch(
      `https://api.twitch.tv/helix/users?login=${username}`,
      { headers }
    );
    const user = (await userRes.json()).data[0];
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get stream and followers
    const [streamRes, followersRes] = await Promise.all([
      fetch(`https://api.twitch.tv/helix/streams?user_id=${user.id}`, {
        headers,
      }),
      fetch(
        `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${user.id}`,
        { headers }
      ),
    ]);

    const streamData = await streamRes.json();
    const followersData = await followersRes.json();

    return NextResponse.json({
      stream: streamData.data[0] || null,
      followers: followersData.total || 0,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Twitch data" },
      { status: 500 }
    );
  }
}
