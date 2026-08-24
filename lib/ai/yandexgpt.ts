const COMPLETION_ENDPOINT = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';
const VISION_ENDPOINT = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';

const FOLDER_ID = process.env.YANDEX_FOLDER_ID;
const API_KEY = process.env.YANDEX_API_KEY;

function authHeaders() {
  if (!API_KEY) {
    throw new Error('YANDEX_API_KEY не задан в .env.local');
  }
  return {
    Authorization: `Api-Key ${API_KEY}`,
    'Content-Type': 'application/json'
  };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  text: string;
}

export async function completeChat(messages: ChatMessage[], opts?: { temperature?: number; maxTokens?: number }) {
  const body = {
    modelUri: `gpt://${FOLDER_ID}/yandexgpt/latest`,
    completionOptions: {
      stream: false,
      temperature: opts?.temperature ?? 0.4,
      maxTokens: String(opts?.maxTokens ?? 2000)
    },
    messages: messages.map((m) => ({ role: m.role, text: m.text }))
  };

  const res = await fetch(COMPLETION_ENDPOINT, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`YandexGPT error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.result?.alternatives?.[0]?.message?.text;
  if (!text) throw new Error('YandexGPT вернул пустой ответ');
  return text;
}

export async function recognizeTaskImage(imageBase64: string, mimeType: string) {
  const body = {
    modelUri: `gpt://${FOLDER_ID}/yandexgpt/latest`,
    completionOptions: { stream: false, temperature: 0.2, maxTokens: '1500' },
    messages: [
      {
        role: 'system',
        text:
          'Ты распознаёшь школьное задание с фотографии. Верни ТОЛЬКО JSON без markdown-обёртки: ' +
          '{"recognized_text": string, "subject": string, "topic": string, "task_type": string, "confidence": number от 0 до 1}. ' +
          'Если фото нечитаемо — confidence должен быть низким (< 0.4).'
      },
      {
        role: 'user',
        text: `[image_base64:${mimeType}]${imageBase64.slice(0, 0)}`
      }
    ]
  };

  const res = await fetch(VISION_ENDPOINT, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`YandexGPT OCR error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const raw: string = data?.result?.alternatives?.[0]?.message?.text ?? '{}';
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as {
      recognized_text: string;
      subject: string;
      topic: string;
      task_type: string;
      confidence: number;
    };
  } catch {
    throw new Error('Не удалось разобрать ответ распознавания');
  }
}
