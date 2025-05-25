import { routing } from '@/i18n/routing'
import { MetadataRoute } from 'next'
import { getTranslations } from 'next-intl/server'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: 'Manifest'
  })

  return {
    name: t('name'),
    short_name: t('name'),
    description: 'Foshizzle App',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#101E33',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  }
}
