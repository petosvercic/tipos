import Link from "next/link";
import { getAnalysisSummary } from "@/lib/analysis/summary";
import { SectionCard } from "@/components/SectionCard";
import { StatCard } from "@/components/StatCard";
import { NumberChip } from "@/components/NumberChip";

export default async function HomePage() {
  const summary = await getAnalysisSummary();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
            eKeno analytics
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">Tipos Analyzer</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Verejny analyticky dashboard pre vysledky, frekvencie, oneskorenia
            a scoring tipovacich panelov.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/history"
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
          >
            Historia
          </Link>
          <Link
            href="/analyzer"
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
          >
            Analyzer
          </Link>
          <Link
            href="/tip-panel"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
          >
            Tip panel
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Pocet zrebovani v DB" value={summary.totalDraws} />
        <StatCard
          label="Posledne zrebovanie"
          value={summary.latestDraw?.draw_no ?? "n/a"}
        />
        <StatCard
          label="Pocet cisel v poslednom tahu"
          value={summary.latestDraw?.numbers.length ?? 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Posledne zrebovanie">
          {summary.latestDraw ? (
            <div className="space-y-4">
              <div className="text-sm text-zinc-400">
                Draw #{summary.latestDraw.draw_no ?? "n/a"} {" "}
                {new Date(summary.latestDraw.draw_at).toLocaleString("sk-SK")}
              </div>
              <div className="flex flex-wrap gap-2">
                {summary.latestDraw.numbers.map((n) => (
                  <NumberChip key={n} value={n} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-zinc-400">Zatial nie su ulozene ziadne data.</p>
          )}
        </SectionCard>

        <SectionCard title="Top frekvencie">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {summary.frequencies.map((item) => (
              <div
                key={item.number}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-3"
              >
                <div className="text-sm text-zinc-400">Cislo {item.number}</div>
                <div className="mt-1 text-xl font-bold text-white">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Hot numbers">
          <div className="flex flex-wrap gap-2">
            {summary.hotNumbers.map((n) => (
              <NumberChip key={n} value={n} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Cold numbers">
          <div className="flex flex-wrap gap-2">
            {summary.coldNumbers.map((n) => (
              <NumberChip key={n} value={n} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Overdue numbers">
          <div className="flex flex-wrap gap-2">
            {summary.overdueNumbers.map((n) => (
              <NumberChip key={n} value={n} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Coskoro">
          <ul className="space-y-2 text-sm text-zinc-300">
            <li> top scoring kombinacie</li>
            <li> countdown do dalsieho zrebovania</li>
            <li> tip panel evaluator</li>
            <li> collector run log</li>
          </ul>
        </SectionCard>
      </div>
    </main>
  );
}