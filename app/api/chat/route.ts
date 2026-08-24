import { NextResponse } from 'next/server';
import { completeChat, type ChatMessage } from '@/lib/ai/yandexgpt';
import { buildTutorSystemPrompt, type TutorMode } from '@/lib/ai/tutorPrompt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      subject,
      topic,
      taskText,
      mode,
      userLevel,
      userGoal,
      weakPatterns,
      isExamInProgress,
      history
    }: {
      subject: string;
      topic: string;
      taskText: string;
      mode: TutorMode;
      userLevel: string;
      userGoal?: string;
      weakPatterns?: string[];
      isExamInProgress?: boolean;
      history: { role: 'user' | 'assistant'; text: string }[];
    } = body;

    const systemPrompt = buildTutorSystemPrompt({
      subject,
      topic,
      taskText,
      mode,
      userLevel: userLevel ?? '9 класс',
      userGoal,
      weakPatterns,
      isExamInProgress
    });

    const messages: ChatMessage[] = [
      { role: 'system', text: systemPrompt },
      ...history.map((h) => ({ role: h.role, text: h.text }) as ChatMessage)
    ];

    const reply = await completeChat(messages);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat error', err);
    return NextResponse.json({ error: 'ai_unavailable' }, { status: 502 });
  }
}
