import { AuthProvider } from '@/providers/Auth'
import React from 'react'

import { ThemeProvider } from './Theme'
import { SonnerProvider } from './Sonner'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SonnerProvider />
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
