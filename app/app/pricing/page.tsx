'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      } else {
        setNotice(
          'Онлайн-оплата пока в разработке — ЮKassa ожидает оформления ИП. Оставь заявку, и мы подключим Pro вручную в течение дня.'
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const priceMonthly = 590;
  const priceYearly = 2990;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">SPIRAI Pro</h1>
      <p className="text-sm text-secondaryText">
        Безлимитные AI-запросы, полная адаптивность плана и приоритетная скорость ответа.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setPlan('monthly')}
          className={`card text-left ${plan === 'monthly' ? 'border-accent' : ''}`}
        >
          <div className="text-xs text-secondaryText">Месяц</div>
          <div className="mt-1 text-lg font-semibold">{priceMonthly} ₽</div>
        </button>
        <button
          onClick={() => setPlan('yearly')}
          className={`card text-left ${plan === 'yearly' ? 'border-accent' : ''}`}
        >
          <div className="text-xs text-secondaryText">Год · выгоднее</div>
          <div className="mt-1 text-lg font-semibold">{priceYearly} ₽</div>
          <div className="text-xs text-success">≈ 250 ₽/мес</div>
        </button>
      </div>

      <Card>
        <ul className="space-y-2 text-sm">
          <Feature text="Безлимитные AI-запросы и объяснения" />
          <Feature text="Полная адаптивность персонального плана" />
          <Feature text="Расширенная генерация похожих заданий" />
          <Feature text="Приоритетная скорость ответа" />
        </ul>
      </Card>

      <Button className="w-full" onClick={startCheckout} disabled={loading}>
        {loading ? 'Открываем оплату…' : 'Оформить Pro'}
      </Button>

      {notice && <div className="card border-warning/40 text-sm text-warning">{notice}</div>}

      <p className="text-center text-xs text-secondaryText">
        Free-тариф остаётся доступным всегда: все предметы, прогресс и streak — без ограничений, с дневным лимитом AI-запросов.
      </p>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className="text-success">✓</span>
      {text}
    </li>
  );
}
