export type DinnerStatus = 'want-to-try' | 'made-before' | 'family-favourite' | 'classic' | 'not-again';

export const STATUS_LABELS: Record<DinnerStatus, string> = {
  'want-to-try': 'Want to Try',
  'made-before': 'Made Before',
  'family-favourite': 'Family Favourite',
  'classic': 'Classic',
  'not-again': 'Not Again',
};

// Centralised colour map — used by filter chips, recipe card badges, and the logo
export const STATUS_COLORS: Record<DinnerStatus, { idle: string; active: string; logoColor: string }> = {
  'family-favourite': { idle: 'bg-white text-black border border-green-400',  active: 'bg-white text-black border border-green-600',  logoColor: 'text-green-500'  },
  'classic':          { idle: 'bg-white text-black border border-blue-400',   active: 'bg-white text-black border border-blue-600',   logoColor: 'text-blue-500'   },
  'made-before':      { idle: 'bg-white text-black border border-purple-400', active: 'bg-white text-black border border-purple-600', logoColor: 'text-purple-500' },
  'want-to-try':      { idle: 'bg-white text-black border border-yellow-400', active: 'bg-white text-black border border-yellow-600', logoColor: 'text-yellow-500' },
  'not-again':        { idle: 'bg-white text-black border border-red-400',    active: 'bg-white text-black border border-red-600',    logoColor: 'text-red-500'    },
};

export const RATING_LABELS: Record<number, string> = {
  5: 'Loved it',
  4: 'Liked it',
  3: 'It was ok',
  2: "Didn't love it",
  1: 'Would not eat again',
};

export interface Dinner {
  id: string;
  name: string;
  recipeLink?: string;
  status: DinnerStatus;
  rating?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  tags: string[];
  dateMade?: string;   // YYYY-MM-DD
  timesMade?: number;  // incremented on each "Made it"
  createdAt: string;   // ISO timestamp
  updatedAt: string;   // ISO timestamp
}

export type DinnerInput = Omit<Dinner, 'id' | 'createdAt' | 'updatedAt'>;

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type WeekPlan = Record<DayOfWeek, string | null>;
