import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPayment } from '@/lib/payments/yookassa';

const PRICES_RUB = { monthly: 590, yearly: 2990 };

export async function POST(request: Request) {
  const { plan } = await request.json();
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
  }

  const amount = PRICES_RUB[plan as 'monthly' | 'yearly'] ?? PRICES_RUB.monthly;
  const origin = new URL(request.url).origin;

  const result = await createPayment({
    amountRub: amount,
    description: `SPIRAI Pro — ${plan === 'yearly' ? 'годовая' : 'месячная'} подписка`,
    userId: user.id,
    returnUrl: `${origin}/app/pricing?status=return`,
    savePaymentMethod: true
  });

  await supabase.from('payments').insert({
    user_id: user.id,
    yookassa_payment_id: result.paymentId,
    amount_rub: amount,
    plan,
    status: result.status
  });

  return NextResponse.json(result);
}
