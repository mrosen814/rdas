'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'rdas_auth';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  // null = unknown (pre-hydration), true/false = resolved
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAuthenticated(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1');
      setAuthenticated(true);
    } else {
      setError('Incorrect password.');
      setPassword('');
    }
  }

  // Avoid flash: render nothing until localStorage has been checked
  if (authenticated === null) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-red-600 tracking-[0.06em]">R-DAS</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Rosen Dinner Allocation System</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Password"
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          />
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
