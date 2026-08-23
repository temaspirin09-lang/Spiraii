import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default async function ProgressPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let profile: any = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Мой прогресс</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Серия дней" value={`${profile?.streak_current ?? 0} 🔥`} />
        <StatCard label="Уровень" value={`${profile?.level ?? 1}`} />
        <StatCard label="Решено заданий" value="24" />
        <StatCard label="% правильных" value="78%" />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-secondaryText">По предметам</h2>
        <div className="space-y-3">
          {['Математика', 'Русский язык', 'Английский язык'].map((s) => (
            <Card key={s}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{s}</span>
                <span className="text-xs text-secondaryText">45%</span>
              </div>
              <div className="mt-2">
                <ProgressBar percent={45} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-secondaryText">Слабые темы</h2>
        <Card className="border-warning/40">
          <div className="flex items-center justify-between">
            <span className="text-sm">Раскрытие скобок</span>
            <button className="text-xs text-warning underline">Повторить</button>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-secondaryText">Сильные темы</h2>
        <Card className="border-success/40">
          <span className="text-sm">Линейные уравнения — 92%</span>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-secondaryText">Достижения</h2>
        <div className="flex flex-col gap-2">
          <Card className="flex items-center gap-3">
            <span className="text-xl">🏅</span>
            <div>
              <div className="text-sm font-medium">7 дней подряд</div>
              <div className="text-xs text-secondaryText">Получено 2 дня назад</div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <div className="text-xs text-secondaryText">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </Card>
  );
}
