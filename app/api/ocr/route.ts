import { NextResponse } from 'next/server';
import { recognizeTaskImage } from '@/lib/ai/yandexgpt';

export async function POST(request: Request) {
  try {
    const { imageBase64, mimeType } = await request.json();
    if (!imageBase64) {
      return NextResponse.json({ error: 'no_image' }, { status: 400 });
    }
    const result = await recognizeTaskImage(imageBase64, mimeType ?? 'image/jpeg');
    return NextResponse.json(result);
  } catch (err) {
    console.error('OCR error', err);
    return NextResponse.json({ error: 'ocr_failed' }, { status: 502 });
  }
}
