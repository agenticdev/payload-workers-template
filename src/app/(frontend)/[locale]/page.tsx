import { Hero12 } from '@/components/Home/Hero12'

type Args = {
  params: Promise<{ locale: string; slug?: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const params = await paramsPromise
  const { locale, slug } = params

  return (
    <div>
      <Hero12 />
    </div>
  )
}
