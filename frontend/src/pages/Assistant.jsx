import { useState, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Sparkles, Trash2 } from 'lucide-react'
import Input from '@/components/ui/Input'
import ObyBubble from '@/components/ObyBubble'
import { chatApi } from '@/lib/api'

const suggestions = [
  "Bonjour Oby ! 👋",
  "J'ai vendu 5000 FCFA de brochettes",
  "Ajoute un client nommé Jean",
  "Combien de ventes aujourd'hui ?",
  "Qui doit de l'argent ?",
]

export default function Assistant() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const initialized = useRef(false)
  const scrollRef = useRef(null)

  const { data: messages, isLoading } = useQuery({
    queryKey: ['chat'],
    queryFn: chatApi.list,
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, sending])

  const handleSend = async (text) => {
    const content = text ?? input
    if (!content.trim() || sending) return
    setInput('')
    setSending(true)
    try {
      await chatApi.send(content.trim())
      queryClient.invalidateQueries({ queryKey: ['chat'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    } catch (err) {
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleClear = async () => {
    if (!confirm('Effacer la conversation ?')) return
    await chatApi.clear()
    queryClient.invalidateQueries({ queryKey: ['chat'] })
  }

  const isEmpty = !isLoading && messages?.length === 0

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-border glass-card pt-safe shrink-0">
        <button onClick={() => navigate('/')} className="p-1.5 -ml-1.5 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center glow-orange">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold leading-tight">Oby</p>
          <p className="text-xs text-green-600">● En ligne</p>
        </div>
        <button onClick={handleClear} className="p-2 rounded-lg hover:bg-secondary">
          <Trash2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-bold text-lg mb-1">Salut, je suis Oby ! 👋</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Ton assistante Orange Mboa Business. Je peux t'aider à enregistrer des ventes, gérer tes clients et suivre tes stats.
            </p>
            <div className="space-y-2 w-full max-w-sm">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="w-full text-left px-4 py-2.5 rounded-lg bg-card border border-border text-sm hover:border-primary/30 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages?.map((msg) => (
              <ObyBubble key={msg.id} message={msg} />
            ))}
            {sending && (
              <div className="flex gap-2.5 px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center glow-orange shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-dot-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-dot-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-dot-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border glass-card px-4 py-3 pb-safe">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écris ton message..."
            disabled={sending}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-lg bg-primary text-primary-foreground flex items-center justify-center glow-orange disabled:opacity-50 active:scale-95 transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
