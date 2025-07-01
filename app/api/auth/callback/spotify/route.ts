import { NextRequest } from "next/server";
import { getTokens } from "../../../../../lib/spotify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  console.log("[Spotify Callback] code:", code);

  if (!code) {
    return Response.json(
      { error: "Authorization code not provided" },
      { status: 400 }
    );
  }

  try {
    const tokens = await getTokens(code);
    console.log("[Spotify Callback] tokens response:", tokens);

    if (tokens.error) {
      return Response.json({ error: tokens.error }, { status: 400 });
    }

    // Create response with redirect
    const response = Response.redirect(new URL("/", request.url));

    // Set cookies
    response.headers.set(
      "Set-Cookie",
      [
        `spotify_access_token=${tokens.access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`,
        `spotify_refresh_token=${tokens.refresh_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/`,
      ].join(", ")
    );

    return response;
  } catch (error) {
    console.error("[Spotify Callback] Error getting tokens:", error);
    let details: string;
    if (error instanceof Error) {
      details = error.message;
    } else {
      details = String(error);
    }
    return Response.json(
      { error: "Failed to get access token", details },
      { status: 500 }
    );
  }
}
