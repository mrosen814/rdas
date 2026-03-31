'use client';

import { Dinner } from '@/types/dinner';

const MAX_SHOWN = 10;

interface Props {
  dinners: Dinner[];
}

export default function DinnerStats({ dinners }: Props) {
  const ranked = dinners
    .filter((d) => (d.timesMade ?? 0) > 0)
    .sort((a, b) => (b.timesMade ?? 0) - (a.timesMade ?? 0))
    .slice(0, MAX_SHOWN);

  if (ranked.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-black mb-4">Dinner Stats</h2>
      <div className="border border-black rounded-xl overflow-hidden divide-y divide-gray-100">
        {ranked.map((dinner, i) => (
          <div key={dinner.id} className="flex items-center gap-3 px-4 py-3 bg-white">
            <span className="text-sm text-gray-400 w-6 shrink-0 text-right">{i + 1}.</span>
            <span className="flex-1 font-medium text-black text-sm">{dinner.name}</span>
            <span className="text-sm text-gray-500 shrink-0">
              ×{dinner.timesMade}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
