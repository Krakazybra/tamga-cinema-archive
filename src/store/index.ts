'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: next })
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', next)
        }
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', state.theme)
        }
      },
    }
  )
)

interface FiltersStore {
  decade: string[]
  genres: string[]
  mediaType: string
  language: string
  director: string
  studio: string
  yearFrom: number
  yearTo: number
  setFilter: (key: string, value: string | string[] | number) => void
  resetFilters: () => void
}

const filtersInitial = {
  decade: [] as string[],
  genres: [] as string[],
  mediaType: '',
  language: '',
  director: '',
  studio: '',
  yearFrom: 0,
  yearTo: 0,
}

export const useFiltersStore = create<FiltersStore>()((set) => ({
  ...filtersInitial,
  setFilter: (key, value) => set({ [key]: value }),
  resetFilters: () => set({ ...filtersInitial }),
}))

interface SearchStore {
  query: string
  recentSearches: string[]
  setQuery: (q: string) => void
  addRecentSearch: (q: string) => void
  clearRecent: () => void
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      query: '',
      recentSearches: [],
      setQuery: (q) => set({ query: q }),
      addRecentSearch: (q) => {
        if (!q.trim()) return
        const recent = [q, ...get().recentSearches.filter((r) => r !== q)].slice(0, 5)
        set({ recentSearches: recent })
      },
      clearRecent: () => set({ recentSearches: [] }),
    }),
    { name: 'search-storage', partialize: (s) => ({ recentSearches: s.recentSearches }) }
  )
)
