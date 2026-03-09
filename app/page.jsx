'use client'

import { useState, useRef, useEffect } from 'react'
import { useLMStudio } from '@/lib/useLMStudio'
import { MessageBubble } from '@/components/MessageBubble'
import { Sidebar } from '@/components/Sidebar'

export default function Home() {
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const {
    messages,
    isLoading,
    isOnline,
    error,
    sendMessage,
    clearChat,
    stopGeneration,
  } = useLMStudio()

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const msg = input
    setInput('')
    await sendMessage(msg)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTopicSelect = (text) => {
    setInput(text)
    inputRef.current?.focus()
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">

      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <Sidebar
          onTopicSelect={handleTopicSelect}
          onClear={clearChat}
          messageCount={messages.length}
        />
      )}

      {/* ── Main chat area ── */}
      <main className="flex flex-col flex-1 min-w-0 h-full">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4
                            border-b border-[var(--border)] bg-black flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-1.5
                         rounded-lg hover:bg-[var(--blue-dim)] transition-colors"
              aria-label="Toggle sidebar"
            >
              <span className="w-4 h-0.5 bg-[var(--muted)]" />
              <span className="w-4 h-0.5 bg-[var(--muted)]" />
              <span className="w-4 h-0.5 bg-[var(--muted)]" />
            </button>

            {/* Title */}
            <div>
              <h1 className="font-spartan font-bold text-sm text-brand-off-white
                              tracking-widest uppercase leading-none">
                IMPACT AI
              </h1>
              <p className="text-[10px] text-[var(--muted)] font-light mt-0.5">
                Offline Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection status */}
            <div className={`status-chip ${isOnline ? '' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-brand-blue animate-pulse' : 'bg-red-400'}`} />
              {isOnline ? 'ON-DEVICE' : 'DISCONNECTED'}
            </div>

            {/* Stop button (only while streaming) */}
            {isLoading && (
              <button
                onClick={stopGeneration}
                className="text-[10px] font-spartan font-bold tracking-widest uppercase
                           text-[var(--muted)] hover:text-brand-off-white
                           px-3 py-1.5 rounded-lg border border-[var(--border)]
                           hover:border-brand-blue/40 hover:bg-[var(--blue-dim)]
                           transition-all duration-150"
              >
                Stop
              </button>
            )}
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto chat-scroll px-6 py-6 space-y-5">

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center
                             animate-fade-in select-none pointer-events-none">

              {/* Decorative star */}
              <div className="mb-8 relative">
                <img src="/api/logo.png" alt="ImpactAI Logo" className="w-24 h-24 rounded-3xl shadow-xl shadow-brand-blue/10 border border-[var(--border)] object-cover bg-black" />
                {/* Sparkle stars */}
                <div className="absolute -top-2 -right-2">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path d="M7 0L8 6L14 7L8 8L7 14L6 8L0 7L6 6Z" fill="#FFFEF9" opacity="0.6" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -left-3">
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3Z" fill="#306CEC" opacity="0.7" />
                  </svg>
                </div>
              </div>

              <h2 className="font-spartan font-black text-3xl text-brand-off-white
                              uppercase tracking-tight leading-none mb-3">
                AI THAT WORKS<br />
                <span className="text-brand-blue">WHERE YOU ARE.</span>
              </h2>
              <p className="text-sm text-[var(--soft)] font-light max-w-xs leading-relaxed mb-1">
                Ask me anything about farming, health, education, or business.
              </p>
              <p className="text-[11px] text-[var(--muted)] font-light">
                Runs 100% on your device — no internet needed.
              </p>
            </div>
          )}

          {/* Message list */}
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/25
                             rounded-xl px-4 py-3 text-sm animate-fade-in">
              <span className="text-red-400 flex-shrink-0">⚠️</span>
              <div>
                <p className="font-spartan font-bold text-[10px] uppercase tracking-widest text-red-400 mb-0.5">
                  Connection Error
                </p>
                <p className="text-[var(--muted)] text-xs font-light">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="px-6 pb-6 pt-3 flex-shrink-0 border-t border-[var(--border)] bg-black">

          {/* Stats bar */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="font-spartan font-bold text-[9px] tracking-widest uppercase text-brand-blue">
                {messages.filter(m => m.role === 'user').length}
              </span>
              <span className="text-[9px] text-[var(--muted)] font-light">messages sent</span>
            </div>
            <div className="w-px h-3 bg-[var(--border)]" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
              <span className="text-[9px] text-[var(--muted)] font-light">DeepSeek — localhost:1234</span>
            </div>
            <div className="w-px h-3 bg-[var(--border)]" />
            <span className="text-[9px] text-[var(--muted)] font-light">0 KB/s data used</span>
          </div>

          {/* Input row */}
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="chat-input min-h-[48px] max-h-40"
              style={{ height: 'auto' }}
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = `${e.target.scrollHeight}px`
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center
                         flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-blue-500 active:scale-95 transition-all duration-150 glow-blue-sm"
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                    stroke="white" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

          <p className="text-[9px] text-[var(--muted)] font-light mt-2 text-center">
            ImpactAI runs locally on your machine — your conversations never leave your device.
          </p>
        </div>
      </main>
    </div>
  )
}
