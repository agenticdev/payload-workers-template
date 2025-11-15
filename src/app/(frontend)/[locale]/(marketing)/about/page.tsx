import { Button } from '@/components/ui/button'

interface About3Props {
  title?: string
  description?: string
  mainImage?: {
    src: string
    alt: string
  }
  secondaryImage?: {
    src: string
    alt: string
  }
  breakout?: {
    src: string
    alt: string
    title?: string
    description?: string
    buttonText?: string
    buttonUrl?: string
  }
  companiesTitle?: string
  companies?: Array<{
    src: string
    alt: string
  }>
  achievementsTitle?: string
  achievementsDescription?: string
  achievements?: Array<{
    label: string
    value: string
  }>
}

const defaultAchievements = [
  { label: 'Companies ', value: '300+' },
  { label: 'Projects Finalized', value: '800+' },
  { label: 'Happy Customers', value: '99%' },
  { label: 'Recognized Awards', value: '10+' },
]

const About3 = ({
  title = 'About Us',
  description = 'Shadcnblocks is a passionate team dedicated to creating innovative solutions that empower businesses to thrive in the digital age.',
  mainImage = {
    src: 'https://images.unsplash.com/photo-1578735546632-9ff1f1e7518e',
    alt: 'placeholder',
  },
  secondaryImage = {
    src: 'https://images.unsplash.com/photo-1712251769281-9f682a57aaca',
    alt: 'placeholder',
  },
  breakout = {
    src: 'https://asset.cooksa.com/media/logo.svg',
    alt: 'logo',
    title: 'Hundreds of blocks at Shadcnblocks.com',
    description:
      'Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.',
    buttonText: 'Discover more',
    buttonUrl: '/',
  },
}: About3Props = {}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h1 className="text-5xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          <img
            src={mainImage.src}
            alt={mainImage.alt}
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="bg-muted flex flex-col justify-between gap-6 rounded-xl p-7 md:w-1/2 lg:w-auto">
              <img src={breakout.src} alt={breakout.alt} className="mr-auto h-12 dark:invert" />
              <div>
                <p className="mb-2 text-lg font-semibold">{breakout.title}</p>
                <p className="text-muted-foreground">{breakout.description}</p>
              </div>
              <Button variant="outline" className="mr-auto" asChild>
                <a href={breakout.buttonUrl} target="_blank">
                  {breakout.buttonText}
                </a>
              </Button>
            </div>
            <img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About3
