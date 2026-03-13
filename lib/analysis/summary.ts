import type { AnalysisSummary, DrawWithNumbers } from "@/lib/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function computeFrequencies(draws: DrawWithNumbers[]) {
  const map = new Map<number, number>();

  for (const draw of draws) {
    for (const n of draw.numbers) {
      map.set(n, (map.get(n) ?? 0) + 1);
    }
  }

  return Array.from({ length: 80 }, (_, i) => i + 1)
    .map((number) => ({
      number,
      count: map.get(number) ?? 0
    }))
    .sort((a, b) => b.count - a.count || a.number - b.number);
}

function computeOverdue(draws: DrawWithNumbers[]) {
  const lastSeen = new Map<number, number>();

  draws.forEach((draw, drawIndex) => {
    draw.numbers.forEach((n) => {
      if (!lastSeen.has(n)) {
        lastSeen.set(n, drawIndex);
      }
    });
  });

  return Array.from({ length: 80 }, (_, i) => i + 1)
    .map((number) => ({
      number,
      age: lastSeen.has(number) ? (lastSeen.get(number) ?? 0) : 999999
    }))
    .sort((a, b) => b.age - a.age || a.number - b.number)
    .slice(0, 10)
    .map((x) => x.number);
}

export async function getAnalysisSummary(): Promise<AnalysisSummary> {
  const supabase = await getSupabaseServerClient();

  const { data: drawsRaw, error } = await supabase
    .from("draws")
    .select("id, draw_no, draw_at, source_url, raw_payload, created_at, draw_numbers(number)")
    .order("draw_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  const draws: DrawWithNumbers[] = (drawsRaw ?? []).map((row: any) => ({
    id: row.id,
    draw_no: row.draw_no,
    draw_at: row.draw_at,
    source_url: row.source_url,
    raw_payload: row.raw_payload,
    created_at: row.created_at,
    numbers: (row.draw_numbers ?? [])
      .map((x: { number: number }) => x.number)
      .sort((a: number, b: number) => a - b)
  }));

  const frequencies = computeFrequencies(draws);
  const hotNumbers = frequencies.slice(0, 10).map((x) => x.number);
  const coldNumbers = [...frequencies].reverse().slice(0, 10).map((x) => x.number);
  const overdueNumbers = computeOverdue(draws);

  return {
    totalDraws: draws.length,
    latestDraw: draws[0] ?? null,
    hotNumbers,
    coldNumbers,
    overdueNumbers,
    frequencies: frequencies.slice(0, 20)
  };
}