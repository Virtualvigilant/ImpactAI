import fs from 'fs'
import path from 'path'
import os from 'os'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const filePath = path.join(
            os.homedir(),
            '.gemini',
            'antigravity',
            'brain',
            '800bd2aa-c5b5-4cd0-92fa-0ad6b58f1d12',
            'media__1773082277943.png'
        )
        const image = fs.readFileSync(filePath)
        return new Response(image, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        })
    } catch (err) {
        return new Response('Image not found', { status: 404 })
    }
}
