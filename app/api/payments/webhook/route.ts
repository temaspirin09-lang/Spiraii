import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import type { YooKassaWebhookEvent } from '@/lib/payments/yookassa';

export async function POST(request: Request) {
  const event = (await request.json()) as YooKassaWebhookEvent;
  const admin = createAdminClient();

  const userId = event.object.metadata?.userId;
  if (!userId) {
    return NextResponse.json({ ok: true });
  }

  if (event.event === 'payment.succeeded') {
    await admin.from('payments').update({ status: 'succeeded' }).eq('yookassa_payment_id', event.object.id);

    const { data: payment } = await admin
      .from('payments')
      .select('plan')
      .eq('yookassa_payment_id', event.object.id)
      .single();

    const durationDays = payment?.plan === 'yearly' ? 365 : 30;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    await admin
      .from('profiles')
      .update({ subscription_status: 'pro', subscription_expires_at: expiresAt })
      .eq('id', userId);

    if (event.object.payment_method?.saved) {
      await admin
        .from('payments')
        .update({ payment_method_id: event.object.payment_method.id })
        .eq('yookassa_payment_id', event.object.id);
    }
  }

  if (event.event === 'payment.canceled') {
    await admin.from('payments').update({ status: 'canceled' }).eq('yookassa_payment_id', event.object.id);
  }

  return NextResponse.json({ ok: true });
}
