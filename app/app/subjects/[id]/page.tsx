import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

const NAMES: Record<string, string> = {
  math: 'Математика',
  physics: 'Физика',
  chemistry: 'Химия',
  biology: 'Биология',
  geography: 'География',
  history: 'История',
  social_studies: 'Обществознание',
  russian: 'Русский язык',
  literature: 'Литература',
  english: 'Английский язык',
  cs: 'Информатика'
};

export default async function SubjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: topics } = await supabase.from('topics').select('*').eq('subject_id', params.id);

  return (
    <div className="space-y-4">
      <Link href="/app/subjects" className="text-sm text-secondaryText">
        ‹ Учёба
      </Link>
      <h1 className="text-xl font-bold">{NAMES[params.id] ?? params.id}</h1>

      {(!topics || topics.length === 0) && (
        <Card>
          <p className="text-sm text-secondaryText">
            Темы для этого предмета пока не добавлены в каталог. Наполните таблицу `topics` в Supabase
            согласно структуре из 07_Subjects.md.
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {(topics ?? []).map((t: any) => (
          <Card key={t.id} className="flex items-center justify-between">
            <span>{t.name}</span>
            <span className="text-xs text-secondaryText">{t.difficulty}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
