import { NextRequest, NextResponse } from 'next/server';
import { getDinners, saveDinners } from '@/lib/dinners';
import { DinnerInput } from '@/types/dinner';

export async function GET() {
  return NextResponse.json(await getDinners());
}

export async function POST(req: NextRequest) {
  const body: DinnerInput = await req.json();
  const dinners = await getDinners();
  const now = new Date().toISOString();
  const newDinner = {
    ...body,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  dinners.push(newDinner);
  await saveDinners(dinners);
  return NextResponse.json(newDinner, { status: 201 });
}
