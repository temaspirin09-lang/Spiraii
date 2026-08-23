import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          provider: 'google',
          name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null
        },
        { onConflict: 'id', ignoreDuplicates: true }
      );
    }
  }

  return NextResponse.redirect(`${origin}/onboarding`);
}
