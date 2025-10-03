import {NextRequest, NextResponse} from 'next/server';
import {draftMode} from 'next/headers';

export async function GET(request: NextRequest) {
  draftMode().disable();
  const redirectParam = request.nextUrl.searchParams.get('redirect') ?? '/';
  const safeRedirect = redirectParam.startsWith('/') ? redirectParam : '/';
  const redirect = new URL(safeRedirect, request.nextUrl.origin);
  return NextResponse.redirect(redirect);
}
