import { Film } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({
  title = 'Ничего не найдено',
  description = 'Попробуйте изменить параметры поиска',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="text-[rgb(var(--muted))]">
        {icon ?? <Film className="w-12 h-12" />}
      </div>
      <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">{title}</h3>
      <p className="text-sm text-[rgb(var(--muted))]">{description}</p>
    </div>
  )
}
