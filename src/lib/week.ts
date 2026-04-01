import { redis } from './redis';
import { WeekPlan } from '@/types/dinner';

const KEY = 'week';

const EMPTY_WEEK: WeekPlan = {
  monday: null, tuesday: null, wednesday: null, thursday: null,
  friday: null, saturday: null, sunday: null,
};

export async function getWeek(): Promise<WeekPlan> {
  const data = await redis.get<WeekPlan>(KEY);
  return data ?? EMPTY_WEEK;
}

export async function saveWeek(week: WeekPlan): Promise<void> {
  await redis.set(KEY, week);
}
