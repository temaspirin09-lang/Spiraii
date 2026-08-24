import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=mailru_no_code`);
  }

  const clientId = process.env.MAILRU_CLIENT_ID;
  const clientSecret = process.env.MAILRU_CLIENT_SECRET;
  const redirectUri = `${origin}/api/auth/mailru/callback`;

  try {
    const tokenRes = await fetch('https://oauth.mail.ru/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId ?? '',
        client_secret: clientSecret ?? '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error('Mail.ru: не получен access_token');

    const userInfoRes = await fetch(`https://oauth.mail.ru/userinfo?access_token=${accessToken}`);
    const userInfo = await userInfoRes.json();

    const admin = createAdminClient();

    const virtualEmail = userInfo.email ?? `mailru_${userInfo.id}@spirai.mailru.local`;

    const { data: existing } = await admin.auth.admin.listUsers();
    let userId = existing?.users?.find((u: any) => u.email === virtualEmail)?.id;

    if (!userId) {
      const { data: created, error } = await admin.auth.admin.createUser({
        email: virtualEmail,
        email_confirm: true,
        user_metadata: { name: userInfo.name, provider: 'mailru', mailru_id: userInfo.id }
      });
      if (error) throw error;
      userId = created.user?.id;
    }

    if (userId) {
      await admin.from('profiles').upsert(
        { id: userId, provider: 'mailru', name: userInfo.name ?? null },
        { onConflict: 'id', ignoreDuplicates: true }
      );

      const { data: linkData } = await admin.auth.admin.generateLink({
        type: 'magiclink',
        email: virtualEmail
      });
      if (linkData?.properties?.action_link) {
        return NextResponse.redirect(linkData.properties.action_link);
      }
    }

    return NextResponse.redirect(`${origin}/onboarding`);
  } catch (err) {
    console.error('Mail.ru OAuth error', err);
    return NextResponse.redirect(`${origin}/login?error=mailru_failed`);
  }
}
