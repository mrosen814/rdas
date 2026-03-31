'use client';

import { useState } from 'react';
import { Dinner } from '@/types/dinner';
import AddToWeekInline from './AddToWeekInline';

const MAX_SHOWN = 5;

interface Props {
  dinners: Dinner[];
  onCookAgain: (id: string) => void;
  onEdit: (dinner: Dinner) => void;
}

export default function HaventMadeInAWhile({ dinners, onCookAgain, onEdit }: Props) {
  const [justMadeId, setJustMadeId] = useState<string | null>(null);

  function handleMadeIt(id: string) {
    onCookAgain(id);
    setJustMadeId(id);
    setTimeout(() => setJustMadeId(null), 3000);
  }

  // Only dinners that have been made at least once and aren't "not-again".
  // Sorted oldest-first so the most overdue meals appear at the top.
  const candidates = dinners
    .filter(d => d.dateMade && d.status !== 'not-again')
    .sort((a, b) => (a.dateMade! < b.dateMade! ? -1 : a.dateMade! > b.dateMade! ? 1 : 0))
    .slice(0, MAX_SHOWN);

  if (candidates.length === 0) return null;

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-black mb-4">Haven&apos;t Made in a While</h2>
      <div className="border border-black rounded-xl overflow-hidden divide-y divide-gray-100">
        {candidates.map((dinner) => (
          <div key={dinner.id} className="flex flex-col px-4 py-3 bg-white gap-2">
            {/* Main row: name + date + actions */}
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <span className="font-medium text-black text-sm">{dinner.name}</span>
                {dinner.dateMade && (
                  <span className="ml-2 text-xs text-gray-400">
                    Last made: {formatDate(dinner.dateMade)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {justMadeId === dinner.id ? (
                  <span className="text-xs text-gray-400 italic whitespace-nowrap">Marked as made today</span>
                ) : (
                  <button
                    onClick={() => handleMadeIt(dinner.id)}
                    className="text-xs px-2 py-1 text-black border border-gray-300 hover:border-black rounded transition-colors whitespace-nowrap"
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
            {/* Add to week */}
            <AddToWeekInline dinnerId={dinner.id} />
          </div>
        ))}
      </div>
    </section>
  );
}
