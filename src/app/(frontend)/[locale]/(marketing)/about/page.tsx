import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'

const About3 = () => {
  const t = useTranslations('aboutPage')

  const achievements = [
    { label: t('achievements.companies'), value: '300+' },
    { label: t('achievements.projects'), value: '800+' },
    { label: t('achievements.customers'), value: '99%' },
    { label: t('achievements.awards'), value: '10+' },
  ]
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h1 className="text-5xl font-semibold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          <img
            src="https://images.unsplash.com/photo-1578735546632-9ff1f1e7518e"
            alt={t('mainImageAlt')}
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="bg-muted flex flex-col justify-between gap-6 rounded-xl p-7 md:w-1/2 lg:w-auto">
              <img
                src="https://asset.cooksa.com/media/logo.svg"
                alt={t('breakout.logoAlt')}
                className="mr-auto h-12"
              />
              <div>
                <p className="mb-2 text-lg font-semibold">{t('breakout.title')}</p>
                <p className="text-muted-foreground">{t('breakout.description')}</p>
              </div>
              <Button variant="outline" className="mr-auto" asChild>
                <Link href="/">{t('breakout.buttonText')}</Link>
              </Button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1712251769281-9f682a57aaca"
              alt={t('secondaryImageAlt')}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
            />
          </div>
        </div>
        <div className="bg-muted relative mt-16 overflow-hidden rounded-xl p-7 md:p-16">
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 text-center lg:grid-cols-4">
            {achievements.map((item, idx) => (
              <div className="flex flex-col gap-2" key={item.label + idx}>
                <span className="text-4xl font-semibold md:text-5xl">{item.value}</span>
                <p className="text-sm md:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About3
