import { NextRequest, NextResponse } from 'next/server';
import { getWeek, saveWeek } from '@/lib/week';
import { WeekPlan } from '@/types/dinner';

export async function GET() {
  return NextResponse.json(getWeek());
}

export async function PUT(req: NextRequest) {
  const body: WeekPlan = await req.json();
  saveWeek(body);
  return NextResponse.json(body);
}
