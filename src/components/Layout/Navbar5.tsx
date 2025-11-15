'use client'

import { useTranslations } from 'next-intl'
import { MenuIcon } from 'lucide-react'
import { Link } from '@/i18n/routing'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

const Navbar5 = () => {
  const t = useTranslations('navbar')

  const features = [
    {
      title: t('features.dashboard.title'),
      description: t('features.dashboard.description'),
      href: '#',
    },
    {
      title: t('features.analytics.title'),
      description: t('features.analytics.description'),
      href: '#',
    },
    {
      title: t('features.settings.title'),
      description: t('features.settings.description'),
      href: '#',
    },
    {
      title: t('features.integrations.title'),
      description: t('features.integrations.description'),
      href: '#',
    },
    {
      title: t('features.storage.title'),
      description: t('features.storage.description'),
      href: '#',
    },
    {
      title: t('features.support.title'),
      description: t('features.support.description'),
      href: '#',
    },
  ]

  return (
    <section className="py-4">
      <div className="container">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://asset.cooksa.com/media/logo.svg"
              className="max-h-8"
              alt={t('logoAlt')}
            />
            <span className="text-lg font-semibold tracking-tighter">{t('logoTitle')}</span>
          </Link>
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t('features.title')}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        href={feature.href}
                        key={index}
                        className="hover:bg-muted/70 rounded-md p-3 transition-colors"
                      >
                        <div key={feature.title}>
                          <p className="text-foreground mb-1 font-semibold">{feature.title}</p>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                  {t('about')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className={navigationMenuTriggerStyle()}>
                  {t('contact')}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden items-center gap-4 lg:flex">
            <LanguageSwitcher />
            <Button variant="outline">{t('signIn')}</Button>
            <Button>{t('startFree')}</Button>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="max-h-screen overflow-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <img
                        src="https://asset.cooksa.com/media/logo.svg"
                        className="max-h-8"
                        alt={t('logoAlt')}
                      />
                      <span className="text-lg font-semibold tracking-tighter">
                        {t('logoTitle')}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4">
                  <Accordion type="single" collapsible className="mb-2 mt-4">
                    <AccordionItem value="solutions" className="border-none">
                      <AccordionTrigger className="text-base hover:no-underline">
                        {t('features.title')}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid md:grid-cols-2">
                          {features.map((feature, index) => (
                            <a
                              href={feature.href}
                              key={index}
                              className="hover:bg-muted/70 rounded-md p-3 transition-colors"
                            >
                              <div key={feature.title}>
                                <p className="text-foreground mb-1 font-semibold">
                                  {feature.title}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {feature.description}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex flex-col gap-6">
                    <Link href="/about" className="font-medium">
                      {t('about')}
                    </Link>
                    <Link href="/contact" className="font-medium">
                      {t('contact')}
                    </Link>
                  </div>
                  <div className="mt-6 flex flex-col gap-4">
                    <Button variant="outline">{t('signIn')}</Button>
                    <Button>{t('startFree')}</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </section>
  )
}

export { Navbar5 }
