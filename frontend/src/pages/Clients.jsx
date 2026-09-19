import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Plus, Users } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ClientCard from '@/components/ClientCard'
import ClientDetail from '@/components/ClientDetail'
import AddClientSheet from '@/components/AddClientSheet'
import EmptyState from '@/components/EmptyState'
import { clientsApi } from '@/lib/api'

export default function Clients() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)
  const queryClient = useQueryClient()

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', search],
    queryFn: () => clientsApi.list(search),
  })

  const handleAdd = async (data) => {
    await clientsApi.create(data)
    setShowAdd(false)
    queryClient.invalidateQueries({ queryKey: ['clients'] })
    queryClient.invalidateQueries({ queryKey: ['stats'] })
  }

  const handleSave = async (data) => {
    await clientsApi.update(selected.id, data)
    setSelected(null)
    queryClient.invalidateQueries({ queryKey: ['clients'] })
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer ce client ?')) return
    await clientsApi.delete(selected.id)
    setSelected(null)
    queryClient.invalidateQueries({ queryKey: ['clients'] })
    queryClient.invalidateQueries({ queryKey: ['stats'] })
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Clients"
        subtitle={`${clients?.length || 0} client(s)`}
        action={
          <Button size="icon" variant="primary" onClick={() => setShowAdd(true)}>
            <Plus className="w-5 h-5" />
          </Button>
        }
      />
      <div className="px-4 py-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-secondary animate-pulse" />
            ))}
          </div>
        ) : clients?.length ? (
          <div className="space-y-2">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} onClick={() => setSelected(client)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Aucun client"
            description="Ajoute ton premier client pour suivre les dettes et envoyer des rappels."
          />
        )}
      </div>

      <AddClientSheet open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      <ClientDetail
        client={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
