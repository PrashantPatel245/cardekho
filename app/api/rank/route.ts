import { NextResponse } from "next/server";
import { isValidPreferences, rankCars } from "@/lib/rank";
import type { RankRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RankRequest;

    if (!body?.preferences || !isValidPreferences(body.preferences)) {
      return NextResponse.json({ error: "Invalid preferences payload" }, { status: 400 });
    }

    const limit = typeof body.limit === "number" ? Math.min(body.limit, 10) : 5;
    const { results, defaultWeights } = rankCars(body.preferences, body.weights, limit);

    return NextResponse.json({ results, defaultWeights });
  } catch {
    return NextResponse.json({ error: "Failed to rank cars" }, { status: 500 });
  }
}
