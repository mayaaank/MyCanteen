// app/api/inventory-items/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .select('*')
    .order('name');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const { name, category, unit_price, selling_price, current_stock, supplier, unit } = body;

  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .insert([{
      name,
      category,
      unit: unit || 'pcs',
      unit_price: parseFloat(unit_price || 0),
      selling_price: selling_price ? parseFloat(selling_price) : null,
      current_stock: parseInt(current_stock || 0),
      supplier
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}