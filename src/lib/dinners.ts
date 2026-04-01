import { redis } from './redis';
import { Dinner } from '@/types/dinner';

const KEY = 'dinners';

export async function getDinners(): Promise<Dinner[]> {
  const data = await redis.get<Dinner[]>(KEY);
  return data ?? [];
}

export async function saveDinners(dinners: Dinner[]): Promise<void> {
  await redis.set(KEY, dinners);
}
