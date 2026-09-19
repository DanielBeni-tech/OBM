import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Receipt, Trash2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import SaleItem from '@/components/SaleItem'
import EmptyState from '@/components/EmptyState'
import { salesApi } from '@/lib/api'
import { formatFCFA } from '@/lib/format'
import { cn } from '@/lib/utils'

const periods = [
  { value: 'today', label: "Aujourd'hui" },
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'all', label: 'Tout' },
]

export default function Sales() {
  const [period, setPeriod] = useState('today')
  const queryClient = useQueryClient()

  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales', period],
    queryFn: () => salesApi.list(period),
  })

  const total = sales?.reduce((sum, s) => sum + Number(s.amount), 0) || 0

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette vente ?')) return
    await salesApi.delete(id)
    queryClient.invalidateQueries({ queryKey: ['sales'] })
    queryClient.invalidateQueries({ queryKey: ['stats'] })
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Ventes" subtitle="Historique de tes ventes" />
      <div className="px-4 py-4 space-y-4">
        {/* Period filters */}
        <div className="flex gap-2 overflow-x-auto">
          {periods.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                period === value ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Total */}
        <div className="bg-card rounded-lg p-4 border border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total cumulé</span>
          <span className="font-bold text-lg text-primary">{formatFCFA(total)}</span>
        </div>

        {/* Sales list */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-secondary animate-pulse" />
            ))}
          </div>
        ) : sales?.length ? (
          <div className="space-y-2">
            {sales.map((sale) => (
              <div key={sale.id} className="group relative">
                <SaleItem sale={sale} />
                <button
                  onClick={() => handleDelete(sale.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Receipt}
            title="Aucune vente"
            description="Les ventes que tu encaisses apparaîtront ici."
          />
        )}
      </div>
    </div>
  )
}
