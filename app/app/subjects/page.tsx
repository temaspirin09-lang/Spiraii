import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default async function SubjectsPage() {
  const supabase = createClient();
  const { data: subjects } = await supabase.from('subjects_catalog').select('*');

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Учёба</h1>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-secondaryText">Твой план</h2>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-secondaryText">День 3 из 30</div>
              <div className="font-semibold">Функции</div>
            </div>
            <Link href="/app/task" className="btn btn-accent btn-compact">
              Начать
            </Link>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-secondaryText">Давай повторим эту тему?</h2>
        <Card className="border-warning/40">
          <div className="text-sm">Ты часто ошибаешься при раскрытии скобок.</div>
          <Link href="/app/task" className="mt-2 inline-block text-sm text-warning underline">
            Повторить
          </Link>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-secondaryText">Все предметы</h2>
        {(subjects ?? FALLBACK_SUBJECTS).map((s: any) => (
          <Link key={s.id} href={`/app/subjects/${s.id}`}>
            <Card className="flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="mt-2 w-40">
                  <ProgressBar percent={30} />
                </div>
              </div>
              <span className="text-secondaryText">›</span>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}

const FALLBACK_SUBJECTS = [
  { id: 'math', name: 'Математика' },
  { id: 'physics', name: 'Физика' },
  { id: 'chemistry', name: 'Химия' },
  { id: 'biology', name: 'Биология' },
  { id: 'geography', name: 'География' },
  { id: 'history', name: 'История' },
  { id: 'social_studies', name: 'Обществознание' },
  { id: 'russian', name: 'Русский язык' },
  { id: 'literature', name: 'Литература' },
  { id: 'english', name: 'Английский язык' },
  { id: 'cs', name: 'Информатика' }
];
