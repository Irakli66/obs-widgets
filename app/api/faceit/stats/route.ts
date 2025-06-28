import { NextResponse } from "next/server";

export async function GET() {
  const FACEIT_ID = process.env.FACEIT_ID; // your player_id
  const FACEIT_API_KEY = process.env.FACEIT_API_KEY; // secure in .env.local

  try {
    const res = await fetch(
      `https://open.faceit.com/data/v4/players/${FACEIT_ID}/stats/cs2`,
      {
        headers: {
          Authorization: `Bearer ${FACEIT_API_KEY}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
