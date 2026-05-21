'use client'
import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  title: string
  url: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title, url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={share} className="gap-2">
      <Share2 className="w-4 h-4" />
      Поделиться
    </Button>
  )
}
