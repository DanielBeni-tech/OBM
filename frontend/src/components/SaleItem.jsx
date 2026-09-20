import { Banknote, Smartphone, CircleDollarSign, CreditCard } from 'lucide-react'
import { formatFCFA, formatDateTime } from '@/lib/format'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const methodConfig = {
  cash: { label: 'Espèces', icon: Banknote, variant: 'success' },
  orange_money: { label: 'Orange Money', icon: Smartphone, variant: 'primary' },
  mtn_money: { label: 'MTN Money', icon: CircleDollarSign, variant: 'warning' },
  other: { label: 'Autre', icon: CreditCard, variant: 'default' },
}

export default function SaleItem({ sale }) {
  const config = methodConfig[sale.payment_method] || methodConfig.cash
  const Icon = config.icon

  return (
    <div className="bg-card rounded-lg p-3 border border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{sale.description}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(sale.sale_date)}</p>
          {sale.client_name && (
            <p className="text-xs text-muted-foreground mt-0.5">Client: {sale.client_name}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-primary">{formatFCFA(sale.amount)}</p>
          <Badge variant={config.variant} className="mt-1">
            <Icon className="w-3 h-3" />
            {config.label}
          </Badge>
        </div>
      </div>
    </div>
  )
}
