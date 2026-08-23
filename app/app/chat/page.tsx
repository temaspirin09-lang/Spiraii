'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { ThinkingIndicator } from '@/components/ui/ThinkingIndicator';
import { MarkdownMath } from '@/components/MarkdownMath';

type Msg = { role: 'user' | 'assistant'; text: string };

const MODE_LABELS: Record<string, string> = {
  explain: 'Объясняем',
  solve_together: 'Решаем вместе',
  try_myself: 'Пробуешь сам',
  hint: 'Подсказка',
  show_solution: 'Показываем решение',
  similar_task: 'Похожая задача',
  check_me: 'Проверяем решение'
};

const QUICK_ACTIONS = [
  { label: 'Объяснить проще', mode: 'explain' },
  { label: 'Дать пример', mode: 'similar_task' },
  { label: 'Проверить меня', mode: 'check_me' },
  { label: 'Похожая задача', mode: 'similar_task' }
];

export default function ChatPage() {
  const router = useRouter();
  const [task, setTask] = useState<{ recognized_text: string; subject: string; topic: string } | null>(null);
  const [mode, setMode] = useState<string>('explain');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawTask = sessionStorage.getItem('spirai_task');
    const rawMode = sessionStorage.getItem('spirai_mode');
    if (rawTask) setTask(JSON.parse(rawTask));
    if (rawMode) setMode(rawMode);
  }, []);

  useEffect(() => {
    if (task && messages.length === 0) {
      void sendToAI(mode, []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  async function sendToAI(currentMode: string, historyOverride?: Msg[]) {
    if (!task) return;
    setThinking(true);
    setError(false);
    const history = historyOverride ?? messages;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: task.subject,
          topic: task.topic,
          taskText: task.recognized_text,
          mode: currentMode,
          userLevel: '9 класс',
          history: history.map((m) => ({ role: m.role, text: m.text }))
        })
      });
      if (!res.ok) throw new Error('unavailable');
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setError(true);
    } finally {
      setThinking(false);
    }
  }

  function handleSend() {
    if (!input.trim()) return;
    const newMessages: Msg[] = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    void sendToAI(mode, newMessages);
  }

  function handleQuickAction(newMode: string, label: string) {
    setMode(newMode);
    const newMessages: Msg[] = [...messages, { role: 'user', text: label }];
    setMessages(newMessages);
    void sendToAI(newMode, newMessages);
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
        <div>
          <div className="text-sm font-semibold">{task ? `${task.subject} · ${task.topic}` : 'AI-репетитор'}</div>
          <div className="text-xs text-secondaryText">{MODE_LABELS[mode] ?? mode}</div>
        </div>
        <button className="text-xs text-secondaryText" onClick={() => router.push('/app/mode')}>
          Сменить режим
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pb-3">
        {messages.map((m, i) =>
          m.role === 'assistant' ? (
            <Card key={i} className="bg-elevated">
              <MarkdownMath content={m.text} />
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((qa) => (
                  <button
                    key={qa.label}
                    onClick={() => handleQuickAction(qa.mode, qa.label)}
                    className="chip !py-1.5 !text-xs"
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            </Card>
          ) : (
            <div key={i} className="ml-auto max-w-[85%] rounded-card rounded-tr-sm bg-accent/20 px-4 py-3 text-sm">
              {m.text}
            </div>
          )
        )}

        {thinking && (
          <Card className="bg-elevated">
            <ThinkingIndicator />
          </Card>
        )}

        {error && (
          <div className="card border-error/40 text-error">
            AI временно недоступен. Попробуй через минуту.{' '}
            <button className="underline" onClick={() => sendToAI(mode)}>
              Повторить
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Напиши сообщение…"
          className="flex-1 rounded-btn border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <button className="btn btn-ghost btn-compact !px-3" aria-label="Прикрепить фото">
          📎
        </button>
        <button className="btn btn-accent btn-compact !px-4" onClick={handleSend} aria-label="Отправить">
          ➤
        </button>
      </div>
    </div>
  );
}
