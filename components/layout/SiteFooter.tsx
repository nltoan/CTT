import type {Navigation} from '@types/cms';
import type {Tenant} from '@types/cms';

export function SiteFooter({
  tenant,
  navigation,
  locale,
  tenantPath = ''
}: {
  tenant: Tenant;
  navigation?: Navigation;
  locale: string;
  tenantPath?: string;
}) {
  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold uppercase tracking-wider">
            {tenant.name}
          </p>
          <p className="text-sm text-white/70">
            {tenant.description ??
              (locale === 'vi'
                ? 'Nền tảng kết nối cộng đồng âm nhạc quốc tế.'
                : 'A platform that connects the international music community.')}
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 text-sm">
          {navigation?.items.map((item) => (
            <a key={item.id} href={`/${locale}${tenantPath}${item.href}`} className="hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-white/60">© {new Date().getFullYear()} {tenant.name}</p>
      </div>
    </footer>
  );
}
