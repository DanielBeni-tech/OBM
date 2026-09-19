import ReactMarkdown from 'react-markdown'
import { Sparkles } from 'lucide-react'

export default function ChatBubble({ message }) {
  return (
    <div className="flex gap-2.5 px-4 py-2 animate-fade-in">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary text-primary-foreground glow-orange">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="max-w-[78%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed bg-card border border-border">
        <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
