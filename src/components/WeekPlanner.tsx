'use client';

import { useState, useEffect } from 'react';
import { Dinner, DayOfWeek, WeekPlan } from '@/types/dinner';

const DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const EMPTY_WEEK: WeekPlan = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
};

interface Props {
  initialWeek: WeekPlan;
  dinners: Dinner[];
}

export default function WeekPlanner({ initialWeek, dinners }: Props) {
  const [week, setWeek] = useState<WeekPlan>(initialWeek);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Re-sync when a card's "Add to week" writes directly to the API
  useEffect(() => {
    function handleExternalUpdate() {
      fetch('/api/week')
        .then((r) => r.json())
        .then((data: WeekPlan) => {
          setWeek(data);
          setIsDirty(false);
        });
    }
    window.addEventListener('weekUpdated', handleExternalUpdate);
    return () => window.removeEventListener('weekUpdated', handleExternalUpdate);
  }, []);

  const sortedDinners = [...dinners].sort((a, b) => a.name.localeCompare(b.name));

  function handleChange(day: DayOfWeek, value: string) {
    setWeek((prev) => ({ ...prev, [day]: value || null }));
    setIsDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    await fetch('/api/week', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(week),
    });
    setSaving(false);
    setIsDirty(false);
  }

  async function handleClear() {
    setWeek(EMPTY_WEEK);
    await fetch('/api/week', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(EMPTY_WEEK),
    });
    setIsDirty(false);
  }

  return (
    <section className="max-w-5xl mx-auto px-4 pb-12">
      <hr className="border-gray-200 mb-8" />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-black">Dinner This Week</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-sm text-black border border-black rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear week
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save week'}
          </button>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {DAYS.map((day) => (
          <div key={day} className="flex items-center gap-4 py-3">
            <span className="w-24 text-sm font-medium text-black shrink-0">
              {DAY_LABELS[day]}
            </span>
            <select
              value={week[day] ?? ''}
              onChange={(e) => handleChange(day, e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="">— Not planned —</option>
              {sortedDinners.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}
