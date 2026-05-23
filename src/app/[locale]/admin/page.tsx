'use client'

import { useState, useEffect, startTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import {
  Shield, Users, MessageSquare, Upload, Film, User, BookOpen, Clock,
  Plus, Pencil, Trash2, X, Check, Info,
} from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { Film as FilmType, Person as PersonType, Collection as CollectionType, TimelineEvent } from '@/types'

type Tab = 'users' | 'comments' | 'media' | 'films' | 'persons' | 'collections' | 'timeline' | 'team'

interface UserRow {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

interface TeamMemberRow {
  id: string
  order: number
  nameRu: string
  nameKk: string
  nameEn: string
  roleRu: string
  quoteRu: string
  skills: string
  photo: string
}

interface CommentRow {
  id: string
  content: string
  filmSlug: string
  createdAt: string
  user: { name: string | null; email: string | null }
}

const roleBadge: Record<string, string> = {
  ADMIN: 'bg-red-500/20 text-red-400 border-red-500/30',
  MODERATOR: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  USER: 'bg-[rgb(var(--surface))] text-[rgb(var(--muted))] border-[rgb(var(--border))]',
}

// ─── INFO BLOCK ───────────────────────────────────────────────────────────────
function InfoBlock({ id, children }: { id: string; children: React.ReactNode }) {
  const key = `admin-hint-${id}`
  const [visible, setVisible] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem(key) !== 'hidden' : true
  )
  const hide = () => { localStorage.setItem(key, 'hidden'); setVisible(false) }
  if (!visible) return null
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgb(var(--accent))]/10 border border-[rgb(var(--accent))]/25 mb-5 text-sm text-[rgb(var(--foreground))]">
      <Info className="w-4 h-4 shrink-0 mt-0.5 text-[rgb(var(--accent))]" />
      <p className="flex-1 leading-relaxed">{children}</p>
      <button onClick={hide} className="text-[rgb(var(--muted))]/60 hover:text-[rgb(var(--muted))] shrink-0 transition-colors" title="Скрыть подсказку">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── IMAGE PREVIEW ────────────────────────────────────────────────────────────
function ImagePreview({ url }: { url: string }) {
  const [ok, setOk] = useState(true)
  if (!url || !ok) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      onError={() => setOk(false)}
      className="mt-1.5 w-20 h-20 object-cover rounded-lg border border-[rgb(var(--border))]"
    />
  )
}

// ─── TAG INPUT ────────────────────────────────────────────────────────────────
function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('')
  const add = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed])
    setInput('')
  }
  return (
    <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] min-h-[40px] focus-within:ring-1 focus-within:ring-[rgb(var(--accent))]/50">
      {value.map((tag) => (
        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgb(var(--accent))]/15 text-[rgb(var(--accent))] text-xs">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))}>
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } if (e.key === ',' && input.trim()) { e.preventDefault(); add() } }}
        placeholder={value.length === 0 ? (placeholder ?? 'Введите и нажмите Enter') : ''}
        className="flex-1 min-w-[140px] bg-transparent text-sm outline-none placeholder:text-[rgb(var(--muted))]"
      />
      {input.trim() && (
        <button type="button" onClick={add} className="text-[rgb(var(--accent))] text-xs px-1 shrink-0">+ добавить</button>
      )}
    </div>
  )
}

// ─── PERSON SELECT ────────────────────────────────────────────────────────────
function PersonSelect({ value, onChange, persons, label }: { value: string; onChange: (v: string) => void; persons: PersonType[]; label: string }) {
  return (
    <div>
      <label className="block text-[rgb(var(--muted))] mb-1 text-sm">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-sm"
      >
        <option value="">— не выбрано —</option>
        {persons.map((p) => (
          <option key={p.id} value={p.slug}>{p.name.ru} ({p.role})</option>
        ))}
      </select>
    </div>
  )
}

// ─── SELECT FIELD ─────────────────────────────────────────────────────────────
const sel = "w-full px-3 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-sm"

// ─── FILM FORM ────────────────────────────────────────────────────────────────
function emptyFilm(): Partial<FilmType> {
  return {
    slug: '', year: new Date().getFullYear(), decade: '2020s',
    title: { kk: '', ru: '', en: '' }, synopsis: { kk: '', ru: '', en: '' },
    studio: { kk: '', ru: '', en: '' },
    genres: [], tags: [], cast: [], gallery: [], collections: [], relatedFilms: [],
    poster: '', banner: '', director: '', cinematographer: '', screenwriter: '',
    duration: 0, language: 'ru', mediaType: 'film', archiveId: '',
    featured: false, historicalRelevance: 5, videoUrl: '',
  }
}

interface FilmFormProps { initial: Partial<FilmType>; onSave: (data: Partial<FilmType>) => Promise<void>; onClose: () => void; saving: boolean; persons: PersonType[] }

