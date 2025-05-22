'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import clsx from 'clsx';
import { Locale, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function setLocale(nextLocale: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <div className="flex items-center">
      <div className="flex space-x-2 rtl:space-x-reverse">
        {routing.locales.map((localeOption) => (
          <button
            key={localeOption}
            onClick={() => setLocale(localeOption)}
            className={clsx(
              'px-2 py-1 text-sm rounded-md transition-colors',
              locale === localeOption
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
              isPending && 'opacity-50 cursor-not-allowed'
            )}
            disabled={isPending}
          >
            {localeOption.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
