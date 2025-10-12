'use client'

import { Button } from './ui/button'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const LogoutButton = () => {
  const pathname = usePathname()

  return (
    <Button
      asChild
      variant="link"
      className={clsx('text-primary/50 hover:text-primary/100 hover:no-underline', {
        'text-primary/100': pathname === '/logout',
      })}
    >
      <Link href="/logout">Log out</Link>
    </Button>
  )
}