function FilmForm({ initial, onSave, onClose, saving, persons }: FilmFormProps) {
  const [d, setD] = useState<Partial<FilmType>>(initial)
  const set = (k: string, v: unknown) => setD((p) => ({ ...p, [k]: v }))
  const setLoc = (field: 'title' | 'synopsis' | 'studio', locale: string, v: string) =>
    setD((p) => ({ ...p, [field]: { ...(p[field] as Record<string, string>), [locale]: v } }))

  return (
    <div className="space-y-4 text-sm">
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Slug <span className="text-red-400">*</span></label>
        <Input value={d.slug ?? ''} onChange={(e) => set('slug', e.target.value)} placeholder="konets-atamana" />
        <p className="text-xs text-[rgb(var(--muted))] mt-1">Только латиница, цифры и дефис. Уникальный ID фильма.</p>
      </div>

      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Название</legend>
        {(['ru', 'kk', 'en'] as const).map((loc) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{loc.toUpperCase()}</label>
            <Input value={(d.title as Record<string, string>)?.[loc] ?? ''} onChange={(e) => setLoc('title', loc, e.target.value)} />
          </div>
        ))}
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Год</label>
          <Input type="number" value={d.year ?? ''} onChange={(e) => set('year', Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Декада</label>
          <select value={d.decade ?? '2020s'} onChange={(e) => set('decade', e.target.value)} className={sel}>
            {['1930s','1940s','1950s','1960s','1970s','1980s','1990s','2000s','2010s','2020s'].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Постер URL</label>
        <Input value={d.poster ?? ''} onChange={(e) => set('poster', e.target.value)} placeholder="/uploads/poster.jpg" />
        <ImagePreview url={d.poster ?? ''} />
      </div>
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Баннер URL</label>
        <Input value={d.banner ?? ''} onChange={(e) => set('banner', e.target.value)} placeholder="/uploads/banner.jpg" />
        <ImagePreview url={d.banner ?? ''} />
      </div>

      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Синопсис</legend>
        {(['ru', 'kk', 'en'] as const).map((loc) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{loc.toUpperCase()}</label>
            <textarea rows={2} value={(d.synopsis as Record<string, string>)?.[loc] ?? ''}
              onChange={(e) => setLoc('synopsis', loc, e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-sm resize-none" />
          </div>
        ))}
      </fieldset>

      <div className="grid grid-cols-3 gap-3">
        <PersonSelect value={d.director ?? ''} onChange={(v) => set('director', v)} persons={persons} label="Режиссёр" />
        <PersonSelect value={d.cinematographer ?? ''} onChange={(v) => set('cinematographer', v)} persons={persons} label="Оператор" />
        <PersonSelect value={d.screenwriter ?? ''} onChange={(v) => set('screenwriter', v)} persons={persons} label="Сценарист" />
      </div>

      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Студия</legend>
        {(['ru', 'kk', 'en'] as const).map((loc) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{loc.toUpperCase()}</label>
            <Input value={(d.studio as Record<string, string>)?.[loc] ?? ''} onChange={(e) => setLoc('studio', loc, e.target.value)} />
          </div>
        ))}
      </fieldset>

      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Жанры</label>
        <TagInput value={d.genres ?? []} onChange={(v) => set('genres', v)} placeholder="drama, thriller..." />
      </div>
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Теги</label>
        <TagInput value={d.tags ?? []} onChange={(v) => set('tags', v)} placeholder="soviet-classic, spy..." />
      </div>
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Актёры</label>
        <TagInput value={d.cast ?? []} onChange={(v) => set('cast', v)} placeholder="Асанали Ашимов..." />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Длительность (мин)</label>
          <Input type="number" value={d.duration ?? 0} onChange={(e) => set('duration', Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Язык</label>
          <select value={d.language ?? 'ru'} onChange={(e) => set('language', e.target.value)} className={sel}>
            <option value="ru">Русский</option>
            <option value="kk">Казахский</option>
            <option value="mixed">Смешанный</option>
          </select>
        </div>
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Тип медиа</label>
          <select value={d.mediaType ?? 'film'} onChange={(e) => set('mediaType', e.target.value)} className={sel}>
            <option value="film">Фильм</option>
            <option value="documentary">Документальный</option>
            <option value="short">Короткометражный</option>
            <option value="animation">Анимация</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Архивный ID</label>
          <Input value={d.archiveId ?? ''} onChange={(e) => set('archiveId', e.target.value)} />
        </div>
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Историческая ценность (0–10)</label>
          <Input type="number" min={0} max={10} value={d.historicalRelevance ?? 5} onChange={(e) => set('historicalRelevance', Number(e.target.value))} />
        </div>
      </div>

      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Видео URL (необязательно)</label>
        <Input value={d.videoUrl ?? ''} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://..." />
      </div>
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Галерея (URL изображений)</label>
        <TagInput value={d.gallery ?? []} onChange={(v) => set('gallery', v)} placeholder="/uploads/img.jpg..." />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={d.featured ?? false} onChange={(e) => set('featured', e.target.checked)} className="rounded" />
        <span className="text-[rgb(var(--muted))]">Избранный (featured) — показывать на главной</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(d)} disabled={saving} className="flex-1">
          {saving ? 'Сохранение...' : <><Check className="w-4 h-4 mr-1" /> Сохранить</>}
        </Button>
        <Button variant="outline" onClick={onClose}>Отмена</Button>
      </div>
    </div>
  )
}

// ─── PERSON FORM ──────────────────────────────────────────────────────────────
function emptyPerson(): Partial<PersonType> {
  return {
    slug: '', name: { kk: '', ru: '', en: '' }, role: 'director',
    bio: { kk: '', ru: '', en: '' }, birthYear: 1940, deathYear: undefined,
    photo: '', films: [], featured: false,
  }
}

interface PersonFormProps { initial: Partial<PersonType>; onSave: (data: Partial<PersonType>) => Promise<void>; onClose: () => void; saving: boolean }

function PersonForm({ initial, onSave, onClose, saving }: PersonFormProps) {
  const [d, setD] = useState<Partial<PersonType>>(initial)
  const set = (k: string, v: unknown) => setD((p) => ({ ...p, [k]: v }))
  const setLoc = (field: 'name' | 'bio', locale: string, v: string) =>
    setD((p) => ({ ...p, [field]: { ...(p[field] as Record<string, string>), [locale]: v } }))

  return (
    <div className="space-y-4 text-sm">
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Slug <span className="text-red-400">*</span></label>
        <Input value={d.slug ?? ''} onChange={(e) => set('slug', e.target.value)} placeholder="asanali-ashimov" />
        <p className="text-xs text-[rgb(var(--muted))] mt-1">Только латиница, цифры и дефис.</p>
      </div>
      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Имя</legend>
        {(['ru', 'kk', 'en'] as const).map((loc) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{loc.toUpperCase()}</label>
            <Input value={(d.name as Record<string, string>)?.[loc] ?? ''} onChange={(e) => setLoc('name', loc, e.target.value)} />
          </div>
        ))}
      </fieldset>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Роль</label>
          <select value={d.role ?? 'director'} onChange={(e) => set('role', e.target.value)} className={sel}>
            <option value="director">Режиссёр</option>
            <option value="actor">Актёр</option>
            <option value="cinematographer">Оператор</option>
            <option value="writer">Сценарист</option>
            <option value="producer">Продюсер</option>
          </select>
        </div>
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Фото URL</label>
          <Input value={d.photo ?? ''} onChange={(e) => set('photo', e.target.value)} placeholder="/uploads/photo.jpg" />
          <ImagePreview url={d.photo ?? ''} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Год рождения</label>
          <Input type="number" value={d.birthYear ?? ''} onChange={(e) => set('birthYear', Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Год смерти (необязательно)</label>
          <Input type="number" value={d.deathYear ?? ''} onChange={(e) => set('deathYear', e.target.value ? Number(e.target.value) : undefined)} />
        </div>
      </div>
      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Биография</legend>
        {(['ru', 'kk', 'en'] as const).map((loc) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{loc.toUpperCase()}</label>
            <textarea rows={3} value={(d.bio as Record<string, string>)?.[loc] ?? ''}
              onChange={(e) => setLoc('bio', loc, e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-sm resize-none" />
          </div>
        ))}
      </fieldset>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={d.featured ?? false} onChange={(e) => set('featured', e.target.checked)} className="rounded" />
        <span className="text-[rgb(var(--muted))]">Избранный (featured)</span>
      </label>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(d)} disabled={saving} className="flex-1">
          {saving ? 'Сохранение...' : <><Check className="w-4 h-4 mr-1" /> Сохранить</>}
        </Button>
        <Button variant="outline" onClick={onClose}>Отмена</Button>
      </div>
    </div>
  )
}

// ─── COLLECTION FORM ──────────────────────────────────────────────────────────
function emptyCollection(): Partial<CollectionType> {
  return {
    slug: '', title: { kk: '', ru: '', en: '' },
    description: { kk: '', ru: '', en: '' }, curatorNotes: { kk: '', ru: '', en: '' },
    cover: '', films: [], era: 'soviet',
  }
}

interface CollectionFormProps { initial: Partial<CollectionType>; onSave: (data: Partial<CollectionType>) => Promise<void>; onClose: () => void; saving: boolean; allFilms: FilmType[] }

function CollectionForm({ initial, onSave, onClose, saving, allFilms }: CollectionFormProps) {
  const [d, setD] = useState<Partial<CollectionType>>(initial)
  const set = (k: string, v: unknown) => setD((p) => ({ ...p, [k]: v }))
  const setLoc = (field: 'title' | 'description' | 'curatorNotes', locale: string, v: string) =>
    setD((p) => ({ ...p, [field]: { ...(p[field] as Record<string, string>), [locale]: v } }))

  const toggleFilm = (slug: string) => {
    const current = d.films ?? []
    set('films', current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug])
  }

  return (
    <div className="space-y-4 text-sm">
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Slug <span className="text-red-400">*</span></label>
        <Input value={d.slug ?? ''} onChange={(e) => set('slug', e.target.value)} placeholder="golden-age" />
      </div>
      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Название</legend>
        {(['ru', 'kk', 'en'] as const).map((loc) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{loc.toUpperCase()}</label>
            <Input value={(d.title as Record<string, string>)?.[loc] ?? ''} onChange={(e) => setLoc('title', loc, e.target.value)} />
          </div>
        ))}
      </fieldset>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Обложка URL</label>
          <Input value={d.cover ?? ''} onChange={(e) => set('cover', e.target.value)} placeholder="/uploads/cover.jpg" />
          <ImagePreview url={d.cover ?? ''} />
        </div>
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Эра</label>
          <Input value={d.era ?? ''} onChange={(e) => set('era', e.target.value)} placeholder="golden-age" />
        </div>
      </div>
      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Описание</legend>
        {(['ru', 'kk', 'en'] as const).map((loc) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{loc.toUpperCase()}</label>
            <textarea rows={2} value={(d.description as Record<string, string>)?.[loc] ?? ''}
              onChange={(e) => setLoc('description', loc, e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-sm resize-none" />
          </div>
        ))}
      </fieldset>
      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Заметки куратора</legend>
        {(['ru', 'kk', 'en'] as const).map((loc) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{loc.toUpperCase()}</label>
            <textarea rows={2} value={(d.curatorNotes as Record<string, string>)?.[loc] ?? ''}
              onChange={(e) => setLoc('curatorNotes', loc, e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-sm resize-none" />
          </div>
        ))}
      </fieldset>
      <div>
        <label className="block text-[rgb(var(--muted))] mb-2">Фильмы в коллекции</label>
        <div className="max-h-48 overflow-y-auto border border-[rgb(var(--border))] rounded-lg divide-y divide-[rgb(var(--border))]">
          {allFilms.map((f) => (
            <label key={f.id} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[rgb(var(--surface))]/50 text-sm">
              <input type="checkbox" checked={(d.films ?? []).includes(f.slug)} onChange={() => toggleFilm(f.slug)} className="rounded" />
              <span className="text-[rgb(var(--foreground))]">{f.title.ru}</span>
              <span className="text-[rgb(var(--muted))] text-xs ml-auto">{f.year}</span>
            </label>
          ))}
          {allFilms.length === 0 && <p className="px-3 py-4 text-[rgb(var(--muted))] text-xs">Фильмы не загружены</p>}
        </div>
        <p className="text-xs text-[rgb(var(--muted))] mt-1">Выбрано: {(d.films ?? []).length}</p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(d)} disabled={saving} className="flex-1">
          {saving ? 'Сохранение...' : <><Check className="w-4 h-4 mr-1" /> Сохранить</>}
        </Button>
        <Button variant="outline" onClick={onClose}>Отмена</Button>
      </div>
    </div>
  )
}

// ─── TIMELINE FORM ────────────────────────────────────────────────────────────
function emptyTimeline(): Partial<TimelineEvent> {
  return {
    id: '', year: new Date().getFullYear(),
    title: { kk: '', ru: '', en: '' }, description: { kk: '', ru: '', en: '' },
    type: 'event', era: 'modern', filmSlug: '', image: '',
  }
}

interface TimelineFormProps { initial: Partial<TimelineEvent>; onSave: (data: Partial<TimelineEvent>) => Promise<void>; onClose: () => void; saving: boolean }

function TimelineForm({ initial, onSave, onClose, saving }: TimelineFormProps) {
  const [d, setD] = useState<Partial<TimelineEvent>>(initial)
  const set = (k: string, v: unknown) => setD((p) => ({ ...p, [k]: v }))
  const setLoc = (field: 'title' | 'description', locale: string, v: string) =>
    setD((p) => ({ ...p, [field]: { ...(p[field] as Record<string, string>), [locale]: v } }))

  return (
    <div className="space-y-4 text-sm">
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Slug / ID <span className="text-red-400">*</span></label>
        <Input value={d.id ?? ''} onChange={(e) => set('id', e.target.value)} placeholder="kz-cinema-1938" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Год</label>
          <Input type="number" value={d.year ?? ''} onChange={(e) => set('year', Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Тип</label>
          <select value={d.type ?? 'event'} onChange={(e) => set('type', e.target.value)} className={sel}>
            <option value="film">Фильм (ссылка на фильм в БД)</option>
            <option value="event">Событие (обычное)</option>
            <option value="milestone">Этапное событие</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Эра</label>
          <select value={d.era ?? 'modern'} onChange={(e) => set('era', e.target.value)} className={sel}>
            <option value="early">Ранний период</option>
            <option value="soviet">Советский период</option>
            <option value="independence">Независимость</option>
            <option value="modern">Современность</option>
          </select>
        </div>
        <div>
          <label className="block text-[rgb(var(--muted))] mb-1">Slug фильма (если тип = Film)</label>
          <Input value={d.filmSlug ?? ''} onChange={(e) => set('filmSlug', e.target.value)} placeholder="konets-atamana" />
        </div>
      </div>
      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Заголовок</legend>
        {(['ru', 'kk', 'en'] as const).map((loc) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{loc.toUpperCase()}</label>
            <Input value={(d.title as Record<string, string>)?.[loc] ?? ''} onChange={(e) => setLoc('title', loc, e.target.value)} />
          </div>
        ))}
      </fieldset>
      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Описание</legend>
        {(['ru', 'kk', 'en'] as const).map((loc) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{loc.toUpperCase()}</label>
            <textarea rows={2} value={(d.description as Record<string, string>)?.[loc] ?? ''}
              onChange={(e) => setLoc('description', loc, e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-sm resize-none" />
          </div>
        ))}
      </fieldset>
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Изображение URL (необязательно)</label>
        <Input value={d.image ?? ''} onChange={(e) => set('image', e.target.value)} placeholder="/uploads/img.jpg" />
        <ImagePreview url={d.image ?? ''} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(d)} disabled={saving} className="flex-1">
          {saving ? 'Сохранение...' : <><Check className="w-4 h-4 mr-1" /> Сохранить</>}
        </Button>
        <Button variant="outline" onClick={onClose}>Отмена</Button>
      </div>
    </div>
  )
}

// ─── TEAM FORM ────────────────────────────────────────────────────────────────
function emptyTeamMember(): Partial<TeamMemberRow> {
  return { order: 0, nameRu: '', nameKk: '', nameEn: '', roleRu: '', quoteRu: '', skills: '[]', photo: '' }
}

interface TeamFormProps { initial: Partial<TeamMemberRow>; onSave: (data: Partial<TeamMemberRow>) => Promise<void>; onClose: () => void; saving: boolean; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<string | null> }

function TeamMemberForm({ initial, onSave, onClose, saving, onUpload }: TeamFormProps) {
  const [d, setD] = useState<Partial<TeamMemberRow>>(initial)
  const [uploading, setUploading] = useState(false)
  const set = (k: string, v: unknown) => setD((p) => ({ ...p, [k]: v }))
  const skills = (() => { try { return JSON.parse(d.skills ?? '[]') as string[] } catch { return [] } })()

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true)
    const url = await onUpload(e)
    if (url) set('photo', url)
    setUploading(false)
  }

  return (
    <div className="space-y-4 text-sm">
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Порядок отображения</label>
        <Input type="number" value={d.order ?? 0} onChange={(e) => set('order', Number(e.target.value))} />
        <p className="text-xs text-[rgb(var(--muted))] mt-1">0 = первый, 1 = второй и т.д.</p>
      </div>
      <fieldset className="border border-[rgb(var(--border))] rounded-lg p-3">
        <legend className="text-xs text-[rgb(var(--muted))] px-1">Имя</legend>
        {[['ru', 'Русский'], ['kk', 'Казахский'], ['en', 'English']] .map(([loc, label]) => (
          <div key={loc} className="mb-2">
            <label className="block text-[rgb(var(--muted))] text-xs mb-0.5">{label}</label>
            <Input value={(d as Record<string, string>)[`name${loc.charAt(0).toUpperCase() + loc.slice(1)}`] ?? ''} onChange={(e) => set(`name${loc.charAt(0).toUpperCase() + loc.slice(1)}`, e.target.value)} />
          </div>
        ))}
      </fieldset>
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Роль (RU)</label>
        <Input value={d.roleRu ?? ''} onChange={(e) => set('roleRu', e.target.value)} placeholder="ДИЗАЙН · КОНЦЕПЦИЯ · ИНТЕРФЕЙС" />
      </div>
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Цитата (RU)</label>
        <textarea rows={3} value={d.quoteRu ?? ''}
          onChange={(e) => set('quoteRu', e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-sm resize-none"
          placeholder="Цитата участника команды..." />
      </div>
      <div>
        <label className="block text-[rgb(var(--muted))] mb-1">Навыки</label>
        <TagInput value={skills} onChange={(v) => set('skills', JSON.stringify(v))} placeholder="UX/UI, Разработка..." />
      </div>
      <div>
        <label className="block text-[rgb(var(--muted))] mb-2">Фото</label>
        <div className="flex gap-3 items-start">
          <div className="flex-1 space-y-2">
            <Input value={d.photo ?? ''} onChange={(e) => set('photo', e.target.value)} placeholder="/uploads/photo.jpg или URL" />
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--accent))]/15 hover:bg-[rgb(var(--accent))]/25 text-[rgb(var(--accent))] text-xs font-medium transition-colors">
              {uploading ? 'Загрузка...' : 'Загрузить фото'}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
            </label>
          </div>
          {d.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.photo} alt="" className="w-16 h-16 rounded-full object-cover border border-[rgb(var(--border))]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          )}
        </div>
        <p className="text-xs text-[rgb(var(--muted))] mt-1">Загрузите через кнопку или вставьте URL из вкладки «Медиа»</p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(d)} disabled={saving} className="flex-1">
          {saving ? 'Сохранение...' : <><Check className="w-4 h-4 mr-1" /> Сохранить</>}
        </Button>
        <Button variant="outline" onClick={onClose}>Отмена</Button>
      </div>
    </div>
  )
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'ru'

  const userRole = (session?.user as { role?: string })?.role
  const isAdmin = userRole === 'ADMIN'
  const isModerator = userRole === 'MODERATOR'

  const [tab, setTab] = useState<Tab>('users')
  const [users, setUsers] = useState<UserRow[]>([])
  const [comments, setComments] = useState<CommentRow[]>([])
  const [uploadUrl, setUploadUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [films, setFilms] = useState<FilmType[]>([])
  const [persons, setPersons] = useState<PersonType[]>([])
  const [collections, setCollections] = useState<CollectionType[]>([])
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMemberRow[]>([])

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sheetData, setSheetData] = useState<Partial<FilmType> | Partial<PersonType> | Partial<CollectionType> | Partial<TimelineEvent> | Partial<TeamMemberRow> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && !isAdmin && !isModerator)) {
      router.replace(`/${locale}`)
    }
  }, [status, isAdmin, isModerator, locale, router])

  useEffect(() => {
    if (isModerator && !isAdmin) startTransition(() => setTab('comments'))
  }, [isModerator, isAdmin])

  useEffect(() => {
    if (!isAdmin && !isModerator) return
    if (tab === 'users' && isAdmin) fetch('/api/admin/users').then((r) => r.json()).then(setUsers)
    else if (tab === 'comments') fetch('/api/admin/comments').then((r) => r.json()).then(setComments)
    else if (tab === 'films' && isAdmin) {
      Promise.all([
        fetch('/api/admin/films').then((r) => r.json()),
        fetch('/api/admin/persons').then((r) => r.json()),
      ]).then(([f, p]) => { setFilms(f); setPersons(p) })
    }
    else if (tab === 'persons' && isAdmin) fetch('/api/admin/persons').then((r) => r.json()).then(setPersons)
    else if (tab === 'collections' && isAdmin) {
      Promise.all([
        fetch('/api/admin/collections').then((r) => r.json()),
        fetch('/api/admin/films').then((r) => r.json()),
      ]).then(([c, f]) => { setCollections(c); setFilms(f) })
    }
    else if (tab === 'timeline' && isAdmin) fetch('/api/admin/timeline').then((r) => r.json()).then(setTimelineEvents)
    else if (tab === 'team' && isAdmin) fetch('/api/team').then((r) => r.json()).then(setTeamMembers)
  }, [tab, isAdmin, isModerator])

  const changeRole = async (id: string, role: string) => {
    const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role }) })
    if (res.ok) setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
  }

  const deleteComment = async (id: string) => {
    const res = await fetch(`/api/admin/comments?id=${id}`, { method: 'DELETE' })
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id))
    else toast.error('Не удалось удалить комментарий')
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    if (res.ok) setUploadUrl((await res.json()).url)
    else toast.error('Ошибка загрузки файла')
    setUploading(false)
  }

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>): Promise<string | null> => {
    const file = e.target.files?.[0]
    if (!file) return null
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    if (res.ok) { const { url } = await res.json(); return url as string }
    toast.error('Ошибка загрузки файла')
    return null
  }

  const saveTeamMember = async (data: Partial<TeamMemberRow>) => {
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch('/api/team', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...data }) })
        if (res.ok) { const u = await res.json(); setTeamMembers((p) => p.map((x) => x.id === editingId ? u : x)); setSheetOpen(false); toast.success('Сохранено') }
        else { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка сохранения') }
      } else {
        const res = await fetch('/api/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        if (res.ok) { const c = await res.json(); setTeamMembers((p) => [...p, c]); setSheetOpen(false); toast.success('Участник добавлен') }
        else { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка создания') }
      }
    } finally { setSaving(false) }
  }

  const deleteTeamMember = async (id: string) => {
    if (!confirm('Удалить участника команды?')) return
    const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' })
    if (res.ok) setTeamMembers((p) => p.filter((x) => x.id !== id))
    else toast.error('Ошибка удаления')
  }

  const openCreate = () => {
    const empty = tab === 'films' ? emptyFilm() : tab === 'persons' ? emptyPerson() : tab === 'collections' ? emptyCollection() : tab === 'team' ? emptyTeamMember() : emptyTimeline()
    setEditingId(null)
    setSheetData(empty)
    setSheetOpen(true)
  }

  const openEdit = (item: FilmType | PersonType | CollectionType | TimelineEvent) => {
    setEditingId((item as { id: string }).id)
    setSheetData(item)
    setSheetOpen(true)
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Удалить запись? Это действие необратимо.')) return
    const base = tab === 'films' ? '/api/admin/films' : tab === 'persons' ? '/api/admin/persons' : tab === 'collections' ? '/api/admin/collections' : '/api/admin/timeline'
    const res = await fetch(`${base}/${id}`, { method: 'DELETE' })
    if (!res.ok) { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка удаления'); return }
    if (tab === 'films') setFilms((p) => p.filter((f) => f.id !== id))
    else if (tab === 'persons') setPersons((p) => p.filter((x) => x.id !== id))
    else if (tab === 'collections') setCollections((p) => p.filter((x) => x.id !== id))
    else if (tab === 'timeline') setTimelineEvents((p) => p.filter((x) => x.id !== id))
    toast.success('Удалено')
  }

  const saveFilm = async (data: Partial<FilmType>) => {
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/films/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        if (res.ok) { const u = await res.json(); setFilms((p) => p.map((f) => f.id === editingId ? u : f)); setSheetOpen(false); toast.success('Сохранено') }
        else { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка сохранения') }
      } else {
        const res = await fetch('/api/admin/films', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        if (res.ok) { const c = await res.json(); setFilms((p) => [c, ...p]); setSheetOpen(false); toast.success('Фильм добавлен') }
        else { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка создания') }
      }
    } finally { setSaving(false) }
  }

  const savePerson = async (data: Partial<PersonType>) => {
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/persons/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        if (res.ok) { const u = await res.json(); setPersons((p) => p.map((x) => x.id === editingId ? u : x)); setSheetOpen(false); toast.success('Сохранено') }
        else { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка сохранения') }
      } else {
        const res = await fetch('/api/admin/persons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        if (res.ok) { const c = await res.json(); setPersons((p) => [c, ...p]); setSheetOpen(false); toast.success('Персона добавлена') }
        else { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка создания') }
      }
    } finally { setSaving(false) }
  }

  const saveCollection = async (data: Partial<CollectionType>) => {
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/collections/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        if (res.ok) { const u = await res.json(); setCollections((p) => p.map((x) => x.id === editingId ? u : x)); setSheetOpen(false); toast.success('Сохранено') }
        else { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка сохранения') }
      } else {
        const res = await fetch('/api/admin/collections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        if (res.ok) { const c = await res.json(); setCollections((p) => [c, ...p]); setSheetOpen(false); toast.success('Коллекция добавлена') }
        else { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка создания') }
      }
    } finally { setSaving(false) }
  }

  const saveTimeline = async (data: Partial<TimelineEvent>) => {
    setSaving(true)
    try {
      const payload = { ...data, slug: data.id }
      if (editingId) {
        const res = await fetch(`/api/admin/timeline/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (res.ok) { const u = await res.json(); setTimelineEvents((p) => p.map((x) => x.id === editingId ? u : x)); setSheetOpen(false); toast.success('Сохранено') }
        else { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка сохранения') }
      } else {
        const res = await fetch('/api/admin/timeline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (res.ok) { const c = await res.json(); setTimelineEvents((p) => [c, ...p]); setSheetOpen(false); toast.success('Событие добавлено') }
        else { const err = await res.json().catch(() => ({})); toast.error(err.error ?? 'Ошибка создания') }
      }
    } finally { setSaving(false) }
  }

  if (status === 'loading') return null

  const isContentTab = ['films', 'persons', 'collections', 'timeline', 'team'].includes(tab)

  type NavItem = { key: Tab; label: string; icon: React.ReactNode; adminOnly: boolean }
  const navItems: NavItem[] = [
    { key: 'users', label: 'Пользователи', icon: <Users className="w-4 h-4" />, adminOnly: true },
    { key: 'comments', label: 'Комментарии', icon: <MessageSquare className="w-4 h-4" />, adminOnly: false },
    { key: 'media', label: 'Медиа', icon: <Upload className="w-4 h-4" />, adminOnly: true },
    { key: 'films', label: 'Фильмы', icon: <Film className="w-4 h-4" />, adminOnly: true },
    { key: 'persons', label: 'Персоны', icon: <User className="w-4 h-4" />, adminOnly: true },
    { key: 'collections', label: 'Коллекции', icon: <BookOpen className="w-4 h-4" />, adminOnly: true },
    { key: 'timeline', label: 'Хронология', icon: <Clock className="w-4 h-4" />, adminOnly: true },
    { key: 'team', label: 'Команда', icon: <Users className="w-4 h-4" />, adminOnly: true },
  ]
  const visibleNav = navItems.filter((n) => !n.adminOnly || isAdmin)

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-7 h-7 text-[rgb(var(--accent))]" />
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">Панель управления</h1>
            <p className="text-xs text-[rgb(var(--muted))] mt-0.5">
              Вы вошли как <span className={`font-semibold ${isAdmin ? 'text-red-400' : 'text-amber-400'}`}>{userRole}</span>
              {isModerator && !isAdmin && ' — доступна только модерация комментариев'}
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          {/* SIDEBAR */}
          <aside className="w-48 shrink-0">
            <nav className="space-y-1">
              {visibleNav.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors text-left ${
                    tab === key
                      ? 'bg-[rgb(var(--accent))]/15 text-[rgb(var(--accent))]'
                      : 'text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface))] hover:text-[rgb(var(--foreground))]'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">

            {/* Section header with Add button */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                {navItems.find((n) => n.key === tab)?.label}
              </h2>
              {isContentTab && isAdmin && (
                <Button onClick={openCreate} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Добавить
                </Button>
              )}
            </div>

            {/* ─── USERS ─── */}
            {tab === 'users' && (
              <>
                <InfoBlock id="users">
                  <strong>Роли:</strong> ADMIN — полный доступ ко всему. MODERATOR — только вкладка «Комментарии» (удалять спам). USER — обычный пользователь сайта. Нельзя понизить другого ADMIN и нельзя менять свою роль.
                </InfoBlock>
                <div className="rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[rgb(var(--border))]">
                      <tr className="text-[rgb(var(--muted))] text-xs uppercase tracking-wider">
                        <th className="text-left px-6 py-3">Имя</th>
                        <th className="text-left px-6 py-3">Email</th>
                        <th className="text-left px-6 py-3">Роль</th>
                        <th className="text-left px-6 py-3">Дата</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u.id} className={`border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--surface))]/40 ${i % 2 === 0 ? '' : 'bg-[rgb(var(--surface))]/20'}`}>
                          <td className="px-6 py-4 text-[rgb(var(--foreground))] font-medium">{u.name || '—'}</td>
                          <td className="px-6 py-4 text-[rgb(var(--muted))]">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs border ${roleBadge[u.role] || roleBadge.USER}`}>{u.role}</span>
                          </td>
                          <td className="px-6 py-4 text-[rgb(var(--muted))]">{new Date(u.createdAt).toLocaleDateString('ru-RU')}</td>
                          <td className="px-6 py-4">
                            {u.role !== 'ADMIN' && u.id !== session?.user?.id && (
                              <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}
                                className="text-xs bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-lg px-2 py-1 focus:outline-none">
                                <option value="USER">USER</option>
                                <option value="MODERATOR">MODERATOR</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-10 text-center text-[rgb(var(--muted))]">Нет пользователей</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ─── COMMENTS ─── */}
            {tab === 'comments' && (
              <>
                <InfoBlock id="comments">
                  Все комментарии пользователей. Нажмите «Удалить» рядом со спамом или неуместным контентом — действие необратимо.
                </InfoBlock>
                <div className="space-y-3">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-4 items-start p-5 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[rgb(var(--foreground))] text-sm">{c.user.name || c.user.email || 'User'}</span>
                          <span className="text-[rgb(var(--muted))] text-xs">→ {c.filmSlug}</span>
                          <span className="text-[rgb(var(--muted))] text-xs ml-auto">{new Date(c.createdAt).toLocaleString('ru-RU')}</span>
                        </div>
                        <p className="text-[rgb(var(--muted))] text-sm leading-relaxed">{c.content}</p>
                      </div>
                      <button onClick={() => deleteComment(c.id)}
                        className="shrink-0 text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors border border-red-500/20">
                        Удалить
                      </button>
                    </div>
                  ))}
                  {comments.length === 0 && <p className="text-center text-[rgb(var(--muted))] py-10">Комментариев нет</p>}
                </div>
              </>
            )}

            {/* ─── MEDIA ─── */}
            {tab === 'media' && (
              <>
                <InfoBlock id="media">
                  <strong>Как использовать:</strong> загрузите фото → получите URL вида <code className="bg-sky-900/40 px-1 rounded">/uploads/имя-файла.jpg</code> → нажмите «Копировать» → вставьте этот URL в поле «Постер», «Баннер», «Фото» или «Обложка» в формах фильмов, персон и коллекций. Файлы хранятся на сервере.
                </InfoBlock>
                <div className="max-w-lg space-y-6">
                  <div className="p-8 rounded-2xl bg-[rgb(var(--card))] border-2 border-dashed border-[rgb(var(--border))] text-center">
                    <Upload className="w-10 h-10 text-[rgb(var(--muted))] mx-auto mb-4" />
                    <p className="text-[rgb(var(--foreground))] font-medium mb-2">Загрузить файл</p>
                    <p className="text-[rgb(var(--muted))] text-sm mb-4">JPG, PNG, WebP, MP4 — до 50 МБ</p>
                    <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/90 text-black font-semibold text-sm transition-colors">
                      {uploading ? 'Загрузка...' : 'Выбрать файл'}
                      <input type="file" accept="image/*,video/mp4" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                  </div>
                  {uploadUrl && (
                    <div className="p-5 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--accent))]/30">
                      <p className="text-[rgb(var(--muted))] text-xs mb-2">Загружено! Скопируйте URL и вставьте в нужное поле:</p>
                      <div className="flex items-center gap-2 mb-3">
                        <code className="flex-1 text-[rgb(var(--accent))] text-sm bg-[rgb(var(--surface))] px-3 py-2 rounded-lg font-mono break-all">{uploadUrl}</code>
                        <button onClick={() => { navigator.clipboard.writeText(uploadUrl); toast.success('Скопировано!') }}
                          className="shrink-0 px-3 py-2 rounded-lg bg-[rgb(var(--accent))]/20 hover:bg-[rgb(var(--accent))]/30 text-[rgb(var(--accent))] text-xs font-medium transition-colors">
                          Копировать
                        </button>
                      </div>
                      <ImagePreview url={uploadUrl} />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ─── FILMS ─── */}
            {tab === 'films' && (
              <>
                <InfoBlock id="films">
                  <strong>Slug</strong> — уникальный ID фильма только латиницей через дефис (например <code className="bg-sky-900/40 px-1 rounded">konets-atamana</code>). <strong>Постер и Баннер</strong> — URL изображения, лучше сначала загрузить через вкладку «Медиа». Жанры и теги вводите по одному и нажимайте Enter. Режиссёра/оператора выбирайте из выпадающего списка — персоны берутся из базы.
                </InfoBlock>
                <div className="rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[rgb(var(--border))]">
                      <tr className="text-[rgb(var(--muted))] text-xs uppercase tracking-wider">
                        <th className="text-left px-4 py-3">Постер</th>
                        <th className="text-left px-4 py-3">Название</th>
                        <th className="text-left px-4 py-3">Год</th>
                        <th className="text-left px-4 py-3">Тип</th>
                        <th className="text-left px-4 py-3">★</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {films.map((f, i) => (
                        <tr key={f.id} className={`border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--surface))]/40 ${i % 2 === 0 ? '' : 'bg-[rgb(var(--surface))]/20'}`}>
                          <td className="px-4 py-3">
                            {f.poster
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={f.poster} alt="" className="w-10 h-10 object-cover rounded-lg border border-[rgb(var(--border))]" />
                              : <div className="w-10 h-10 rounded-lg bg-[rgb(var(--surface))] border border-[rgb(var(--border))]" />}
                          </td>
                          <td className="px-4 py-3 font-medium text-[rgb(var(--foreground))]">{f.title.ru}</td>
                          <td className="px-4 py-3 text-[rgb(var(--muted))]">{f.year}</td>
                          <td className="px-4 py-3 text-[rgb(var(--muted))]">{f.mediaType}</td>
                          <td className="px-4 py-3">{f.featured && <span className="text-[rgb(var(--accent))] text-base">★</span>}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg hover:bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => deleteItem(f.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {films.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-[rgb(var(--muted))]">Нет фильмов</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ─── PERSONS ─── */}
            {tab === 'persons' && (
              <>
                <InfoBlock id="persons">
                  <strong>Slug</strong> — уникальный ID персоны (например <code className="bg-sky-900/40 px-1 rounded">asanali-ashimov</code>). <strong>Фото</strong> — URL из вкладки «Медиа». После добавления персоны она появится в выпадающих списках формы фильмов (Режиссёр, Оператор, Сценарист).
                </InfoBlock>
                <div className="rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[rgb(var(--border))]">
                      <tr className="text-[rgb(var(--muted))] text-xs uppercase tracking-wider">
                        <th className="text-left px-4 py-3">Фото</th>
                        <th className="text-left px-4 py-3">Имя</th>
                        <th className="text-left px-4 py-3">Роль</th>
                        <th className="text-left px-4 py-3">Годы</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {persons.map((p, i) => (
                        <tr key={p.id} className={`border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--surface))]/40 ${i % 2 === 0 ? '' : 'bg-[rgb(var(--surface))]/20'}`}>
                          <td className="px-4 py-3">
                            {p.photo
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={p.photo} alt="" className="w-10 h-10 object-cover rounded-full border border-[rgb(var(--border))]" />
                              : <div className="w-10 h-10 rounded-full bg-[rgb(var(--surface))] border border-[rgb(var(--border))]" />}
                          </td>
                          <td className="px-4 py-3 font-medium text-[rgb(var(--foreground))]">{p.name.ru}</td>
                          <td className="px-4 py-3 text-[rgb(var(--muted))]">{p.role}</td>
                          <td className="px-4 py-3 text-[rgb(var(--muted))]">{p.birthYear}{p.deathYear ? `–${p.deathYear}` : ''}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => deleteItem(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {persons.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-[rgb(var(--muted))]">Нет персон</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ─── COLLECTIONS ─── */}
            {tab === 'collections' && (
              <>
                <InfoBlock id="collections">
                  Коллекции объединяют фильмы по тематике. <strong>Фильмы</strong> выбираются галочками из списка — убедитесь что нужные фильмы уже добавлены в базу. <strong>Обложка</strong> — URL изображения из вкладки «Медиа».
                </InfoBlock>
                <div className="rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[rgb(var(--border))]">
                      <tr className="text-[rgb(var(--muted))] text-xs uppercase tracking-wider">
                        <th className="text-left px-4 py-3">Обложка</th>
                        <th className="text-left px-4 py-3">Название</th>
                        <th className="text-left px-4 py-3">Эра</th>
                        <th className="text-left px-4 py-3">Фильмов</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {collections.map((c, i) => (
                        <tr key={c.id} className={`border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--surface))]/40 ${i % 2 === 0 ? '' : 'bg-[rgb(var(--surface))]/20'}`}>
                          <td className="px-4 py-3">
                            {c.cover
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={c.cover} alt="" className="w-10 h-10 object-cover rounded-lg border border-[rgb(var(--border))]" />
                              : <div className="w-10 h-10 rounded-lg bg-[rgb(var(--surface))] border border-[rgb(var(--border))]" />}
                          </td>
                          <td className="px-4 py-3 font-medium text-[rgb(var(--foreground))]">{c.title.ru}</td>
                          <td className="px-4 py-3 text-[rgb(var(--muted))]">{c.era}</td>
                          <td className="px-4 py-3 text-[rgb(var(--muted))]">{c.films.length}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => deleteItem(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {collections.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-[rgb(var(--muted))]">Нет коллекций</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ─── TEAM ─── */}
            {tab === 'team' && (
              <>
                <InfoBlock id="team">
                  Участники команды отображаются на странице «О проекте». Нажмите «Добавить» чтобы создать карточку. Фото загружается прямо в форме — нажмите «Загрузить фото» или вставьте URL из вкладки «Медиа». После сохранения страница /about обновится автоматически.
                </InfoBlock>
                <div className="rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[rgb(var(--border))]">
                      <tr className="text-[rgb(var(--muted))] text-xs uppercase tracking-wider">
                        <th className="text-left px-4 py-3">Фото</th>
                        <th className="text-left px-4 py-3">Имя</th>
                        <th className="text-left px-4 py-3">Роль</th>
                        <th className="text-left px-4 py-3">№</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((m, i) => (
                        <tr key={m.id} className={`border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--surface))]/40 ${i % 2 === 0 ? '' : 'bg-[rgb(var(--surface))]/20'}`}>
                          <td className="px-4 py-3">
                            {m.photo
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={m.photo} alt="" className="w-10 h-10 object-cover rounded-full border border-[rgb(var(--border))]" />
                              : <div className="w-10 h-10 rounded-full bg-[rgb(var(--surface))] border border-[rgb(var(--border))] flex items-center justify-center text-[rgb(var(--accent))] font-bold text-sm">{m.nameRu[0]}</div>}
                          </td>
                          <td className="px-4 py-3 font-medium text-[rgb(var(--foreground))]">{m.nameRu}</td>
                          <td className="px-4 py-3 text-[rgb(var(--muted))] text-xs">{m.roleRu}</td>
                          <td className="px-4 py-3 text-[rgb(var(--muted))]">{m.order}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => { setEditingId(m.id); setSheetData(m); setSheetOpen(true) }} className="p-1.5 rounded-lg hover:bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => deleteTeamMember(m.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {teamMembers.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-[rgb(var(--muted))]">Участников нет — нажмите «Добавить»</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ─── TIMELINE ─── */}
            {tab === 'timeline' && (
              <>
                <InfoBlock id="timeline">
                  <strong>Тип события:</strong> «Фильм» — ссылается на конкретный фильм в базе (укажите его slug), «Событие» — обычная историческая дата, «Этапное» — важная веха. <strong>Эра</strong> определяет в какой раздел страницы хронологии попадёт запись.
                </InfoBlock>
                <div className="rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[rgb(var(--border))]">
                      <tr className="text-[rgb(var(--muted))] text-xs uppercase tracking-wider">
                        <th className="text-left px-4 py-3">Год</th>
                        <th className="text-left px-4 py-3">Событие</th>
                        <th className="text-left px-4 py-3">Тип</th>
                        <th className="text-left px-4 py-3">Эра</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {timelineEvents.map((e, i) => (
                        <tr key={e.id} className={`border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--surface))]/40 ${i % 2 === 0 ? '' : 'bg-[rgb(var(--surface))]/20'}`}>
                          <td className="px-4 py-3 font-mono font-bold text-[rgb(var(--accent))]">{e.year}</td>
                          <td className="px-4 py-3 font-medium text-[rgb(var(--foreground))]">{e.title.ru}</td>
                          <td className="px-4 py-3 text-[rgb(var(--muted))]">{e.type}</td>
                          <td className="px-4 py-3 text-[rgb(var(--muted))]">{e.era}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => deleteItem(e.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {timelineEvents.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-[rgb(var(--muted))]">Нет событий</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* ─── SHEET ─── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:w-[580px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-center justify-between">
              <SheetTitle>
                {editingId ? 'Редактировать' : 'Добавить'}
                {' '}
                {tab === 'films' ? 'фильм' : tab === 'persons' ? 'персону' : tab === 'collections' ? 'коллекцию' : tab === 'team' ? 'участника команды' : 'событие'}
              </SheetTitle>
              <button onClick={() => setSheetOpen(false)} className="text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]">
                <X className="w-5 h-5" />
              </button>
            </div>
          </SheetHeader>

          {tab === 'films' && sheetData && (
            <FilmForm initial={sheetData as Partial<FilmType>} onSave={saveFilm} onClose={() => setSheetOpen(false)} saving={saving} persons={persons} />
          )}
          {tab === 'persons' && sheetData && (
            <PersonForm initial={sheetData as Partial<PersonType>} onSave={savePerson} onClose={() => setSheetOpen(false)} saving={saving} />
          )}
          {tab === 'collections' && sheetData && (
            <CollectionForm initial={sheetData as Partial<CollectionType>} onSave={saveCollection} onClose={() => setSheetOpen(false)} saving={saving} allFilms={films} />
          )}
          {tab === 'timeline' && sheetData && (
            <TimelineForm initial={sheetData as Partial<TimelineEvent>} onSave={saveTimeline} onClose={() => setSheetOpen(false)} saving={saving} />
          )}
          {tab === 'team' && sheetData && (
            <TeamMemberForm initial={sheetData as Partial<TeamMemberRow>} onSave={saveTeamMember} onClose={() => setSheetOpen(false)} saving={saving} onUpload={uploadFile} />
          )}
        </SheetContent>
      </Sheet>
    </main>
  )
}
