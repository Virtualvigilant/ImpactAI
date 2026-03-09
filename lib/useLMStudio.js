'use client'
// lib/useLMStudio.js
// Custom hook that manages chat state and streams responses from the API route.

import { useState, useCallback, useRef } from 'react'

export function useLMStudio() {
  const [messages,   setMessages]   = useState([])
  const [isLoading,  setIsLoading]  = useState(false)
  const [isOnline,   setIsOnline]   = useState(true)   // tracks LM Studio connectivity
  const [error,      setError]      = useState(null)
  const abortRef = useRef(null)

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return

    setError(null)

    // Append user message immediately
    const userMsg = { id: Date.now(), role: 'user', content: content.trim() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)

    // Placeholder for the streaming AI response
    const aiMsgId = Date.now() + 1
    setMessages(prev => [
      ...prev,
      { id: aiMsgId, role: 'assistant', content: '', streaming: true },
    ])

    abortRef.current = new AbortController()

    try {
      const response = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || `HTTP ${response.status}`)
      }

      setIsOnline(true)

      // Read the SSE stream
      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      let   accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.trim())

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.content) {
              accumulated += parsed.content
              // Update the streaming message in place
              setMessages(prev =>
                prev.map(m =>
                  m.id === aiMsgId
                    ? { ...m, content: accumulated }
                    : m
                )
              )
            }
          } catch (e) {
            if (e.message !== 'Unexpected end of JSON input') {
              console.warn('SSE parse warn:', e.message)
            }
          }
        }
      }

      // Mark streaming as done
      setMessages(prev =>
        prev.map(m => m.id === aiMsgId ? { ...m, streaming: false } : m)
      )
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled — that's fine
        setMessages(prev => prev.filter(m => m.id !== aiMsgId))
      } else {
        setIsOnline(false)
        setError(err.message)
        // Replace streaming placeholder with error message
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { ...m, content: `⚠️ ${err.message}`, streaming: false, error: true }
              : m
          )
        )
      }
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return {
    messages,
    isLoading,
    isOnline,
    error,
    sendMessage,
    clearChat,
    stopGeneration,
  }
}
