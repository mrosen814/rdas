'use client';

import { useState } from 'react';
import { Dinner, STATUS_LABELS, RATING_LABELS } from '@/types/dinner';
import AddToWeekInline from './AddToWeekInline';

const STATUS_STYLES: Record<string, string> = {
  'family-favourite': 'bg-black text-white',
  'made-before':      'bg-gray-200 text-black',
  'want-to-try':      'bg-white text-black border border-gray-400',
  'not-again':        'bg-gray-600 text-white',
};

interface Props {
  dinner: Dinner;
  onEdit: (dinner: Dinner) => void;
  onCookAgain: (id: string) => void;
}

export default function DinnerCard({ dinner, onEdit, onCookAgain }: Props) {
  const [justMade, setJustMade] = useState(false);

  const formattedDate = dinner.dateMade
    ? new Date(dinner.dateMade + 'T00:00:00').toLocaleDateString('en-AU', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

  function handleMadeIt() {
    onCookAgain(dinner.id);
    setJustMade(true);
    setTimeout(() => setJustMade(false), 3000);
  }

  return (
    <div className="bg-white rounded-xl border border-black p-4 flex flex-col gap-3">
      {/* Name + status */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-black text-base leading-snug">{dinner.name}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap shrink-0 ${STATUS_STYLES[dinner.status]}`}>
          {STATUS_LABELS[dinner.status]}
        </span>
      </div>

      {/* Rating */}
      {dinner.rating && (
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-none">
            <span className="text-black">{'★'.repeat(dinner.rating)}</span>
            <span className="text-gray-300">{'★'.repeat(5 - dinner.rating)}</span>
          </span>
          <span className="text-xs text-gray-500">{RATING_LABELS[dinner.rating]}</span>
        </div>
      )}

      {/* Tags */}
      {dinner.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {dinner.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-black px-2 py-0.5 rounded-full border border-gray-300">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {dinner.notes && (
        <p className="text-sm text-gray-600 line-clamp-2">{dinner.notes}</p>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-auto">
        <div className="flex items-center gap-3 text-xs text-gray-500 min-w-0 overflow-hidden">
          {formattedDate && <span className="truncate">Last made: {formattedDate}</span>}
          {dinner.recipeLink && (
            <a href={dinner.recipeLink} target="_blank" rel="noopener noreferrer"
              className="text-black underline hover:no-underline">
              Recipe
            </a>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {justMade ? (
            <span className="text-xs text-gray-400 italic whitespace-nowrap">Marked as made today</span>
          ) : (
            <button onClick={handleMadeIt}
              className="text-xs px-2 py-1 text-black border border-gray-300 hover:border-black rounded transition-colors whitespace-nowrap">
              Made it
            </button>
          )}
          <button onClick={() => onEdit(dinner)}
            className="text-xs px-2 py-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors">
            Edit
          </button>
        </div>
      </div>

      {/* Add to week */}
      <div className="pt-1 border-t border-gray-100">
        <AddToWeekInline dinnerId={dinner.id} />
      </div>
    </div>
  );
}
