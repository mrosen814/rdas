'use client';

import { useState } from 'react';
import { Dinner, DinnerInput, DinnerStatus, RATING_LABELS } from '@/types/dinner';
import DinnerCard from './DinnerCard';
import DinnerForm from './DinnerForm';
import DinnerStats from './DinnerStats';

const STATUS_FILTERS: Array<{ value: DinnerStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'family-favourite', label: 'Family Favourites' },
  { value: 'classic', label: 'Classics' },
  { value: 'made-before', label: 'Made Before' },
  { value: 'want-to-try', label: 'Want to Try' },
  { value: 'not-again', label: 'Not Again' },
];


/**
 * Pick a random dinner, weighted by rating.
 * - Excludes "not-again" dinners.
 * - Each dinner is added to the pool [rating] times (unrated = weight 2).
 *   A 5-star dinner is 2.5× more likely than an unrated one, and 5× more
 *   likely than a 1-star dinner — simple weighting, no external library needed.
 */
function pickSuggestion(dinners: Dinner[]): Dinner | null {
  const eligible = dinners.filter(d => d.status !== 'not-again');
  if (eligible.length === 0) return null;

  const pool: Dinner[] = [];
  for (const dinner of eligible) {
    const weight = dinner.rating ?? 2;
    for (let i = 0; i < weight; i++) pool.push(dinner);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

interface Props {
  initialDinners: Dinner[];
}

export default function DinnerBoard({ initialDinners }: Props) {
  const [dinners, setDinners] = useState<Dinner[]>(initialDinners);
  const [statusFilter, setStatusFilter] = useState<DinnerStatus | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDinner, setEditingDinner] = useState<Dinner | null>(null);
  const [suggestion, setSuggestion] = useState<Dinner | null>(null);
  const [showHaventMade, setShowHaventMade] = useState(false);

  // Apply status filter first; rating pill counts reflect the active status selection
  const statusFiltered = dinners.filter(
    (d) => statusFilter === 'all' || d.status === statusFilter
  );

  const filtered = statusFiltered
    .filter((d) => ratingFilter === 'all' || d.rating === ratingFilter)
    .filter(
      (d) =>
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );

  // Haven't made in a while: additive filter on top of other filters
  const displayDinners = showHaventMade
    ? filtered
        .filter(d => d.dateMade && d.status !== 'not-again')
        .sort((a, b) => (a.dateMade! < b.dateMade! ? -1 : a.dateMade! > b.dateMade! ? 1 : 0))
        .slice(0, 5)
    : filtered;

  async function handleAdd(data: DinnerInput) {
    const res = await fetch('/api/dinners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const created: Dinner = await res.json();
    setDinners((prev) => [created, ...prev]);
    setShowAddForm(false);
  }

  async function handleEdit(data: DinnerInput) {
    if (!editingDinner) return;
    const res = await fetch(`/api/dinners/${editingDinner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const updated: Dinner = await res.json();
    setDinners((prev) => prev.map((d) => (d.id === editingDinner.id ? updated : d)));
    setEditingDinner(null);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/dinners/${id}`, { method: 'DELETE' });
    setDinners((prev) => prev.filter((d) => d.id !== id));
    setEditingDinner(null);
  }

  async function handleCookAgain(id: string) {
    const today = new Date().toISOString().split('T')[0];
    const current = dinners.find((d) => d.id === id);
    const timesMade = (current?.timesMade ?? 0) + 1;
    const res = await fetch(`/api/dinners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateMade: today, timesMade }),
    });
    const updated: Dinner = await res.json();
    setDinners((prev) => prev.map((d) => (d.id === id ? updated : d)));
  }

  function handlePickForTonight() {
    setSuggestion(pickSuggestion(dinners));
  }

  const isModalOpen = showAddForm || editingDinner !== null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-red-600 leading-tight tracking-[0.06em]">
            R-DAS
          </h1>
          <p className="text-sm font-medium text-gray-700 mt-0.5">
            Rosen Dinner Allocation System
          </p>
          <p className="text-gray-400 mt-1 text-xs">
            {dinners.length} {dinners.length === 1 ? 'dinner' : 'dinners'} tracked
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handlePickForTonight}
            className="bg-white hover:bg-gray-50 text-black font-medium px-4 py-2 rounded-lg text-sm border border-black transition-colors"
          >
            Pick dinner for tonight
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            + Add Dinner
          </button>
        </div>
      </div>

      {/* Tonight's suggestion */}
      {suggestion && (
        <div className="mb-6 p-4 border border-black rounded-xl bg-white">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Tonight&apos;s suggestion
          </p>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-lg font-semibold text-black">{suggestion.name}</p>
              {suggestion.rating && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {'★'.repeat(suggestion.rating)}
                  <span className="text-gray-300">{'★'.repeat(5 - suggestion.rating)}</span>
                  <span className="ml-2">{RATING_LABELS[suggestion.rating]}</span>
                </p>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={handlePickForTonight}
                className="text-sm px-3 py-1.5 border border-gray-300 hover:border-black text-black rounded-lg transition-colors"
              >
                Pick again
              </button>
              <button
                onClick={() => setSuggestion(null)}
                className="text-sm px-3 py-1.5 text-gray-400 hover:text-black transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Row 1: Category pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(({ value, label }) => {
            const count =
              value === 'all'
                ? dinners.length
                : dinners.filter((d) => d.status === value).length;
            return (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === value
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-300 hover:border-black'
                }`}
              >
                {label}
                <span className={`ml-1.5 text-xs ${statusFilter === value ? 'opacity-70' : 'opacity-40'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Rating dropdown + haven't made toggle */}
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-black bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          >
            <option value="all">All ratings</option>
            <option value="5">5★</option>
            <option value="4">4★</option>
            <option value="3">3★</option>
            <option value="2">2★</option>
            <option value="1">1★</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              role="switch"
              aria-checked={showHaventMade}
              onClick={() => setShowHaventMade((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                showHaventMade ? 'bg-black' : 'bg-gray-200'
              }`}
              aria-label="Haven't made in a while"
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                showHaventMade ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
            <span
              className="text-sm text-gray-600 cursor-pointer select-none"
              onClick={() => setShowHaventMade((prev) => !prev)}
            >
              Haven&apos;t made in a while
            </span>
          </div>
        </div>

        {/* Row 3: Search */}
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or tag..."
            className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>
      </div>

      {/* Dinner grid */}
      {displayDinners.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">
            {showHaventMade ? 'No overdue dinners' : 'No dinners found'}
          </p>
          {!showHaventMade && dinners.length === 0 && (
            <p className="text-sm mt-1">Add your first dinner to get started.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayDinners.map((dinner) => (
            <DinnerCard
              key={dinner.id}
              dinner={dinner}
              onEdit={setEditingDinner}
              onCookAgain={handleCookAgain}
            />
          ))}
        </div>
      )}

      {/* Dinner stats */}
      <DinnerStats dinners={dinners} />

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <div className="relative bg-white border border-black rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={() => { setShowAddForm(false); setEditingDinner(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="14" y2="14"/>
                <line x1="14" y1="2" x2="2" y2="14"/>
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-black mb-4">
              {editingDinner ? `Edit: ${editingDinner.name}` : 'Add Dinner'}
            </h2>
            <DinnerForm
              initial={editingDinner ?? undefined}
              existingDinners={dinners}
              onSave={editingDinner ? handleEdit : handleAdd}
              onDelete={editingDinner ? () => handleDelete(editingDinner.id) : undefined}
              onCancel={() => {
                setShowAddForm(false);
                setEditingDinner(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
