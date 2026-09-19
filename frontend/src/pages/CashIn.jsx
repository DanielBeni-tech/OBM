import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import confetti from 'canvas-confetti'
import { Check, Banknote, Smartphone, CircleDollarSign, CreditCard } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { salesApi, clientsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

const methods = [
  { value: 'cash', label: 'Espèces', icon: Banknote },
  { value: 'orange_money', label: 'Orange Money', icon: Smartphone },
  { value: 'mtn_money', label: 'MTN Money', icon: CircleDollarSign },
  { value: 'other', label: 'Autre', icon: CreditCard },
]

export default function CashIn() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('cash')
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list(),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim() || !amount) return
    setLoading(true)
    try {
      const selectedClient = clients?.find((c) => c.id === clientId)
      await salesApi.create({
        description: description.trim(),
        amount: Number(amount),
        payment_method: method,
        client_id: clientId || null,
        client_name: selectedClient?.name || '',
      })
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF7900', '#FFB347', '#FFD700', '#FFA500'],
      })
      setSuccess(true)
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      setTimeout(() => {
        navigate('/')
      }, 1800)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4 animate-check-bounce">
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-xl font-bold">Vente encaissée !</h2>
        <p className="text-muted-foreground text-sm mt-1">{Number(amount).toLocaleString('fr-FR')} FCFA</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Encaisser" subtitle="Enregistre une vente en quelques secondes" />
      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Description *</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Plat de poulet, Boisson, etc."
            autoFocus
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Montant (FCFA) *</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Méthode de paiement</label>
          <div className="grid grid-cols-4 gap-2">
            {methods.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMethod(value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-all',
                  method === value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Client (optionnel)</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-border bg-card px-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sans client</option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading || !description.trim() || !amount}>
          {loading ? 'Enregistrement...' : 'Encaisser'}
        </Button>
      </form>
    </div>
  )
}
