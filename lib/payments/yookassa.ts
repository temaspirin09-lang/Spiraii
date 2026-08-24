const SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;

export const isYooKassaConfigured = Boolean(SHOP_ID && SECRET_KEY);

export interface CreatePaymentParams {
  amountRub: number;
  description: string;
  userId: string;
  returnUrl: string;
  savePaymentMethod?: boolean;
  paymentMethodId?: string;
}

export interface CreatePaymentResult {
  paymentId: string;
  confirmationUrl: string | null;
  status: 'pending' | 'succeeded' | 'mock';
}

export async function createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
  if (!isYooKassaConfigured) {
    return {
      paymentId: `mock_${Date.now()}`,
      confirmationUrl: null,
      status: 'mock'
    };
  }

  const idempotenceKey = crypto.randomUUID();
  const body: Record<string, unknown> = {
    amount: { value: params.amountRub.toFixed(2), currency: 'RUB' },
    capture: true,
    confirmation: { type: 'redirect', return_url: params.returnUrl },
    description: params.description,
    metadata: { userId: params.userId },
    save_payment_method: params.savePaymentMethod ?? false
  };

  if (params.paymentMethodId) {
    body.payment_method_id = params.paymentMethodId;
  }

  const res = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotence-Key': idempotenceKey,
      Authorization: 'Basic ' + Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString('base64')
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`YooKassa error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return {
    paymentId: data.id,
    confirmationUrl: data.confirmation?.confirmation_url ?? null,
    status: data.status
  };
}

export interface YooKassaWebhookEvent {
  event: 'payment.succeeded' | 'payment.canceled';
  object: {
    id: string;
    status: string;
    metadata?: { userId?: string };
    payment_method?: { id: string; saved: boolean };
  };
}
