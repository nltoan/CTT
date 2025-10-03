import {getTenantGalleryTagStaticParams} from '@lib/static-paths';

export {revalidate} from '../../../../galleries/tag/[tag]/page';
export {generateMetadata} from '../../../../galleries/tag/[tag]/page';
export {default} from '../../../../galleries/tag/[tag]/page';

export function generateStaticParams() {
  return getTenantGalleryTagStaticParams();
}
