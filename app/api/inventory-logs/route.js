// app/api/inventory-logs/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const item_id = searchParams.get('item_id');

  let query = supabaseAdmin
    .from('inventory_logs')
    .select(`
      *,
      inventory_items(name)
    `)
    .order('logged_at', { ascending: false })
    .limit(100);

  if (item_id) query = query.eq('item_id', item_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const { item_id, type, quantity, total_amount, note } = body;

  const { data, error } = await supabaseAdmin
    .from('inventory_logs')
    .insert([{
      item_id,
      type,
      quantity: parseInt(quantity),
      total_amount: total_amount ? parseFloat(total_amount) : null,
      note
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}