// app/api/expenses/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use your existing supabaseAdmin from lib/supabaseAdmin.js
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const category = searchParams.get('category');

  let query = supabaseAdmin
    .from('expenses')
    .select('*')
    .order('incurred_on', { ascending: false })
    .limit(500);

  if (from) query = query.gte('incurred_on', from);
  if (to) query = query.lte('incurred_on', to);
  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const { category, description, amount, vendor, incurred_on } = body;

  const { data, error } = await supabaseAdmin
    .from('expenses')
    .insert([{
      category,
      description,
      amount: parseFloat(amount),
      vendor,
      incurred_on: incurred_on || new Date().toISOString().slice(0, 10)
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}