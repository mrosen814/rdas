import fs from 'fs';
import path from 'path';
import { WeekPlan } from '@/types/dinner';

const WEEK_FILE = path.join(process.cwd(), 'data', 'week.json');

export function getWeek(): WeekPlan {
  const raw = fs.readFileSync(WEEK_FILE, 'utf-8');
  return JSON.parse(raw) as WeekPlan;
}

export function saveWeek(week: WeekPlan): void {
  fs.writeFileSync(WEEK_FILE, JSON.stringify(week, null, 2));
}
