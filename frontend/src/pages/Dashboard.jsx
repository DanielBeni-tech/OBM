import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, Wallet, PlusCircle, UserPlus, Sparkles, Receipt } from 'lucide-react'
import { statsApi } from '@/lib/api'
import { formatFCFA, formatNumber } from '@/lib/format'
import StatCard from '@/components/StatCard'
import QuickAction from '@/components/QuickAction'
import SaleItem from '@/components/SaleItem'
import EmptyState from '@/components/EmptyState'

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.get,
  })

  return (
    <div className="animate-fade-in">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">Bonjour 👋</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Voici le résumé de ton activité</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={TrendingUp}
            label="Ventes du jour"
            value={isLoading ? '—' : stats?.today_sales_count || 0}
            color="primary"
          />
          <StatCard
            icon={Wallet}
            label="Revenu du jour"
            value={isLoading ? '—' : formatNumber(stats?.today_sales_total || 0)}
            suffix="FCFA"
            color="green"
          />
          <StatCard
            icon={Users}
            label="Total clients"
            value={isLoading ? '—' : stats?.total_clients || 0}
            color="blue"
          />
          <StatCard
            icon={Receipt}
            label="Revenu cumulé"
            value={isLoading ? '—' : formatNumber(stats?.total_revenue || 0)}
            suffix="FCFA"
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold text-sm mb-2 px-1">Actions rapides</h2>
          <div className="grid grid-cols-3 gap-3">
            <QuickAction to="/encaisser" icon={PlusCircle} label="Encaisser" variant="primary" />
            <QuickAction to="/clients" icon={UserPlus} label="Ajouter client" />
            <QuickAction to="/assistant" icon={Sparkles} label="Parler à Oby" />
          </div>
        </div>

        {/* Recent Sales */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="font-semibold text-sm">Ventes récentes</h2>
            <Link to="/ventes" className="text-xs text-primary font-medium">
              Tout voir
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-secondary animate-pulse" />
              ))}
            </div>
          ) : stats?.recent_sales?.length ? (
            <div className="space-y-2">
              {stats.recent_sales.map((sale) => (
                <SaleItem key={sale.id} sale={sale} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="Aucune vente pour le moment"
              description="Encaisse ta première vente pour démarrer !"
            />
          )}
        </div>
      </div>
    </div>
  )
}
