'use client'

import { SessionProvider } from 'next-auth/react'
import { AppProgressBar } from 'next-nprogress-bar'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppProgressBar
        height="3px"
        color="#ec4899"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </SessionProvider>
  )
}
