import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Қазақ Киносы — Архив казахского кино',
  description: 'Мультиязычный архив казахского кино. История, фильмы, персоны.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
