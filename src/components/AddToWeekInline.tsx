'use client';

import { useState } from 'react';
import { DayOfWeek, WeekPlan } from '@/types/dinner';

const DAYS: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

interface Props {
  dinnerId: string;
}

export default function AddToWeekInline({ dinnerId }: Props) {
  const [addingToWeek, setAddingToWeek] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | ''>('');
  const [fetchedWeek, setFetchedWeek] = useState<WeekPlan | null>(null);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [weekFeedback, setWeekFeedback] = useState<string | null>(null);

  async function handleOpenPicker() {
    const res = await fetch('/api/week');
    const week: WeekPlan = await res.json();
    setFetchedWeek(week);
    setSelectedDay('');
    setConfirmReplace(false);
    setAddingToWeek(true);
  }

  async function doAssign(day: DayOfWeek) {
    if (!fetchedWeek) return;
    const newWeek = { ...fetchedWeek, [day]: dinnerId };
    await fetch('/api/week', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWeek),
    });
    window.dispatchEvent(new Event('weekUpdated'));
    setWeekFeedback(`Added to ${DAY_LABELS[day]}`);
    setAddingToWeek(false);
    setConfirmReplace(false);
    setSelectedDay('');
    setTimeout(() => setWeekFeedback(null), 3000);
  }

  async function handleAssign() {
    if (!selectedDay || !fetchedWeek) return;
    if (fetchedWeek[selectedDay] && !confirmReplace) {
      setConfirmReplace(true);
      return;
    }
    await doAssign(selectedDay);
  }

  function handleCancelPicker() {
    setAddingToWeek(false);
    setConfirmReplace(false);
    setSelectedDay('');
  }

  if (weekFeedback) {
    return <p className="text-xs text-gray-500">{weekFeedback} ✓</p>;
  }

  if (!addingToWeek) {
    return (
      <button
        onClick={handleOpenPicker}
        className="text-xs text-gray-400 hover:text-black transition-colors"
      >
        + Add to week
      </button>
    );
  }

  if (!confirmReplace) {
    return (
      <div className="flex items-center gap-1.5">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value as DayOfWeek | '')}
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
        >
          <option value="">Choose a day…</option>
          {DAYS.map((day) => (
            <option key={day} value={day}>
              {DAY_LABELS[day]}{fetchedWeek?.[day] ? ' (planned)' : ''}
            </option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          disabled={!selectedDay}
          className="text-xs px-2 py-1 bg-black text-white rounded disabled:opacity-40 transition-colors whitespace-nowrap"
        >
          Add
        </button>
        <button
          onClick={handleCancelPicker}
          className="text-xs px-1 py-1 text-gray-400 hover:text-black transition-colors"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-600">
        {DAY_LABELS[selectedDay as DayOfWeek]} is already planned. Replace it?
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => doAssign(selectedDay as DayOfWeek)}
          className="text-xs px-2 py-1 bg-black text-white rounded transition-colors"
        >
          Yes, replace
        </button>
        <button
          onClick={() => setConfirmReplace(false)}
          className="text-xs px-2 py-1 text-gray-400 hover:text-black transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
