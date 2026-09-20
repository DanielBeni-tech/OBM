import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function QuickAction({ to, icon: Icon, label, variant = 'default' }) {
  const isPrimary = variant === 'primary'
  return (
    <Link
      to={to}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg p-3 transition-all active:scale-95',
        isPrimary ? 'bg-primary text-primary-foreground glow-orange' : 'bg-card border border-border'
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium text-center leading-tight">{label}</span>
    </Link>
  )
}
