'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const Contact2 = () => {
  const t = useTranslations('contactPage')
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
            <div className="text-center lg:text-left">
              <h1 className="mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl">{t('title')}</h1>
              <p className="text-muted-foreground">{t('description')}</p>
            </div>
            <div className="mx-auto w-fit lg:mx-0">
              <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left">
                {t('contactDetails')}
              </h3>
              <ul className="ml-4 list-disc">
                <li>
                  <span className="font-bold">{t('phone')}: </span>
                  (123) 34567890
                </li>
                <li>
                  <span className="font-bold">{t('email')}: </span>
                  <a href="mailto:email@example.com" className="underline">
                    email@example.com
                  </a>
                </li>
                <li>
                  <span className="font-bold">{t('web')}: </span>
                  <a href="https://shadcnblocks.com" target="_blank" className="underline">
                    shadcnblocks.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-lg border p-10">
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstname">{t('form.firstName')}</Label>
                <Input type="text" id="firstname" placeholder={t('form.firstNamePlaceholder')} />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastname">{t('form.lastName')}</Label>
                <Input type="text" id="lastname" placeholder={t('form.lastNamePlaceholder')} />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">{t('form.email')}</Label>
              <Input type="email" id="email" placeholder={t('form.emailPlaceholder')} />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">{t('form.subject')}</Label>
              <Input type="text" id="subject" placeholder={t('form.subjectPlaceholder')} />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">{t('form.message')}</Label>
              <Textarea placeholder={t('form.messagePlaceholder')} id="message" />
            </div>
            <Button className="w-full">{t('form.submit')}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact2
