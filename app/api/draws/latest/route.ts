import { NextResponse } from "next/server";
import { getAnalysisSummary } from "@/lib/analysis/summary";

export async function GET() {
  try {
    const summary = await getAnalysisSummary();
    return NextResponse.json(summary.latestDraw);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}