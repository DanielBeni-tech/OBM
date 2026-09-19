import { useState, useEffect } from 'react'
import { Trash2, MessageCircle, Save } from 'lucide-react'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { formatFCFA } from '@/lib/format'

export default function ClientDetail({ client, open, onClose, onSave, onDelete }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [amountDue, setAmountDue] = useState(0)

  useEffect(() => {
    if (client) {
      setName(client.name || '')
      setPhone(client.phone || '')
      setAmountDue(client.amount_due || 0)
    }
  }, [client])

  const handleSave = () => {
    onSave({ name, phone, amount_due: Number(amountDue) || 0 })
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Bonjour ${client.name}, c'est un rappel amical pour le montant de ${formatFCFA(client.amount_due)} que vous me devez. Merci de régler quand vous pouvez ! 🙏`)
    window.open(`https://wa.me/${(client.phone || '').replace(/[^0-9]/g, '')}?text=${msg}`, '_blank')
  }

  return (
    <Dialog open={open} onClose={onClose} title="Détails du client">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Nom</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du client" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Téléphone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 6XX XXX XXX" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Montant dû (FCFA)</label>
          <Input
            type="number"
            value={amountDue}
            onChange={(e) => setAmountDue(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="primary" className="flex-1" onClick={handleSave}>
            <Save className="w-4 h-4" /> Sauvegarder
          </Button>
          {client?.phone && Number(client.amount_due) > 0 && (
            <Button variant="outline" onClick={handleWhatsApp}>
              <MessageCircle className="w-4 h-4 text-green-600" />
            </Button>
          )}
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
