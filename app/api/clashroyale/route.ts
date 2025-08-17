import { NextResponse } from "next/server";

export async function GET() {
  const PLAYER_TAG = process.env.CLASH_ROYALE_PLAYER_TAG || "#8U0RPPUP";
  const API_TOKEN = process.env.CLASH_ROYALE_API_TOKEN;

  if (!API_TOKEN) {
    return NextResponse.json(
      { error: "CLASH_ROYALE_API_TOKEN environment variable is required" },
      { status: 400 }
    );
  }

  try {
    // Remove the # from the player tag for the API call
    const cleanPlayerTag = PLAYER_TAG.replace("#", "");

    console.log("Making Clash Royale API requests with:");
    console.log("Player Tag:", PLAYER_TAG);
    console.log("Clean Player Tag:", cleanPlayerTag);
    console.log("API Token length:", API_TOKEN.length);

    // Clash Royale API uses Authorization header with Bearer token
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    };

    // Fetch both player info and battle log
    const [playerRes, battleLogRes] = await Promise.all([
      fetch(`https://api.clashroyale.com/v1/players/%23${cleanPlayerTag}`, {
        headers,
      }),
      fetch(
        `https://api.clashroyale.com/v1/players/%23${cleanPlayerTag}/battlelog`,
        { headers }
      ),
    ]);

    console.log("Player info response status:", playerRes.status);
    console.log("Battle log response status:", battleLogRes.status);

    if (!playerRes.ok) {
      const errorText = await playerRes.text();
      console.error("Player info error response:", errorText);

      return NextResponse.json(
        {
          error: "Failed to fetch Clash Royale player data",
          status: playerRes.status,
          statusText: playerRes.statusText,
          details: errorText,
          debug: {
            playerTag: PLAYER_TAG,
            cleanPlayerTag,
            apiTokenLength: API_TOKEN.length,
            url: `https://api.clashroyale.com/v1/players/%23${cleanPlayerTag}`,
          },
        },
        { status: playerRes.status }
      );
    }

    if (!battleLogRes.ok) {
      const errorText = await battleLogRes.text();
      console.error("Battle log error response:", errorText);

      return NextResponse.json(
        {
          error: "Failed to fetch Clash Royale battle log",
          status: battleLogRes.status,
          statusText: battleLogRes.statusText,
          details: errorText,
          debug: {
            playerTag: PLAYER_TAG,
            cleanPlayerTag,
            apiTokenLength: API_TOKEN.length,
            url: `https://api.clashroyale.com/v1/players/%23${cleanPlayerTag}/battlelog`,
          },
        },
        { status: battleLogRes.status }
      );
    }

    const [playerData, battleLogData] = await Promise.all([
      playerRes.json(),
      battleLogRes.json(),
    ]);

    // console.log("Successfully fetched player data and battle log");
    // console.log("Player name:", playerData.name);
    // console.log("Battle log entries:", battleLogData.length);

    return NextResponse.json({
      player: playerData,
      battleLog: battleLogData,
    });
  } catch (error) {
    console.error("Clash Royale API request failed:", error);
    return NextResponse.json(
      {
        error: "Request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
