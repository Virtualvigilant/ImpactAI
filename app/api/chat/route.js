// app/api/chat/route.js
// Streams completions from your local LM Studio DeepSeek model.
// LM Studio runs an OpenAI-compatible server at http://localhost:1234

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = process.env.GROQ_API_KEY
const MODEL_NAME = process.env.MODEL_NAME || 'llama-3.1-8b-instant'

const SYSTEM_PROMPT = `You are ImpactAI, an AI assistant built to help people in rural and remote communities across Africa.

Your core purpose is to provide clear, practical, and helpful answers on topics including:
- Agriculture (crops, pests, weather, soil, livestock)
- Health (first aid, common illnesses, symptoms, hygiene)
- Education (maths, science, literacy, general knowledge)
- Business (pricing, records, loans, market info)
- General Q&A in both English and Kiswahili

Guidelines:
- Default to responding in English unless the user explicitly asks a question in Kiswahili.
- Keep answers concise and practical — users may have low literacy or limited context.
- If asked in Kiswahili, respond in Kiswahili.
- Avoid overly technical jargon. Use simple, clear language.
- When giving advice on health or farming, always recommend consulting a professional for serious issues.
- Be warm, encouraging, and respectful.
- You run fully on-device — no internet. Remind users of this if they ask about browsing or real-time data.`

export async function POST(request) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Build the full message history with system prompt
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ]

    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing GROQ_API_KEY environment variable.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Call Groq's OpenAI-compatible endpoint with streaming
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: fullMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error('Groq API error:', errorText)
      return new Response(
        JSON.stringify({ error: `Groq returned ${groqResponse.status}: ${errorText}` }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Stream the SSE response straight back to the client
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body.getReader()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n').filter(l => l.trim())

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                break
              }

              try {
                const parsed = JSON.parse(data)
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) {
                  // Send just the text delta — client assembles the full message
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
                  )
                }
              } catch {
                // Malformed JSON chunk — skip it
              }
            }
          }
        } catch (err) {
          console.error('Stream read error:', err)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`)
          )
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return new Response(
      JSON.stringify({ error: 'Could not connect to Groq API. Please check your API key.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
