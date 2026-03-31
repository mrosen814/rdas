'use client';

import { useState } from 'react';
import { Dinner, STATUS_LABELS } from '@/types/dinner';

const STATUS_STYLES: Record<string, string> = {
  'family-favourite': 'bg-black text-white',
  'made-before':      'bg-gray-200 text-black',
  'want-to-try':      'bg-white text-black border border-gray-400',
  'not-again':        'bg-gray-600 text-white',
};

interface Props {
  dinners: Dinner[];
  onCookAgain: (id: string) => void;
  onEdit: (dinner: Dinner) => void;
}

export default function GoToMeals({ dinners, onCookAgain, onEdit }: Props) {
  const [justMadeId, setJustMadeId] = useState<string | null>(null);

  function handleMadeIt(id: string) {
    onCookAgain(id);
    setJustMadeId(id);
    setTimeout(() => setJustMadeId(null), 3000);
  }

  // Show 5-star dinners. If none exist yet, fall back to 4-star.
  // Excludes "not-again" dinners.
  const fiveStar = dinners.filter(d => d.rating === 5 && d.status !== 'not-again');
  const candidates = fiveStar.length > 0
    ? fiveStar
    : dinners.filter(d => (d.rating ?? 0) >= 4 && d.status !== 'not-again');

  const sorted = [...candidates].sort((a, b) => a.name.localeCompare(b.name));

  if (sorted.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-black mb-4">Go-to Meals</h2>
      <div className="border border-black rounded-xl overflow-hidden divide-y divide-gray-100">
        {sorted.map((dinner) => (
          <div key={dinner.id} className="flex items-center gap-3 px-4 py-3 bg-white">
            <div className="flex-1 min-w-0">
              <span className="font-medium text-black text-sm">{dinner.name}</span>
              {dinner.rating && (
                <span className="ml-2 text-xs text-gray-500">{'★'.repeat(dinner.rating)}</span>
              )}
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 hidden sm:inline-block ${STATUS_STYLES[dinner.status]}`}>
              {STATUS_LABELS[dinner.status]}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {justMadeId === dinner.id ? (
                <span className="text-xs text-gray-400 italic">Marked as made today</span>
              ) : (
                <button
                  onClick={() => handleMadeIt(dinner.id)}
                  className="text-xs px-2 py-1 text-black border border-gray-300 hover:border-black rounded transition-colors"
                >
                  Made it
                </button>
              )}
              <button
                onClick={() => onEdit(dinner)}
                className="text-xs px-2 py-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
