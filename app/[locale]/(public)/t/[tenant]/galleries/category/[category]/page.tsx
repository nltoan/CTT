import {getTenantGalleryCategoryStaticParams} from '@lib/static-paths';

export {revalidate} from '../../../../galleries/category/[category]/page';
export {generateMetadata} from '../../../../galleries/category/[category]/page';
export {default} from '../../../../galleries/category/[category]/page';

export function generateStaticParams() {
  return getTenantGalleryCategoryStaticParams();
}
