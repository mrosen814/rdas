'use client';

import { useState } from 'react';
import { Dinner, DinnerInput, DinnerStatus, RATING_LABELS } from '@/types/dinner';
import DinnerCard from './DinnerCard';
import DinnerForm from './DinnerForm';
import DinnerStats from './DinnerStats';
import HaventMadeInAWhile from './HaventMadeInAWhile';

const STATUS_FILTERS: Array<{ value: DinnerStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'family-favourite', label: 'Family Favourites' },
  { value: 'made-before', label: 'Made Before' },
  { value: 'want-to-try', label: 'Want to Try' },
  { value: 'not-again', label: 'Not Again' },
];

const RATING_FILTERS: Array<{ value: number | 'all'; label: string }> = [
  { value: 'all', label: 'All ratings' },
  { value: 5, label: '5★' },
  { value: 4, label: '4★' },
  { value: 3, label: '3★' },
  { value: 2, label: '2★' },
  { value: 1, label: '1★' },
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
          <h1 className="text-3xl font-black text-red-600 leading-tight tracking-tight">
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
      <div className="flex flex-col gap-2 mb-4">
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

        <div className="flex items-center gap-2 flex-wrap">
          {RATING_FILTERS.map(({ value, label }) => {
            const count =
              value === 'all'
                ? statusFiltered.length
                : statusFiltered.filter((d) => d.rating === value).length;
            return (
              <button
                key={value}
                onClick={() => setRatingFilter(value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  ratingFilter === value
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-300 hover:border-black'
                }`}
              >
                {label}
                <span className={`ml-1.5 text-xs ${ratingFilter === value ? 'opacity-70' : 'opacity-40'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or tag..."
          className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
        />
      </div>

      {/* Dinner grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No dinners found</p>
          {dinners.length === 0 && (
            <p className="text-sm mt-1">Add your first dinner to get started.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dinner) => (
            <DinnerCard
              key={dinner.id}
              dinner={dinner}
              onEdit={setEditingDinner}
              onCookAgain={handleCookAgain}
            />
          ))}
        </div>
      )}

      {/* Dinner stats + Haven't made in a while */}
      <DinnerStats dinners={dinners} />
      <HaventMadeInAWhile
        dinners={dinners}
        onCookAgain={handleCookAgain}
        onEdit={setEditingDinner}
      />

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddForm(false);
              setEditingDinner(null);
            }
          }}
        >
          <div className="bg-white border border-black rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-black mb-4">
              {editingDinner ? `Edit: ${editingDinner.name}` : 'Add Dinner'}
            </h2>
            <DinnerForm
              initial={editingDinner ?? undefined}
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
