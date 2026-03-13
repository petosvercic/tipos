export function NumberChip({ value }: { value: number }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-300">
      {value}
    </span>
  );
}