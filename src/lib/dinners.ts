import fs from 'fs';
import path from 'path';
import { Dinner } from '@/types/dinner';

const DATA_FILE = path.join(process.cwd(), 'data', 'dinners.json');

export function getDinners(): Dinner[] {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as Dinner[];
}

export function saveDinners(dinners: Dinner[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(dinners, null, 2));
}
