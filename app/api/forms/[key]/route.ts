import {NextResponse} from 'next/server';

import {submitForm} from '@lib/forms';
import {
  DEFAULT_FORM_RATE_LIMIT,
  enforceRateLimit,
  tooManyRequestsResponse
} from '@lib/rate-limit';
import {locales, type Locale} from '@i18n/config';

export async function POST(request: Request, {params}: {params: {key: string}}) {
  const key = params.key;

  if (!key) {
    return NextResponse.json({message: 'Form key is required'}, {status: 400});
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({message: 'Invalid JSON payload'}, {status: 400});
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({message: 'Invalid request body'}, {status: 400});
  }

  const {tenantId, locale, data} = body as {
    tenantId?: string;
    locale?: Locale | string;
    data?: Record<string, unknown>;
  };

  if (!tenantId || typeof tenantId !== 'string') {
    return NextResponse.json({message: 'tenantId is required'}, {status: 400});
  }

  if (!data || typeof data !== 'object') {
    return NextResponse.json({message: 'data is required'}, {status: 400});
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip');
  const rateLimit = enforceRateLimit(request, {
    ...DEFAULT_FORM_RATE_LIMIT,
    identifier: `${tenantId}:${key}`
  });

  if (!rateLimit.ok) {
    const message =
      locale === 'vi'
        ? 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.'
        : 'Too many requests. Please try again later.';

    return tooManyRequestsResponse(rateLimit, message);
  }

  const metadata = {
    ip,
    userAgent: request.headers.get('user-agent')
  };

  const result = await submitForm({
    tenantId,
    key,
    locale: typeof locale === 'string' ? locale : locales[0],
    data,
    metadata
  });

  if (!result.success) {
    const payload: Record<string, unknown> = {message: result.message};
    if ('errors' in result && result.errors) {
      payload.errors = result.errors;
    }

    return NextResponse.json(payload, {
      status: result.status,
      headers: rateLimit.headers
    });
  }

  return NextResponse.json(
    {message: result.message},
    {
      headers: rateLimit.headers
    }
  );
}
