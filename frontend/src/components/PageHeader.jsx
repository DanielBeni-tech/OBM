import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PageHeader({ title, subtitle, showBack, action }) {
  const navigate = useNavigate()
  return (
    <div className="sticky top-0 z-30 glass-card border-b border-border px-4 pt-safe">
      <div className="flex items-center gap-3 h-14">
        {showBack && (
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-secondary">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-lg leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  )
}
