// app/api/revenues/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let query = supabaseAdmin
    .from('revenues')
    .select(`
      *,
      inventory_items(name)
    `)
    .order('sold_at', { ascending: false })
    .limit(500);

  if (from) query = query.gte('sold_at', from);
  if (to) query = query.lte('sold_at', to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const { item_id, quantity, unit_price } = body;
  const total = parseFloat(quantity) * parseFloat(unit_price);

  try {
    // Insert revenue record
    const { data: revenue, error: revenueError } = await supabaseAdmin
      .from('revenues')
      .insert([{
        item_id,
        quantity: parseInt(quantity),
        unit_price: parseFloat(unit_price),
        total
      }])
      .select()
      .single();

    if (revenueError) throw revenueError;

    // Insert inventory log (stock out)
    const { data: log, error: logError } = await supabaseAdmin
      .from('inventory_logs')
      .insert([{
        item_id,
        type: 'out',
        quantity: parseInt(quantity),
        total_amount: total,
        note: 'Sale'
      }])
      .select()
      .single();

    if (logError) throw logError;

    return NextResponse.json({ revenue, log });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}