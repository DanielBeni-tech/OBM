import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-secondary text-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-orange-100 text-orange-700',
  destructive: 'bg-red-100 text-red-700',
  outline: 'border border-border text-foreground',
}

export default function Badge({ variant = 'default', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
