import { cookies } from "next/headers";
import { getNowPlaying, getAccessToken } from "../../../../lib/spotify";

export async function GET() {
  try {
    const cookieStore = cookies();
    let spotify_access_token = (await cookieStore).get(
      "spotify_access_token"
    )?.value;
    const spotify_refresh_token = (await cookieStore).get(
      "spotify_refresh_token"
    )?.value;

    if (!spotify_refresh_token) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Refresh token if needed
    if (!spotify_access_token) {
      const tokenData = await getAccessToken(spotify_refresh_token);
      spotify_access_token = tokenData.access_token;

      // Note: Setting cookies in response headers for App Router
      const response = new Response();
      response.headers.set(
        "Set-Cookie",
        `spotify_access_token=${spotify_access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`
      );
    }

    if (!spotify_access_token) {
      return Response.json(
        { error: "Failed to obtain access token" },
        { status: 401 }
      );
    }

    const response = await getNowPlaying(spotify_access_token);

    if (response.status === 204 || response.status > 400) {
      return Response.json({ isPlaying: false });
    }

    const song = await response.json();

    if (!song.is_playing) {
      return Response.json({ isPlaying: false });
    }

    const data = {
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists
        .map((artist: { name: string }) => artist.name)
        .join(", "),
      album: song.item.album.name,
      albumImageUrl: song.item.album.images[0]?.url,
      songUrl: song.item.external_urls.spotify,
      progress: song.progress_ms,
      duration: song.item.duration_ms,
    };

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching now playing:", error);
    return Response.json(
      { error: "Failed to fetch currently playing song" },
      { status: 500 }
    );
  }
}
