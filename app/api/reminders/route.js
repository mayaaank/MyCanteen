// app/api/reminders/route.js
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('reminders')
    .select(`
      *,
      inventory_items(name)
    `)
    .order('next_due_date');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const { name, item_id, description, recurrence, next_due_date } = body;

  const { data, error } = await supabaseAdmin
    .from('reminders')
    .insert([{
      name,
      item_id,
      description,
      recurrence,
      next_due_date
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}