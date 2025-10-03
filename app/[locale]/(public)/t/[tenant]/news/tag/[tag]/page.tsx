import {getTenantPostTagStaticParams} from '@lib/static-paths';
import {DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';

export {generateMetadata} from '../../../../news/tag/[tag]/page';
export {default} from '../../../../news/tag/[tag]/page';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getTenantPostTagStaticParams();
}
