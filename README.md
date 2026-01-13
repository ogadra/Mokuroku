# Mokuroku (目録)

おがどらの登壇予定を確認できるサイトのソースコードです。

## Tech Stack

- Runtime: Cloudflare Workers
- Framework: Hono
- Database: Cloudflare D1 (SQLite)
- ORM: Drizzle ORM

## Development

Nix flakes + direnv

## Project Structure

```
src/
├── index.ts                 # エントリーポイント
├── middleware/
│   ├── auth.ts              # Bearer Token認証
│   └── connectDb.ts         # D1データベース接続
├── queries/
│   └── event.ts             # イベントCRUDクエリ
├── repository/
│   ├── enums/               # 定数定義（attendeeType, eventClass, eventStatus）
│   ├── migrations/          # Drizzleマイグレーション
│   ├── schema.ts            # DBスキーマ定義
│   └── types/               # DB型定義
├── routes/
│   ├── event.ts             # /event エンドポイント
│   ├── ics.ts               # /schedule.ics エンドポイント
│   └── rss.ts               # /feed.xml エンドポイント
├── schemas/
│   └── event.ts             # リクエストバリデーション（Valibot）
├── types/
│   └── env.ts               # 環境変数型定義
└── utils/
    ├── eventPrefix.ts       # イベントタイトルのプレフィックス生成
    ├── hash.ts              # SHA-256ハッシュ
    ├── ics.ts               # iCalendar生成
    └── rss.ts               # RSS生成
```

## API

### GET /schedule.ics

iCalendar形式でイベント一覧を取得します。

#### Query Parameters

| パラメータ | 説明 | 値 |
|-----------|------|-----|
| `role` | 参加種別でフィルタ | `speaker`, `attendee` |
| `status` | ステータスでフィルタ | `confirmed`, `tentative`, `cancelled` |

#### 備考

- SUMMARYにはステータスのプレフィックス（`[確定]`, `[仮]`, `[中止]`）が常に付与されます
- `role` を指定しない場合、SUMMARYに参加種別のプレフィックス（`[登壇]`, `[参加]`）も付与されます

#### 例

```
GET /schedule.ics
GET /schedule.ics?role=speaker
GET /schedule.ics?status=confirmed
GET /schedule.ics?role=speaker&status=confirmed
```

### GET /feed.xml

RSS 2.0形式でイベント一覧を取得します。

#### Query Parameters

| パラメータ | 説明 | 値 |
|-----------|------|-----|
| `role` | 参加種別でフィルタ | `speaker`, `attendee` |
| `status` | ステータスでフィルタ | `confirmed`, `tentative`, `cancelled` |

#### 備考

- タイトルにはステータスのプレフィックス（`[確定]`, `[仮]`, `[中止]`）が常に付与されます
- `role` を指定しない場合、タイトルに参加種別のプレフィックス（`[登壇]`, `[参加]`）も付与されます

#### 例

```
GET /feed.xml
GET /feed.xml?role=speaker
GET /feed.xml?status=confirmed
GET /feed.xml?role=speaker&status=confirmed
```

### GET /event

イベント一覧をJSON形式で取得します。

#### Query Parameters

| パラメータ | 説明 | 値 |
|-----------|------|-----|
| `role` | 参加種別でフィルタ | `speaker`, `attendee` |
| `status` | ステータスでフィルタ | `confirmed`, `tentative`, `cancelled` |

#### Response

```json
[
  {
    "uid": "string",
    "dtstart": "ISO8601",
    "dtend": "ISO8601",
    "summary": "string",
    "description": "string",
    "location": "string",
    "status": "CONFIRMED | TENTATIVE | CANCELLED",
    "class": "PUBLIC | PRIVATE | CONFIDENTIAL",
    "attendeeType": "SPEAKER | ATTENDEE",
    "created": "ISO8601",
    "lastModified": "ISO8601",
    "sequence": "number"
  }
]
```

### GET /event/:uid

指定したUIDのイベントを取得します。

### 認証

POST/PUT/DELETEはBearer Token認証が必要です。

```bash
# トークンのハッシュを生成
echo -n "your-secret-token" | sha256sum | cut -d' ' -f1

# Cloudflare Workersにハッシュを設定
wrangler secret put API_TOKEN_HASH
# 上で生成したハッシュ値を入力

# リクエスト時は生トークンを使用
curl -X POST https://your-worker.dev/event \
  -H "Authorization: Bearer your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"summary": "Event"}'
```

### POST /event

イベントを作成します。

#### Request Body

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `dtstart` | ISO8601 | Yes | 開始日時（タイムゾーン必須: `2026-01-01T10:00:00+09:00` または `2026-01-01T01:00:00Z`） |
| `dtend` | ISO8601 | Yes | 終了日時（タイムゾーン必須: `2026-01-01T12:00:00+09:00` または `2026-01-01T03:00:00Z`） |
| `summary` | string | Yes | タイトル |
| `description` | string | Yes | 説明 |
| `location` | string | Yes | 場所 |
| `status` | string | Yes | `CONFIRMED`, `TENTATIVE`, `CANCELLED` |
| `attendeeType` | string | Yes | `SPEAKER`, `ATTENDEE` |
| `class` | string | No | `PUBLIC`, `PRIVATE`, `CONFIDENTIAL` (default: `PUBLIC`) |

### PUT /event/:uid

指定したUIDのイベントを更新します。

### DELETE /event/:uid

指定したUIDのイベントを削除します。

## License

ISC
