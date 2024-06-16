import StreamVideoProvider from '@/providers/StreamClientProvider'
import { ReactNode } from 'react'

const MainLayout = (
  { children }: { children: ReactNode }
) => {
  return (
    <main>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
    </main>
  )
}

export default MainLayout