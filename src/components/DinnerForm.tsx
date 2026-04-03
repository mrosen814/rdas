'use client';

import { useState } from 'react';
import { Dinner, DinnerInput, DinnerStatus, STATUS_LABELS, RATING_LABELS } from '@/types/dinner';

interface Props {
  initial?: Dinner;
  existingDinners?: Dinner[];
  onSave: (data: DinnerInput) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

function normalizeName(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

function wordSet(s: string): Set<string> {
  return new Set(normalizeName(s).split(' ').filter(Boolean));
}

function jaccardSimilarity(a: string, b: string): number {
  const wa = wordSet(a);
  const wb = wordSet(b);
  const intersection = [...wa].filter(w => wb.has(w)).length;
  const union = new Set([...wa, ...wb]).size;
  return union === 0 ? 0 : intersection / union;
}

interface DuplicateCheck {
  exact: string[];
  similar: string[];
}

function checkDuplicates(name: string, dinners: Dinner[], excludeId?: string): DuplicateCheck {
  const normalized = normalizeName(name);
  if (!normalized) return { exact: [], similar: [] };

  const candidates = dinners.filter(d => d.id !== excludeId);
  const exact: string[] = [];
  const similar: string[] = [];

  for (const d of candidates) {
    if (normalizeName(d.name) === normalized) {
      exact.push(d.name);
    } else if (jaccardSimilarity(name, d.name) >= 0.5) {
      similar.push(d.name);
    }
  }

  return { exact, similar };
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black';

export default function DinnerForm({ initial, existingDinners, onSave, onDelete, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [status, setStatus] = useState<DinnerStatus>(initial?.status ?? 'want-to-try');
  const [rating, setRating] = useState<string>(initial?.rating?.toString() ?? '');
  const [recipeLink, setRecipeLink] = useState(initial?.recipeLink ?? '');
  const [tags, setTags] = useState(initial?.tags.join(', ') ?? '');
  const [dateMade, setDateMade] = useState(initial?.dateMade ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const duplicates = existingDinners && name.trim()
    ? checkDuplicates(name, existingDinners, initial?.id)
    : { exact: [], similar: [] };

  // Auto-expand optional fields if any are already populated (i.e. editing an existing dinner)
  const hasOptionalData = !!(
    initial?.recipeLink ||
    (initial?.tags?.length ?? 0) > 0 ||
    initial?.dateMade ||
    initial?.notes
  );
  const [showOptional, setShowOptional] = useState(hasOptionalData);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name: name.trim(),
      status,
      rating: rating ? (Number(rating) as 1 | 2 | 3 | 4 | 5) : undefined,
      recipeLink: recipeLink.trim() || undefined,
      notes: notes.trim() || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      dateMade: dateMade || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Required fields */}
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Dinner name <span className="text-gray-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
          placeholder="e.g. Spaghetti Bolognese"
          autoFocus
        />
        {duplicates.exact.length > 0 && (
          <p className="mt-1.5 text-xs text-amber-600">
            A recipe with this name already exists: <span className="font-medium">{duplicates.exact.join(', ')}</span>
          </p>
        )}
        {duplicates.exact.length === 0 && duplicates.similar.length > 0 && (
          <p className="mt-1.5 text-xs text-gray-500">
            Similar recipes already exist: <span className="font-medium">{duplicates.similar.join(', ')}</span>
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as DinnerStatus)}
          className={inputClass}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">Family rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className={inputClass}
        >
          <option value="">— No rating yet —</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} — {RATING_LABELS[r]}</option>
          ))}
        </select>
      </div>

      {/* Optional fields toggle */}
      <button
        type="button"
        onClick={() => setShowOptional((v) => !v)}
        className="text-sm text-gray-500 hover:text-black text-left transition-colors"
      >
        {showOptional ? '− Hide details' : '+ Add details (recipe, tags, notes…)'}
      </button>

      {showOptional && (
        <div className="flex flex-col gap-4 pt-1 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Recipe link</label>
            <input
              type="url"
              value={recipeLink}
              onChange={(e) => setRecipeLink(e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={inputClass}
              placeholder="italian, pasta, kid-friendly (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Date last made</label>
            <input
              type="date"
              value={dateMade}
              onChange={(e) => setDateMade(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Notes / review</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="How did it go? Any tweaks for next time?"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-black border border-black rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
        >
          {initial ? 'Save changes' : 'Add dinner'}
        </button>
      </div>

      {/* Delete (edit mode only) */}
      {initial && onDelete && (
        <div className="pt-2">
          {!confirmingDelete ? (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="text-xs text-gray-400 hover:text-black transition-colors"
            >
              Delete this dinner
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-100 rounded-lg border border-gray-300">
              <span className="text-sm text-black flex-1">
                Are you sure you want to delete this card?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="px-3 py-1.5 text-xs border border-gray-300 text-black rounded-lg hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-3 py-1.5 text-xs bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
                >
                  Yes, delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
