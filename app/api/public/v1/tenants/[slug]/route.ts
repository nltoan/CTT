import {NextResponse} from 'next/server';

import {findTenantBySlug} from '@data/tenants';

export async function GET(_: Request, context: {params: {slug: string}}) {
  const tenant = findTenantBySlug(context.params.slug);

  if (!tenant) {
    return NextResponse.json({error: 'Tenant not found'}, {status: 404});
  }

  return NextResponse.json({data: tenant});
}
