'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

interface Footer7Props {
  logo?: {
    url: string
    src: string
  }
}

const Footer7 = ({
  logo = {
    url: 'https://www.shadcnblocks.com',
    src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg',
  },
}: Footer7Props) => {
  const t = useTranslations('footer')

  const sections = [
    {
      title: t('product.title'),
      links: [
        { name: t('product.overview'), href: '#' },
        { name: t('product.pricing'), href: '#' },
        { name: t('product.marketplace'), href: '#' },
        { name: t('product.features'), href: '#' },
      ],
    },
    {
      title: t('company.title'),
      links: [
        { name: t('company.about'), href: '#' },
        { name: t('company.team'), href: '#' },
        { name: t('company.blog'), href: '#' },
        { name: t('company.careers'), href: '#' },
      ],
    },
    {
      title: t('resources.title'),
      links: [
        { name: t('resources.help'), href: '#' },
        { name: t('resources.sales'), href: '#' },
        { name: t('resources.advertise'), href: '#' },
        { name: t('resources.privacy'), href: '#' },
      ],
    },
  ]

  const socialLinks = [
    { icon: <FaInstagram className="size-5" />, href: '#', label: t('social.instagram') },
    { icon: <FaFacebook className="size-5" />, href: '#', label: t('social.facebook') },
    { icon: <FaTwitter className="size-5" />, href: '#', label: t('social.twitter') },
    { icon: <FaLinkedin className="size-5" />, href: '#', label: t('social.linkedin') },
  ]

  const legalLinks = [
    { name: t('legal.terms'), href: '#' },
    { name: t('legal.privacy'), href: '#' },
  ]
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <a href={logo.url}>
                <img src={logo.src} alt={t('logoAlt')} title={t('logoTitle')} className="h-8" />
              </a>
              <h2 className="text-xl font-semibold">{t('logoTitle')}</h2>
            </div>
            <p className="text-muted-foreground max-w-[70%] text-sm">{t('description')}</p>
            <ul className="text-muted-foreground flex items-center space-x-6">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="hover:text-primary font-medium">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="hover:text-primary font-medium">
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="text-muted-foreground mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{t('copyright', { year: new Date().getFullYear() })}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export { Footer7 }
