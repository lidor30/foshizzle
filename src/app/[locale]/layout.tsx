import KidsModeStyles from '@/components/KidsModeStyles';
import Navigation from '@/components/Navigation';
import { KidsModeProvider } from '@/context/KidsModeContext';
import { StatsProvider } from '@/context/StatsContext';
import { routing } from '@/i18n/routing';
import { clsx } from 'clsx';
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Inter, Noto_Sans_Hebrew } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import './styles.css';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-sans-hebrew'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: Omit<Props, 'children'>) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: 'LocaleLayout' });

  return {
    title: t('title')
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Set direction based on locale - Hebrew needs RTL
  const dir = locale === 'he' ? 'rtl' : 'ltr';

  // Use both fonts, with Noto Sans Hebrew for Hebrew locale
  const fontClass =
    locale === 'he' ? notoSansHebrew.className : inter.className;

  return (
    <html
      className={clsx('h-full', inter.variable, notoSansHebrew.variable)}
      lang={locale}
      dir={dir}
    >
      <body className={clsx(fontClass, 'flex h-full flex-col')}>
        <NextIntlClientProvider>
          <StatsProvider>
            <KidsModeProvider>
              <KidsModeStyles />
              <Navigation />
              {children}
              <Toaster position="bottom-center" reverseOrder={false} />
            </KidsModeProvider>
          </StatsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
