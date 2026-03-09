'use client'
// components/Sidebar.jsx
import logoImage from '@/logo4.png'

const TOPICS = [
  { emoji: '🌾', label: 'Agriculture', sub: 'Crops, pests, weather' },
  { emoji: '🏥', label: 'Health', sub: 'First aid, symptoms' },
  { emoji: '📚', label: 'Education', sub: 'Maths, science, literacy' },
  { emoji: '💼', label: 'Business', sub: 'Finance, pricing, records' },
  { emoji: '🌍', label: 'General', sub: 'Ask anything' },
]

const STARTERS = [
  'How do I treat maize affected by fall armyworm?',
  'What are symptoms of malaria?',
  'How do I calculate profit margin?',
  'Explain photosynthesis simply',
  'Jinsi ya kuhifadhi mboga?',
]

export function Sidebar({ onTopicSelect, onClear, messageCount, onClose }) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fade-in"
        onClick={onClose}
      />
      <aside className="fixed md:relative z-50 w-[80vw] max-w-sm md:w-64 flex-shrink-0 flex flex-col bg-brand-dark border-r border-[var(--border)] h-full overflow-y-auto animate-slide-right md:animate-none">

        {/* Brand header */}
        <div className="p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-1">
            {/* ImpactAI logo mark */}
            <div className="w-9 h-9 rounded-[10px] overflow-hidden flex-shrink-0">
              <img src={logoImage.src} alt="ImpactAI Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-spartan font-bold text-sm text-brand-off-white tracking-widest uppercase leading-none">
                IMPACT AI
              </p>
              <p className="text-[10px] text-[var(--muted)] font-light mt-0.5">Offline AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Model status */}
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="sec-label">Model Status</span>
          </div>
          <div className="bg-[var(--blue-dim)] border border-[var(--border)] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
              <span className="font-spartan font-bold text-[10px] text-brand-blue tracking-wider uppercase">
                Running Locally
              </span>
            </div>
            <p className="text-[10px] text-[var(--muted)] font-light">DeepSeek via LM Studio</p>
            <p className="text-[10px] text-[var(--muted)] font-light">localhost:1234</p>
          </div>
        </div>

        {/* Topic shortcuts */}
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <span className="sec-label block mb-2">Browse Topics</span>
          <div className="flex flex-col gap-1.5">
            {TOPICS.map(t => (
              <button
                key={t.label}
                onClick={() => {
                  onTopicSelect(`Tell me about ${t.label.toLowerCase()}`)
                  if (onClose) onClose()
                }}
                className="flex items-center gap-2.5 bg-black/30 hover:bg-[var(--blue-dim)]
                         border border-transparent hover:border-[var(--border)]
                         rounded-lg px-3 py-2 text-left transition-all duration-150 group"
              >
                <span className="text-sm flex-shrink-0">{t.emoji}</span>
                <div className="min-w-0">
                  <p className="font-spartan font-bold text-[10px] text-brand-off-white
                               uppercase tracking-wider leading-none truncate
                               group-hover:text-brand-blue transition-colors">
                    {t.label}
                  </p>
                  <p className="text-[9px] text-[var(--muted)] font-light mt-0.5 truncate">{t.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Starter questions */}
        <div className="px-4 py-3 flex-1">
          <span className="sec-label block mb-2">Try asking</span>
          <div className="flex flex-col gap-1.5">
            {STARTERS.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  onTopicSelect(q)
                  if (onClose) onClose()
                }}
                className="text-left text-[10px] text-[var(--muted)] hover:text-brand-blue
                         font-light leading-snug py-1.5 px-2 rounded-lg
                         hover:bg-[var(--blue-dim)] transition-all duration-150
                         border border-transparent hover:border-[var(--border)]"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Clear chat */}
        {messageCount > 0 && (
          <div className="p-4 border-t border-[var(--border)]">
            <button
              onClick={onClear}
              className="w-full text-[10px] text-[var(--muted)] hover:text-brand-off-white
                       font-spartan font-bold tracking-widest uppercase
                       py-2 px-4 rounded-lg border border-[var(--border)]
                       hover:border-brand-blue/50 hover:bg-[var(--blue-dim)]
                       transition-all duration-150"
            >
              Clear Chat
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border)]">
          <p className="text-[9px] text-[var(--muted)] font-light text-center leading-snug">
            Powered by Impact360 Africa<br />
            <span className="text-brand-blue/60">Together for change</span>
          </p>
        </div>
      </aside>
    </>
  )
}
