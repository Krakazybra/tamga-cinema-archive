'use client'
import { useRef, useState, useEffect } from 'react'
import { Upload, CheckCircle } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface FileUploadProps {
  onUpload?: (url: string) => void
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const locale = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const progressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearTimeout(progressTimer.current)
    }
  }, [])

  const t = {
    drag: locale === 'kk' ? 'Басыңыз немесе файлды сүйреңіз' : locale === 'en' ? 'Click or drag a file here' : 'Нажмите или перетащите файл',
    hint: locale === 'kk' ? 'JPEG, PNG, MP4, MP3, PDF, DOCX, ZIP — макс. 50MB' : locale === 'en' ? 'JPEG, PNG, MP4, MP3, PDF, DOCX, ZIP — max 50MB' : 'JPEG, PNG, MP4, MP3, PDF, DOCX, ZIP — макс. 50MB',
    choose: locale === 'kk' ? 'Файл таңдау' : locale === 'en' ? 'Choose file' : 'Выбрать файл',
    uploaded: locale === 'kk' ? 'Жүктелді' : locale === 'en' ? 'Uploaded' : 'Загружено',
    errorUpload: locale === 'kk' ? 'Жүктеу қатесі' : locale === 'en' ? 'Upload error' : 'Ошибка загрузки',
    errorNet: locale === 'kk' ? 'Желі қатесі' : locale === 'en' ? 'Network error' : 'Ошибка сети при загрузке',
    success: (name: string) => locale === 'kk' ? `"${name}" жүктелді` : locale === 'en' ? `"${name}" uploaded` : `Файл "${name}" загружен`,
  }

  const handleFile = async (file: File) => {
    setUploading(true)
    setProgress(20)

    const formData = new FormData()
    formData.append('file', file)

    try {
      setProgress(50)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      setProgress(90)

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || t.errorUpload)
        return
      }

      const data = await res.json()
      setProgress(100)
      setUploadedUrl(data.url)
      onUpload?.(data.url)
      toast.success(t.success(data.name))
    } catch {
      toast.error(t.errorNet)
    } finally {
      setUploading(false)
      progressTimer.current = setTimeout(() => setProgress(0), 1500)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-[rgb(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:border-[rgb(var(--primary))] transition-colors"
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-[rgb(var(--muted))]" />
        <p className="text-sm text-[rgb(var(--muted))]">{t.drag}</p>
        <p className="text-xs text-[rgb(var(--muted))] mt-1">{t.hint}</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,audio/mpeg,audio/mp3,.pdf,.docx,.zip"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {uploading && <Progress value={progress} className="h-2" />}

      {uploadedUrl && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>{t.uploaded}: {uploadedUrl}</span>
        </div>
      )}

      {!uploading && !uploadedUrl && (
        <Button variant="outline" onClick={() => inputRef.current?.click()}>
          {t.choose}
        </Button>
      )}
    </div>
  )
}
