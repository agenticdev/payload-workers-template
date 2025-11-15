'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const Contact2 = () => {
  const t = useTranslations('contactPage')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = (await response.json()) as { error?: string; success?: boolean }

      if (response.ok) {
        toast.success('Message sent successfully!')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: '',
        })
      } else {
        toast.error(data.error || 'Failed to send message')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
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
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl flex-col gap-6 rounded-lg border p-10"
          >
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstName">{t('form.firstName')}</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t('form.firstNamePlaceholder')}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastName">{t('form.lastName')}</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={t('form.lastNamePlaceholder')}
                  required
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">{t('form.email')}</Label>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('form.emailPlaceholder')}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">{t('form.subject')}</Label>
              <Input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={t('form.subjectPlaceholder')}
                required
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">{t('form.message')}</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('form.messagePlaceholder')}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : t('form.submit')}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact2
