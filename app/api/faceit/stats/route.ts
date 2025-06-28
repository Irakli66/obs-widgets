import { NextResponse } from "next/server";

export async function GET() {
  const FACEIT_ID = "88096b5d-6ce5-429e-9c15-8793cba9d969";
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
  } catch (err) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
