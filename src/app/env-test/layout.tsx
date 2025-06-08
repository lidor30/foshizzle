'use client'

import { ReactNode } from 'react'
import './styles.css'

export default function EnvTestLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="flex h-full flex-col">{children}</body>
    </html>
  )
}
