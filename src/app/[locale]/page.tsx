import ClientTopicSelector from '@/components/ClientTopicSelector'
import PageLayout from '@/components/PageLayout'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

type Props = {
  params: Promise<{ locale: string }>
}

export default function IndexPage({ params }: Props) {
  const { locale } = use(params)

  // Enable static rendering
  setRequestLocale(locale as Locale)

  return (
    <PageLayout>
      <ClientTopicSelector />
    </PageLayout>
  )
}
