import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let profile: any = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  const rows: { label: string; value: string; href?: string }[] = [
    { label: 'Имя', value: profile?.name ?? '—' },
    { label: 'Класс', value: profile?.grade ?? '—' },
    { label: 'Цель', value: profile?.goal ?? '—' },
    { label: 'Предметы', value: (profile?.subjects ?? []).length ? `${profile.subjects.length} выбрано` : '—' },
    { label: 'Подписка', value: profile?.subscription_status === 'pro' ? 'SPIRAI Pro' : 'Free', href: '/app/pricing' },
    { label: 'Язык интерфейса', value: 'Русский' },
    { label: 'Уведомления', value: 'Включены' },
    { label: 'Тон объяснений AI', value: profile?.ai_tone ?? 'Сбалансированный' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Профиль</h1>

      <div className="divide-y divide-border rounded-card border border-border">
        {rows.map((r) => {
          const content = (
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-sm text-secondaryText">{r.label}</span>
              <span className="text-sm font-medium">{r.value} ›</span>
            </div>
          );
          return r.href ? (
            <Link key={r.label} href={r.href}>
              {content}
            </Link>
          ) : (
            <div key={r.label}>{content}</div>
          );
        })}
      </div>

      <Card>
        <div className="text-sm text-secondaryText">Приватность и данные</div>
        <p className="mt-1 text-xs text-secondaryText">
          SPIRAI хранит образовательный контекст (изученные темы, ошибки, прогресс), чтобы персонализировать обучение.
        </p>
        <button className="mt-3 text-sm text-error underline">Удалить аккаунт</button>
      </Card>

      <form action="/api/auth/signout" method="post">
        <button className="btn btn-ghost w-full" type="submit">
          Выйти
        </button>
      </form>
    </div>
  );
}
