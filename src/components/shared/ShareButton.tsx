'use client'
import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  title: string
  url: string
  locale?: string
}

export function ShareButton({ title, url, locale = 'ru' }: ShareButtonProps) {
  const share = async () => {
    const fullUrl = typeof window !== 'undefined' ? window.location.origin + url : url
    if (navigator.share) {
      await navigator.share({ title, url: fullUrl })
    } else {
      await navigator.clipboard.writeText(fullUrl)
    }
  }

  const label = locale === 'kk' ? 'Бөлісу' : locale === 'en' ? 'Share' : 'Поделиться'

  return (
    <Button variant="outline" size="sm" onClick={share} className="gap-2">
      <Share2 className="w-4 h-4" />
      {label}
    </Button>
  )
}
