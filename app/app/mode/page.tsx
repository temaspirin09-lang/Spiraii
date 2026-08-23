'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';

const MODES: { id: string; title: string; icon: string; desc: string }[] = [
  { id: 'explain', title: 'Объяснить', icon: '💡', desc: 'Простое объяснение темы' },
  { id: 'solve_together', title: 'Решить вместе', icon: '🤝', desc: 'Пошагово, вместе с AI' },
  { id: 'try_myself', title: 'Попробую сам', icon: '✍️', desc: 'AI не вмешивается' },
  { id: 'hint', title: 'Подсказка', icon: '🔎', desc: 'Наводка к текущему шагу' },
  { id: 'show_solution', title: 'Показать решение', icon: '📖', desc: 'Полный разбор' },
  { id: 'similar_task', title: 'Похожая задача', icon: '🔁', desc: 'Для закрепления' },
  { id: 'check_me', title: 'Проверить меня', icon: '✅', desc: 'Пришли своё решение' }
];

export default function ModeSelectPage() {
  const router = useRouter();
  const [task, setTask] = useState<{ recognized_text: string; subject: string; topic: string } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('spirai_task');
    if (raw) setTask(JSON.parse(raw));
  }, []);

  function selectMode(modeId: string) {
    sessionStorage.setItem('spirai_mode', modeId);
    router.push('/app/chat');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Как будем работать над заданием?</h1>
        {task && (
          <p className="mt-1 text-sm text-secondaryText">
            {task.subject} · {task.topic}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MODES.map((m) => (
          <button key={m.id} onClick={() => selectMode(m.id)} className="text-left">
            <Card className="h-full">
              <div className="text-2xl">{m.icon}</div>
              <div className="mt-2 text-sm font-semibold">{m.title}</div>
              <div className="mt-1 text-xs text-secondaryText">{m.desc}</div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
