import { NextResponse } from "next/server";

const FACEIT_ID = process.env.FACEIT_ID;
const API_KEY = process.env.FACEIT_API_KEY;

type ItemType = {
  match_id: string;
};

export async function GET() {
  try {
    const historyRes = await fetch(
      `https://open.faceit.com/data/v4/players/${FACEIT_ID}/games/cs2/stats?limit=30`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (!historyRes.ok) {
      return NextResponse.json(
        { error: "History fetch failed" },
        { status: 500 }
      );
    }

    const historyData = await historyRes.json();
    const matchIds = historyData.items.map((item: ItemType) => item.match_id);

    let kills = 0;
    let deaths = 0;
    let assists = 0;
    let hspercent = 0;
    let wins = 0;
    let elo = 0;

    for (const match of historyData.items) {
      kills += parseInt(match.stats["Kills"]);
      deaths += parseInt(match.stats["Deaths"]);
      assists += parseInt(match.stats["Assists"]);
      elo += parseInt(match.stats["Elo"]);
      hspercent += parseFloat(match.stats["Headshots %"]);
      if (match.stats["Result"] === "1") {
        wins++;
      }
    }

    const kd = kills / deaths;
    const hsPercent = hspercent / 30;
    const winRate = (wins / matchIds.length) * 100;

    return NextResponse.json({
      kd: kd.toFixed(2),
      hsPercent: hsPercent.toFixed(0),
      winRate: winRate.toFixed(0),
      loses: matchIds.length - wins,
      kills: kills,
      deaths: deaths,
      wins,
      avAssists: (assists / 30).toFixed(0),
      avKills: (kills / 30).toFixed(0),
      avDeaths: (deaths / 30).toFixed(0),
      elo: elo,
      lastGameStas: historyData.items[0].stats,
      matchCount: matchIds.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
