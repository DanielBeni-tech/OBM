import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AddClientSheet({ open, onClose, onAdd }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [amountDue, setAmountDue] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), phone: phone.trim(), amount_due: Number(amountDue) || 0 })
    setName('')
    setPhone('')
    setAmountDue('')
  }

  return (
    <Dialog open={open} onClose={onClose} title="Nouveau client">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Nom *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du client" autoFocus />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Téléphone (optionnel)</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 6XX XXX XXX" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Dette initiale (optionnel)</label>
          <Input
            type="number"
            value={amountDue}
            onChange={(e) => setAmountDue(e.target.value)}
            placeholder="0 FCFA"
          />
        </div>
        <Button variant="primary" className="w-full" onClick={handleSubmit} disabled={!name.trim()}>
          Ajouter le client
        </Button>
      </div>
    </Dialog>
  )
}
