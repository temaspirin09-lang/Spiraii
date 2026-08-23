'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

type Stage = 'input' | 'recognizing' | 'confirm' | 'low_confidence' | 'error';

export default function TaskInputPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('input');
  const [mode, setMode] = useState<'photo' | 'text'>('photo');
  const [textInput, setTextInput] = useState('');
  const [recognized, setRecognized] = useState<{ recognized_text: string; subject: string; topic: string; confidence: number } | null>(null);
  const [editableText, setEditableText] = useState('');

  async function handleFile(file: File) {
    setStage('recognizing');
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const res = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type })
        });
        if (!res.ok) throw new Error('ocr_failed');
        const data = await res.json();
        setRecognized(data);
        setEditableText(data.recognized_text);
        setStage(data.confidence < 0.5 ? 'low_confidence' : 'confirm');
      } catch {
        setStage('error');
      }
    };
    reader.readAsDataURL(file);
  }

  function submitTextTask() {
    sessionStorage.setItem(
      'spirai_task',
      JSON.stringify({ recognized_text: textInput, subject: 'math', topic: 'Без темы', confidence: 1 })
    );
    router.push('/app/mode');
  }

  function confirmTask() {
    sessionStorage.setItem(
      'spirai_task',
      JSON.stringify({ ...recognized, recognized_text: editableText })
    );
    router.push('/app/mode');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Ввести задание</h1>

      {stage === 'input' && (
        <>
          <div className="flex gap-2 rounded-chip border border-border p-1">
            <button
              onClick={() => setMode('photo')}
              className={`flex-1 rounded-chip py-2 text-sm ${mode === 'photo' ? 'bg-accent/15 text-accent' : 'text-secondaryText'}`}
            >
              Фото
            </button>
            <button
              onClick={() => setMode('text')}
              className={`flex-1 rounded-chip py-2 text-sm ${mode === 'text' ? 'bg-accent/15 text-accent' : 'text-secondaryText'}`}
            >
              Текст
            </button>
          </div>

          {mode === 'photo' && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border bg-surface p-10 text-center">
              <div className="text-4xl">📷</div>
              <p className="text-sm text-secondaryText">Сделай фото задания или выбери из галереи</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <Button onClick={() => fileInputRef.current?.click()}>Открыть камеру / галерею</Button>
            </div>
          )}

          {mode === 'text' && (
            <div className="space-y-3">
              <textarea
                autoFocus
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={6}
                placeholder="Введи условие задания…"
                className="w-full rounded-btn border border-border bg-surface p-4 text-base outline-none focus:border-accent"
              />
              <Button disabled={!textInput.trim()} onClick={submitTextTask} className="w-full">
                Продолжить
              </Button>
            </div>
          )}
        </>
      )}

      {stage === 'recognizing' && (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-card">
            <Skeleton className="h-64 w-full" />
            <div className="absolute inset-x-0 top-0 h-1 animate-pulse bg-accent" />
          </div>
          <p className="text-center text-sm text-secondaryText">Распознаём задание…</p>
        </div>
      )}

      {stage === 'confirm' && recognized && (
        <div className="space-y-4">
          <p className="text-sm text-secondaryText">Проверь, правильно ли я прочитал условие:</p>
          <textarea
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            rows={5}
            className="w-full rounded-btn border border-border bg-surface p-4 text-base outline-none focus:border-accent"
          />
          <div className="text-xs text-secondaryText">
            Предмет: {recognized.subject} · Тема: {recognized.topic}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setStage('input')}>
              Переснять
            </Button>
            <Button className="flex-1" onClick={confirmTask}>
              Верно, продолжить
            </Button>
          </div>
        </div>
      )}

      {stage === 'low_confidence' && recognized && (
        <div className="space-y-4">
          <div className="card border-warning/40 text-warning">
            Я не могу точно прочитать это задание. Попробуй сфотографировать его ближе и при хорошем освещении, либо исправь текст вручную.
          </div>
          <textarea
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            rows={5}
            className="w-full rounded-btn border border-border bg-surface p-4 text-base outline-none focus:border-accent"
          />
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setStage('input')}>
              Переснять
            </Button>
            <Button className="flex-1" onClick={confirmTask}>
              Всё верно, продолжить
            </Button>
          </div>
        </div>
      )}

      {stage === 'error' && (
        <div className="space-y-4">
          <div className="card border-error/40 text-error">
            Не получилось распознать текст. Попробуй ввести задание вручную.
          </div>
          <Button className="w-full" onClick={() => { setMode('text'); setStage('input'); }}>
            Ввести текстом
          </Button>
        </div>
      )}
    </div>
  );
}
