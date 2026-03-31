export type DinnerStatus = 'want-to-try' | 'made-before' | 'family-favourite' | 'not-again';

export const STATUS_LABELS: Record<DinnerStatus, string> = {
  'want-to-try': 'Want to Try',
  'made-before': 'Made Before',
  'family-favourite': 'Family Favourite',
  'not-again': 'Not Again',
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
