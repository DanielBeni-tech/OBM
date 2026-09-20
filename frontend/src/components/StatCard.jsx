import { cn } from '@/lib/utils'

export default function StatCard({ icon: Icon, label, value, suffix, trend, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className="font-bold text-lg leading-tight">
            {value}
            {suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
          </p>
          {trend && <p className="text-xs text-green-600 font-medium">{trend}</p>}
        </div>
      </div>
    </div>
  )
}
