import { NextRequest, NextResponse } from "next/server";
import { getTokens } from "../../../../../lib/spotify";
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code not provided" },
      { status: 400 }
    );
  }

  try {
    const tokens = await getTokens(code);

    if (tokens.error) {
      return NextResponse.json({ error: tokens.error }, { status: 400 });
    }

    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("spotify_access_token", tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    response.cookies.set("spotify_refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Spotify Callback] Error getting tokens:", error);
    const details = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: "Failed to get access token", details },
      { status: 500 }
    );
  }
}
