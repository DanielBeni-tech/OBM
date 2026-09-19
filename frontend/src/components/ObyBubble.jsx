import ReactMarkdown from 'react-markdown'
import { Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ObyBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-2.5 px-4 py-2 animate-fade-in', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          isUser ? 'bg-secondary' : 'bg-primary text-primary-foreground glow-orange'
        )}
      >
        {isUser ? <User className="w-4 h-4 text-muted-foreground" /> : <Sparkles className="w-4 h-4" />}
      </div>
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card border border-border rounded-tl-sm'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
