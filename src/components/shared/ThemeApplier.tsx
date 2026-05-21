'use client'
import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useThemeStore } from '@/store'

export function ThemeApplier() {
  const locale = useLocale()
  const { theme } = useThemeStore()

  useEffect(() => {
    if (useThemeStore.persist.hasHydrated()) {
      document.documentElement.setAttribute('data-theme', theme)
    } else {
      try {
        const stored = localStorage.getItem('theme-storage')
        if (stored) {
          const data = JSON.parse(stored)
          const t = data?.state?.theme
          if (t) document.documentElement.setAttribute('data-theme', t)
        }
      } catch {}
    }
  }, [locale, theme])

  return null
}
