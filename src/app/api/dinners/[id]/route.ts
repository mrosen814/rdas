import { NextRequest, NextResponse } from 'next/server';
import { getDinners, saveDinners } from '@/lib/dinners';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const dinners = await getDinners();
  const idx = dinners.findIndex((d) => d.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const updated: typeof dinners[number] = { ...dinners[idx], ...body, updatedAt: new Date().toISOString() };
  if (updated.recipeLink === '') updated.recipeLink = undefined;
  dinners[idx] = updated;
  await saveDinners(dinners);
  return NextResponse.json(dinners[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const dinners = await getDinners();
  const filtered = dinners.filter((d) => d.id !== params.id);
  if (filtered.length === dinners.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await saveDinners(filtered);
  return NextResponse.json({ success: true });
}
