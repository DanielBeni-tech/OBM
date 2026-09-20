import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LogOut, Store, Bell, Globe, HelpCircle, ChevronRight, Receipt, Users, Wallet } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { authApi, statsApi } from '@/lib/api'
import { formatFCFA, initials } from '@/lib/format'

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const queryClient = useQueryClient()
  const [editingActivity, setEditingActivity] = useState(false)
  const [activityName, setActivityName] = useState(user?.activity_name || '')

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.get,
  })

  const handleSaveActivity = async () => {
    await authApi.updateMe({ activity_name: activityName })
    updateUser({ activity_name: activityName })
    setEditingActivity(false)
  }

  const settingsItems = [
    { icon: Globe, label: 'Langue', value: 'Français' },
    { icon: Bell, label: 'Notifications', value: 'Activées' },
    { icon: HelpCircle, label: 'Aide & support', value: '' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Profil" />
      <div className="px-4 py-4 space-y-4">
        {/* User card */}
        <div className="bg-card rounded-lg p-4 border border-border flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg glow-orange">
            {initials(user?.full_name || user?.email || 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{user?.full_name || 'Utilisateur'}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        {/* Activity name */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Nom de l'activité</span>
          </div>
          {editingActivity ? (
            <div className="flex gap-2">
              <Input value={activityName} onChange={(e) => setActivityName(e.target.value)} autoFocus />
              <Button size="sm" variant="primary" onClick={handleSaveActivity}>OK</Button>
            </div>
          ) : (
            <button
              onClick={() => setEditingActivity(true)}
              className="flex items-center justify-between w-full"
            >
              <span className="text-sm text-muted-foreground">{user?.activity_name || 'Mon Activité'}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-lg p-3 border border-border text-center">
            <Receipt className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="font-bold">{stats?.total_sales || 0}</p>
            <p className="text-xs text-muted-foreground">Ventes</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border text-center">
            <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="font-bold">{stats?.total_clients || 0}</p>
            <p className="text-xs text-muted-foreground">Clients</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border text-center">
            <Wallet className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="font-bold text-xs">{formatFCFA(stats?.total_revenue || 0)}</p>
            <p className="text-xs text-muted-foreground">Revenu</p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {settingsItems.map((item, i) => (
            <button
              key={i}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-0"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              {item.value && <span className="text-sm text-muted-foreground">{item.value}</span>}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <Button variant="destructive" className="w-full" onClick={logout}>
          <LogOut className="w-4 h-4" /> Déconnexion
        </Button>
      </div>
    </div>
  )
}
