'use client'
import { useRef, useState, useEffect } from 'react'
import { Upload, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface FileUploadProps {
  onUpload?: (url: string) => void
}

export function FileUpload({ onUpload }: FileUploadProps) {
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
        toast.error(err.error || 'Ошибка загрузки')
        return
      }

      const data = await res.json()
      setProgress(100)
      setUploadedUrl(data.url)
      onUpload?.(data.url)
      toast.success(`Файл "${data.name}" загружен`)
    } catch {
      toast.error('Ошибка сети при загрузке')
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
        <p className="text-sm text-[rgb(var(--muted))]">
          Нажмите или перетащите файл
        </p>
        <p className="text-xs text-[rgb(var(--muted))] mt-1">
          JPEG, PNG, MP4, MP3, PDF, DOCX, ZIP — макс. 50MB
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,audio/mp3,.pdf,.docx,.zip"
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
          <span>Загружено: {uploadedUrl}</span>
        </div>
      )}

      {!uploading && !uploadedUrl && (
        <Button variant="outline" onClick={() => inputRef.current?.click()}>
          Выбрать файл
        </Button>
      )}
    </div>
  )
}
