import { NavLink } from 'react-router-dom'
import { Home, PlusCircle, Users, Receipt, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { to: '/', icon: Home, label: 'Accueil', end: true },
  { to: '/encaisser', icon: PlusCircle, label: 'Encaisser' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/ventes', icon: Receipt, label: 'Ventes' },
  { to: '/assistant', icon: Sparkles, label: 'Oby' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card border-t border-border px-2 pb-safe">
          <div className="flex items-center justify-around h-16">
            {items.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[56px]',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('w-5 h-5', isActive && 'fill-primary/10')} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
