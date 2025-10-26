import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('container mx-auto px-4 my-8', className)}>
      <div
        className={cn('border py-3 px-6 flex items-center rounded', {
          'border-border': style === 'info',
          'border-error': style === 'error',
          'border-success': style === 'success',
          'border-warning': style === 'warning',
        })}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
