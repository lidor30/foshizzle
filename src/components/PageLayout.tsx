import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  title?: ReactNode
}

export default function PageLayout({ children, title }: Props) {
  return (
    <div className="relative flex grow flex-col dark:bg-slate-850 pt-[84px] pb-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1 size-[20500px] rounded-full bg-white dark:bg-slate-900 start-0 -translate-x-[47.5%] rtl:start-auto rtl:end-0 rtl:translate-x-[47.5%]" />
      </div>
      <div className="container relative flex grow flex-col px-4">
        {title && (
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white md:text-5xl">
            {title}
          </h1>
        )}
        <main className="mt-6 text-gray-400 md:text-lg">{children}</main>
      </div>
    </div>
  )
}
