import {getTenantEventStaticParams} from '@lib/static-paths';
import {DEFAULT_REVALIDATE_SECONDS} from '@lib/settings';

export {generateMetadata} from '../../../../events/[slug]/page';
export {default} from '../../../../events/[slug]/page';

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return getTenantEventStaticParams();
}
