import { Hono } from 'hono'

const app = new Hono()

// サンプルイベントデータ
const events = [
  {
    uid: '1@mokuroku',
    summary: 'サンプル登壇',
    description: 'サンプルの登壇予定です',
    location: 'オンライン',
    start: new Date('2026-02-01T14:00:00+09:00'),
    end: new Date('2026-02-01T15:00:00+09:00'),
  },
]

function formatDateUTC(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

function generateICS(): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mokuroku//Speaking Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:ogadra 登壇予定',
  ]

  for (const event of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.uid}`,
      `DTSTAMP:${formatDateUTC(new Date())}`,
      `DTSTART:${formatDateUTC(event.start)}`,
      `DTEND:${formatDateUTC(event.end)}`,
      `SUMMARY:${event.summary}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT'
    )
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

app.get('/', (c) => {
  return c.text('Hello Mokuroku!')
})

app.get('/ics', (c) => {
  const ics = generateICS()
  return new Response(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
})

export default app
