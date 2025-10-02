import {getPost, getRelatedPosts} from '@lib/pages';
import {resolveTenantFromParams} from '@lib/tenant';
import {jsonResponseWithCache} from '@lib/http';
import {getApiCacheTtl} from '@lib/settings';

export async function GET(request: Request, context: {params: {slug: string}}) {
  const {searchParams} = new URL(request.url);
  const tenantSlug = searchParams.get('tenant');
  const locale = (searchParams.get('locale') as 'vi' | 'en') ?? 'vi';

  const tenant = resolveTenantFromParams({tenantParam: tenantSlug ?? undefined});
  const post = await getPost({tenantId: tenant.id, locale, slug: context.params.slug});

  if (!post) {
    return jsonResponseWithCache({
      request,
      body: {error: 'Post not found'},
      status: 404,
      ttl: 0
    });
  }

  const related = await getRelatedPosts({
    tenantId: tenant.id,
    locale,
    postId: post.id,
    category: post.category,
    tags: post.tags,
    limit: 3
  });

  const ttl = getApiCacheTtl({tenantId: tenant.id, locale});

  return jsonResponseWithCache({
    request,
    body: {data: post, related},
    ttl,
    cacheTags: [`tenant:${tenant.id}`, `post:${post.id}`]
  });
}
