import {getTenantPostCategoryStaticParams} from '@lib/static-paths';
import {DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';

export {generateMetadata} from '../../../../news/category/[category]/page';
export {default} from '../../../../news/category/[category]/page';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getTenantPostCategoryStaticParams();
}
