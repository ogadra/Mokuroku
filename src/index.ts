import { Hono } from 'hono'

const app = new Hono()

// サンプルイベントデータ
const events = [
  {
    uid: '13@mokuroku',
    summary: '13-public',
    description: 'サンプルの登壇予定です',
    location: 'オンライン',
    start: new Date('2026-01-11T22:55:00+09:00'),
    end: new Date('2026-01-11T23:00:00+09:00'),
    class: 'PUBLIC',
  },
  {
    uid: '14-private',
    summary: '14-private',
    description: 'サンプルの登壇予定です',
    location: 'オンライン',
    start: new Date('2026-02-15T10:00:00+09:00'),
    end: new Date('2026-02-15T11:00:00+09:00'),
    class: 'PRIVATE',
  },
  {
    uid: '15-confidential',
    summary: '15-confidential',
    description: 'サンプルの登壇予定です',
    location: 'オンライン',
    start: new Date('2026-03-20T14:30:00+09:00'),
    end: new Date('2026-03-20T15:30:00+09:00'),
    class: 'CONFIDENTIAL',
  }
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
    'X-WR-TIMEZONE:Asia/Tokyo',
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
    'X-PUBLISHED-TTL:PT1H',
  ]

  for (const event of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.uid}`,
      `DTSTAMP:${formatDateUTC(new Date())}`,
      `DTSTART:${formatDateUTC(event.start)}`,
      `DTEND:${formatDateUTC(event.end)}`,
      `SUMMARY:${event.summary}`,
      `PRIORITY:5`,
      `CATEGORIES:PRESENTATION,TECHNICAL,YOKOHAMA`,
      `CLASS:${event.class}`,
      `COMMENT:サンプルの登壇予定です${event.uid}`,
      // `DESCRIPTION:${event.description}`,
      // `LOCATION:${event.location}`,
      `URL:https://yokohama-north.connpass.com/event/377972/`,
      `GEO:35.5246519;139.6253365`,
      `DESCRIPTION:イベント詳細ページはこちら: https://yokohama-north.connpass.com/event/377972/`,
      `TRANSP:TRANSPARENT`,
      `END:VEVENT`
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
