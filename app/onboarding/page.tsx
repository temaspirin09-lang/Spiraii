'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { LogoWordmark } from '@/components/SpiralLogo';

const SUBJECTS = [
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

const GOALS = [
  { id: 'exam', title: 'Подготовка к экзамену' },
  { id: 'grades', title: 'Подтянуть оценки' },
  { id: 'homework', title: 'Сделать домашнее задание' },
  { id: 'from_scratch', title: 'Понять предмет с нуля' }
];

const INTENSITY = [
  { id: 'light', title: '10–15 минут в день' },
  { id: 'medium', title: '20–30 минут в день' },
  { id: 'intense', title: 'Интенсивно, готов уделять больше' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('9 класс');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [goal, setGoal] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const totalSteps = 5;

  function toggleSubject(id: string) {
    setSubjects((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  async function finish() {
    setSaving(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase
        .from('profiles')
        .update({
          name,
          grade,
          subjects,
          goal,
          intensity,
          onboarding_completed: true
        })
        .eq('id', userData.user.id);
    }
    await fetch('/api/plan', { method: 'POST', body: JSON.stringify({ goal, subjects }) });
    router.push('/app');
  }

  const canProceed =
    (step === 1 && name.trim().length > 0) ||
    (step === 2 && grade) ||
    (step === 3 && subjects.length > 0) ||
    (step === 4 && goal) ||
    (step === 5 && intensity);

  return (
    <main className="flex min-h-screen flex-col bg-black px-6 py-8 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <LogoWordmark size={26} />
          <span className="text-xs text-mutedText">{step} из {totalSteps}</span>
        </div>

        <div className="mb-8 flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i < step ? 'bg-accent' : 'bg-border'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <StepShell title="Как тебя зовут?">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Твоё имя"
              className="w-full rounded-btn border border-border bg-surface px-4 py-4 text-base outline-none focus:border-accent"
            />
          </StepShell>
        )}

        {step === 2 && (
          <StepShell title="В каком ты классе?">
            <div className="grid grid-cols-3 gap-2">
              {['5','6','7','8','9','10','11','Студент','Другое'].map((g) => (
                <Chip key={g} label={g} active={grade.startsWith(g)} onClick={() => setGrade(g === 'Студент' || g === 'Другое' ? g : `${g} класс`)} />
              ))}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell title="Какие предметы тебе нужны?">
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <Chip key={s.id} label={s.name} active={subjects.includes(s.id)} onClick={() => toggleSubject(s.id)} />
              ))}
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell title="Какая у тебя цель?">
            <div className="flex flex-col gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`card text-left ${goal === g.id ? 'border-accent' : ''}`}
                >
                  {g.title}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell title="Сколько времени готов уделять обучению?">
            <div className="flex flex-col gap-3">
              {INTENSITY.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setIntensity(i.id)}
                  className={`card text-left ${intensity === i.id ? 'border-accent' : ''}`}
                >
                  {i.title}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        <div className="mt-10">
          <Button
            disabled={!canProceed || saving}
            onClick={() => (step < totalSteps ? setStep(step + 1) : finish())}
            className="w-full"
          >
            {step < totalSteps ? 'Далее' : saving ? 'Готовим план…' : 'Начать обучение'}
          </Button>
        </div>
      </div>
    </main>
  );
}

function StepShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fade-in-up">
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
