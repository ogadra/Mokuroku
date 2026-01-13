# Mokuroku (目録)

おがどらの登壇予定を確認できるサイトのソースコードです。

## Tech Stack

- Runtime: Cloudflare Workers
- Framework: Hono
- Database: Cloudflare D1 (SQLite)
- ORM: Drizzle ORM

## Development

Nix flakes + direnv

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

### GET /event

イベント一覧をJSON形式で取得します。

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
| `dtstart` | ISO8601 | Yes | 開始日時 |
| `dtend` | ISO8601 | Yes | 終了日時 |
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
