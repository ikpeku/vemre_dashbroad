import type { Metadata } from 'next'
import './globals.css'
import QueryClientWrapper from '@/components/QuertWrapper'


export const metadata: Metadata = {
  title: 'Vemre',
  description: 'Vemre admin dashbroad',
  generator: 'vemre',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
      <QueryClientWrapper>
        {children}
        </QueryClientWrapper>
        </body>
    </html>
  )
}
