import { NextRequest, NextResponse } from 'next/server';
import { getDinners, saveDinners } from '@/lib/dinners';
import { DinnerInput } from '@/types/dinner';

export async function GET() {
  return NextResponse.json(getDinners());
}

export async function POST(req: NextRequest) {
  const body: DinnerInput = await req.json();
  const dinners = getDinners();
  const now = new Date().toISOString();
  const newDinner = {
    ...body,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  dinners.push(newDinner);
  saveDinners(dinners);
  return NextResponse.json(newDinner, { status: 201 });
}
