# ImpactAI
> Built with Next.js 14 + LM Studio (DeepSeek) · Impact360 Africa

---

## What this is

A full chat UI that connects to your locally-running DeepSeek model via LM Studio.
No cloud, no API keys, no internet required after setup.

---

## Prerequisites

- Node.js 18+
- LM Studio installed and running with your DeepSeek model loaded
- The LM Studio local server started on port 1234

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```
Then open `.env.local` and set `MODEL_NAME` to match the **exact** model string shown
in LM Studio's "Local Server" tab (e.g. `deepseek-r1-distill-qwen-7b`).

### 3. Start LM Studio server
- Open LM Studio
- Load your DeepSeek model
- Go to **Local Server** tab → click **Start Server**
- Confirm it shows "Running on port 1234"

### 4. Run the app
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project structure

```
impact-ai/
├── app/
│   ├── layout.jsx          # Root layout (fonts, metadata)
│   ├── page.jsx            # Main chat UI
│   ├── globals.css         # Brand styles + Tailwind
│   └── api/
│       └── chat/
│           └── route.js    # Streaming API → LM Studio
├── components/
│   ├── MessageBubble.jsx   # Individual chat messages
│   └── Sidebar.jsx         # Topic shortcuts + model info
├── lib/
│   └── useLMStudio.js      # Chat state + streaming hook
├── .env.local.example
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## Customising the system prompt

Edit the `SYSTEM_PROMPT` constant in `app/api/chat/route.js` to change ImpactAI's
personality, focus areas, or language behaviour.

---

## Changing the model

1. Load a different model in LM Studio
2. Update `MODEL_NAME` in `.env.local`
3. Restart the Next.js dev server

---

## Brand

Built to Impact360 Africa brand guidelines:
- **Colors:** `#306CEC` (Vivid Blue), `#FFFEF9` (Off-white), `#000000` (Black)
- **Fonts:** League Spartan (headings), DM Sans (body)

---

*Together for change — Impact360 Africa*
