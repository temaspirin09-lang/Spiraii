import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
  }

  const { subjects }: { goal?: string; subjects: string[] } = await request.json();

  const { data: topics } = await supabase
    .from('topics')
    .select('id, subject_id, name')
    .in('subject_id', subjects && subjects.length ? subjects : ['math'])
    .limit(30);

  const planRows = (topics ?? []).map((t, index) => ({
    user_id: user.id,
    day_number: index + 1,
    topic_id: t.id,
    scheduled_date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  }));

  if (planRows.length > 0) {
    await supabase.from('personal_plan').insert(planRows);
  }

  return NextResponse.json({ days: planRows.length });
}
