import {NextResponse} from 'next/server';

import {getPost} from '@lib/pages';
import {resolveTenantFromParams} from '@lib/tenant';

export async function GET(request: Request, context: {params: {slug: string}}) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const post = await getPost({tenantId: tenant.id, locale, slug: context.params.slug});

  if (!post) {
    return NextResponse.json({error: 'Post not found'}, {status: 404});
  }

  return NextResponse.json({data: post});
}
