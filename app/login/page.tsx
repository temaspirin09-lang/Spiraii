'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogoWordmark } from '@/components/SpiralLogo';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function signInWithGoogle() {
    setLoading('google');
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  }

  function signInWithMailru() {
    setLoading('mailru');
    // Кастомный OAuth-флоу Mail.ru ID (не входит "из коробки" в Supabase Auth).
    // См. app/api/auth/mailru/callback/route.ts и README.md для деталей.
    // Mail.ru требует обязательный параметр state (защита от CSRF) — генерируем
    // случайное значение и сохраняем его для последующей проверки в callback.
    const state = crypto.randomUUID();
    sessionStorage.setItem('spirai_mailru_state', state);
    const clientId = process.env.NEXT_PUBLIC_MAILRU_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/mailru/callback`;
    const url = `https://oauth.mail.ru/login?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=userinfo&state=${state}`;
    window.location.href = url;
  }

  function continueAsGuest() {
    router.push('/onboarding?guest=1');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
      <div className="mb-10">
        <LogoWordmark size={36} />
      </div>

      <div className="w-full max-w-sm space-y-3">
        <h1 className="mb-6 text-center text-2xl font-semibold">Войти в SPIRAI</h1>

        <button onClick={signInWithGoogle} disabled={!!loading} className="btn btn-ghost w-full justify-center gap-3">
          <GoogleIcon /> {loading === 'google' ? 'Открываем Google…' : 'Продолжить с Google'}
        </button>

        <button onClick={signInWithMailru} disabled={!!loading} className="btn btn-ghost w-full justify-center gap-3">
          <MailruIcon /> {loading === 'mailru' ? 'Открываем Mail.ru…' : 'Продолжить с Mail.ru'}
        </button>

        <button onClick={continueAsGuest} className="btn btn-text mx-auto mt-4 block">
          Продолжить без регистрации
        </button>
      </div>

      <p className="mt-10 max-w-sm text-center text-xs text-mutedText">
        Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности SPIRAI.
      </p>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.35-1.7 3.96-5.5 3.96-3.31 0-6-2.74-6-6.06s2.69-6.06 6-6.06c1.88 0 3.14.8 3.86 1.49l2.63-2.53C16.9 3.16 14.7 2.1 12 2.1 6.98 2.1 2.9 6.18 2.9 11.2s4.08 9.1 9.1 9.1c5.25 0 8.73-3.69 8.73-8.89 0-.6-.07-1.05-.15-1.5H12z"/>
    </svg>
  );
}

function MailruIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#005FF9" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fill="white" fontFamily="Arial">M</text>
    </svg>
  );
}
