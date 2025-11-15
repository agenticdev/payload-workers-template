'use client'

import { useTranslations } from 'next-intl'
import { ExternalLink } from 'lucide-react'
import { Link } from '@/i18n/routing'

import { cn } from '@/lib/utils'

import { Button, buttonVariants } from '@/components/ui/button'

const Hero12 = () => {
  const t = useTranslations('hero')
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt={t('backgroundAlt')}
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          className="opacity-90 [mask-image:radial-gradient(75%_75%_at_center,white,transparent)]"
        />
      </div>
      <div className="container relative z-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="bg-background/30 rounded-xl p-4 shadow-sm backdrop-blur-sm">
              <img
                src="https://asset.cooksa.com/media/logo.svg"
                alt={t('logoAlt')}
                className="h-16"
              />
            </div>
            <div>
              <h1 className="mb-6 text-pretty text-2xl font-bold tracking-tight lg:text-5xl">
                {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
              </h1>
              <p className="text-muted-foreground mx-auto max-w-3xl lg:text-xl">
                {t('description')}
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Button className="shadow-sm transition-shadow hover:shadow" asChild>
                <Link href="/contact">{t('getStarted')}</Link>
              </Button>
              <Button variant="outline" className="group" asChild>
                <Link href="/about">
                  {t('learnMore')}{' '}
                  <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
            <div className="mt-20 flex flex-col items-center gap-5">
              <p className="text-muted-foreground font-medium lg:text-left">{t('builtWith')}</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'group flex aspect-square h-12 items-center justify-center p-0',
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-icon.svg"
                    alt="shadcn/ui logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </Link>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'group flex aspect-square h-12 items-center justify-center p-0',
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/typescript-icon.svg"
                    alt="TypeScript logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </Link>

                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'group flex aspect-square h-12 items-center justify-center p-0',
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/nextjs-icon.svg"
                    alt="Next.js logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </Link>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'group flex aspect-square h-12 items-center justify-center p-0',
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-icon.svg"
                    alt="Tailwind CSS logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero12 }
