'use client'
// components/MessageBubble.jsx

export function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const isEmpty = !message.content && message.streaming

  return (
    <div className={`flex flex-col gap-1 animate-slide-up ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Sender label */}
      <span className="font-spartan font-bold text-[8px] text-white tracking-widest leading-none mt-0.5">
        {isUser ? 'YOU' : 'IMPACT'}
      </span>

      {/* Bubble */}
      {isUser ? (
        <div className="bubble-user">
          {message.content}
        </div>
      ) : (
        <div className={`bubble-ai ${message.error ? 'border-red-500/30 bg-red-500/5' : ''}`}>
          {isEmpty ? (
            // Typing indicator
            <div className="flex items-center gap-1.5 py-0.5">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          ) : (
            <div
              className="ai-content"
              dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
            />
          )}
          {/* Streaming cursor */}
          {message.streaming && message.content && (
            <span className="inline-block w-0.5 h-3.5 bg-brand-blue ml-0.5 animate-pulse align-middle" />
          )}
        </div>
      )}

      {/* Timestamp */}
      <span className="text-[8px] text-[var(--muted)] px-1 font-sans">
        {formatTime()}
      </span>
    </div>
  )
}

// Basic markdown → HTML (no external lib needed)
function formatContent(text) {
  if (!text) return ''
  return text
    // code blocks
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // bullet points
    .replace(/^[\-\*] (.+)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // numbered list
    .replace(/^\d+\. (.+)/gm, '<li>$1</li>')
    // line breaks → paragraphs
    .split('\n\n')
    .map(p => p.trim() ? `<p>${p.replace(/\n/g, '<br>')}</p>` : '')
    .join('')
}

function formatTime() {
  return new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}
