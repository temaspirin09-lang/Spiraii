# SPIRAI — Web MVP

Персональный AI-репетитор. Next.js 14 (App Router) + Supabase + YandexGPT + ЮKassa.

## Локальный запуск

npm install
npm run dev

## Что доработать перед реальным запуском

1. Мультимодальный вход YandexGPT (см. lib/ai/yandexgpt.ts) — проверить актуальный формат в документации Yandex Cloud.
2. ЮKassa — вписать YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY в переменные окружения после оформления ИП.
3. Mail.ru OAuth — сверить параметры на api.mail.ru/docs/guides/oauth.
4. Наполнить таблицу topics в Supabase реальными темами по предметам.
