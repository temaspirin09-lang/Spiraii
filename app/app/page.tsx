import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let profile: any = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  const name = profile?.name ?? 'друг';
  const streak = profile?.streak_current ?? 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {name} 👋
        </h1>
        <p className="mt-1 text-secondaryText">Что будем изучать сегодня?</p>
      </header>

      <Link href="/app/task">
        <Card className="border-accent/40 bg-gradient-to-br from-[#1a1a3a] to-surface p-6 text-left">
          <div className="text-3xl">📸</div>
          <div className="mt-3 text-lg font-semibold">Решить задание</div>
          <div className="mt-1 text-sm text-secondaryText">Сфотографируй или введи текстом</div>
        </Card>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/app/task?voice=1" className="btn btn-ghost justify-start">🎤 Спросить голосом</Link>
        <Link href="/app/task?text=1" className="btn btn-ghost justify-start">⌨️ Задать вопрос</Link>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-secondaryText">Продолжить обучение</h2>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Квадратные уравнения</div>
              <div className="text-xs text-secondaryText">Математика · Алгебра</div>
            </div>
            <Link href="/app/chat" className="btn btn-accent btn-compact">Продолжить</Link>
          </div>
          <div className="mt-3">
            <ProgressBar percent={62} />
          </div>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-secondaryText">Твой прогресс</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {(profile?.subjects ?? ['math', 'physics', 'russian']).map((s: string) => (
            <Link key={s} href={`/app/progress?subject=${s}`} className="min-w-[120px]">
              <Card>
                <div className="text-sm font-medium">{subjectName(s)}</div>
                <div className="mt-2">
                  <ProgressBar percent={40} />
                </div>
                <div className="mt-1 text-xs text-secondaryText">40%</div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-secondaryText">Сегодняшняя цель</h2>
        <Card className="flex items-center justify-between">
          <span>1 из 3 заданий выполнено</span>
          <span className="flex items-center gap-1 text-warning">🔥 {streak} дн.</span>
        </Card>
      </section>
    </div>
  );
}

function subjectName(id: string) {
  const map: Record<string, string> = {
    math: 'Математика',
    physics: 'Физика',
    chemistry: 'Химия',
    biology: 'Биология',
    geography: 'География',
    history: 'История',
    social_studies: 'Обществознание',
    russian: 'Русский язык',
    literature: 'Литература',
    english: 'Английский',
    cs: 'Информатика'
  };
  return map[id] ?? id;
}
