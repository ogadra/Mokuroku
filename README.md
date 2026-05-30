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
├── index.ts                 # エントリーポイント（fetch / scheduled ハンドラ）
├── jobs/
│   └── connpassSync.ts      # connpass イベント同期処理（Cron Triggers）
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
    ├── connpass.ts          # connpass API v2 クライアント / 変換ロジック
    ├── eventPrefix.ts       # イベントタイトルのプレフィックス生成
    ├── hash.ts              # SHA-256ハッシュ
    ├── ics.ts               # iCalendar生成
    └── rss.ts               # RSS生成
```

## API

### GET /schedule.ics

iCalendar形式でイベント一覧を取得します。

#### Query Parameters

| パラメータ | 説明                 | 値                                    |
| ---------- | -------------------- | ------------------------------------- |
| `role`     | 参加種別でフィルタ   | `speaker`, `attendee`                 |
| `status`   | ステータスでフィルタ | `confirmed`, `tentative`, `cancelled` |

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

| パラメータ | 説明                 | 値                                    |
| ---------- | -------------------- | ------------------------------------- |
| `role`     | 参加種別でフィルタ   | `speaker`, `attendee`                 |
| `status`   | ステータスでフィルタ | `confirmed`, `tentative`, `cancelled` |

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

| パラメータ | 説明                 | 値                                    |
| ---------- | -------------------- | ------------------------------------- |
| `role`     | 参加種別でフィルタ   | `speaker`, `attendee`                 |
| `status`   | ステータスでフィルタ | `confirmed`, `tentative`, `cancelled` |

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

| フィールド     | 型      | 必須 | 説明                                                                                    |
| -------------- | ------- | ---- | --------------------------------------------------------------------------------------- |
| `dtstart`      | ISO8601 | Yes  | 開始日時（タイムゾーン必須: `2026-01-01T10:00:00+09:00` または `2026-01-01T01:00:00Z`） |
| `dtend`        | ISO8601 | Yes  | 終了日時（タイムゾーン必須: `2026-01-01T12:00:00+09:00` または `2026-01-01T03:00:00Z`） |
| `summary`      | string  | Yes  | タイトル                                                                                |
| `description`  | string  | Yes  | 説明                                                                                    |
| `location`     | string  | Yes  | 場所                                                                                    |
| `status`       | string  | Yes  | `CONFIRMED`, `TENTATIVE`, `CANCELLED`                                                   |
| `attendeeType` | string  | Yes  | `SPEAKER`, `ATTENDEE`                                                                   |
| `class`        | string  | No   | `PUBLIC`, `PRIVATE`, `CONFIDENTIAL` (default: `PUBLIC`)                                 |

### PUT /event/:uid

指定したUIDのイベントを更新します。

### DELETE /event/:uid

指定したUIDのイベントを削除します。

## connpass 同期

Cloudflare Workers の Cron Triggers（1時間ごと）で connpass API v2 から自分の参加予定イベントを取得し、`events` テーブルへ自動同期します。

- 同期対象は当月から2か月先までの参加イベントです
- connpass の `event_id` をキーに upsert します（新規は INSERT、既存は タイトル・日時・場所・status・参加種別 を更新）
- 発表者として登壇したイベント（`/users/{nickname}/presenter_events/`）に含まれるものを `SPEAKER`、それ以外を `ATTENDEE` と判定します
  - 未来のイベントは connpass 側で発表者として確定するまで `ATTENDEE` 扱いになる場合があります（その後の同期で `SPEAKER` に更新されます）
- connpass 側で確認できなくなった未来のイベントは物理削除せず `CANCELLED` に更新します
- 手動で作成したイベント（`connpass_event_id` が未設定）は同期処理の影響を受けません

### 環境変数

| 変数名               | 説明                             |
| -------------------- | -------------------------------- |
| `API_TOKEN_HASH`     | POST/PUT/DELETE 認証用のハッシュ |
| `CONNPASS_API_TOKEN` | connpass API v2 の API キー      |

```bash
# connpass API キーを Cloudflare Workers に設定
wrangler secret put CONNPASS_API_TOKEN
```

ローカル開発では `.dev.vars` に `CONNPASS_API_TOKEN` を設定します（`.dev.vars.sample` 参照）。

## License

ISC
