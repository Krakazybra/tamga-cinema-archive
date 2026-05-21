import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { LocalizedString } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocalized(obj: LocalizedString, locale: string): string {
  return (obj as unknown as Record<string, string>)[locale] ?? obj.ru
}
