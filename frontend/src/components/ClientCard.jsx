import { Phone, MessageCircle } from 'lucide-react'
import { formatFCFA, initials, avatarColor } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function ClientCard({ client, onClick }) {
  const hasDebt = client.amount_due > 0

  const handleWhatsApp = (e, phone) => {
    e.stopPropagation()
    const msg = encodeURIComponent(`Bonjour ${client.name}, c'est un rappel amical pour le montant de ${formatFCFA(client.amount_due)} que vous me devez. Merci de régler quand vous pouvez ! 🙏`)
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank')
  }

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-lg p-3 border border-border flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98]"
    >
      <div className={cn('w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0', avatarColor(client.name))}>
        {initials(client.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{client.name}</p>
        {client.phone && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Phone className="w-3 h-3" /> {client.phone}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        {hasDebt ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-orange-600">{formatFCFA(client.amount_due)}</span>
            {client.phone && (
              <button
                onClick={(e) => handleWhatsApp(e, client.phone)}
                className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <span className="text-xs text-green-600 font-medium">✓ Réglé</span>
        )}
      </div>
    </div>
  )
}
