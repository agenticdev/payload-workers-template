'use client'

import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(true)

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        // Redirect to home page after successful logout
        router.push('/')
      } catch (_) {
        // Even if already logged out, redirect to home
        router.push('/')
      } finally {
        setIsLoggingOut(false)
      }
    }

    void performLogout()
  }, [logout, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoggingOut && <p className="text-lg">Logging out...</p>}
    </div>
  )
}
