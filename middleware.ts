import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

import {defaultLocale, locales} from '@i18n/config';

const PUBLIC_FILE = /\\.(.*)$/;

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (pathname.startsWith('/api') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const requestedLocale = segments[0];

  if (locales.includes(requestedLocale as (typeof locales)[number])) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next).*)']
};
