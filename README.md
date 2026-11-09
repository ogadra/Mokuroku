# Mokuroku (目録)

おがどらの登壇予定を確認できるサイトのソースコードだ。

## Tech Stack

- Runtime: Cloudflare Workers
- Framework: Hono
- Database: D1
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

iCalendar形式でイベント一覧を取得する。

#### Query Parameters

| パラメータ | 説明                 | 値                                    |
| ---------- | -------------------- | ------------------------------------- |
| `role`     | 参加種別でフィルタ   | `speaker`, `attendee`                 |
| `status`   | ステータスでフィルタ | `confirmed`, `tentative`, `cancelled` |

#### 備考

- SUMMARYの先頭に、ステータスのプレフィックスを付ける
  - `[確定]`
  - `[仮]`
  - `[中止]`
- `role` を指定しない場合
  - ステータスの後ろに、参加種別のプレフィックスも付ける
    - `[登壇]`
    - `[参加]`

#### 例

```
GET /schedule.ics
GET /schedule.ics?role=speaker
GET /schedule.ics?status=confirmed
GET /schedule.ics?role=speaker&status=confirmed
```

### GET /feed.xml

RSS 2.0形式でイベント一覧を取得する。

#### Query Parameters

| パラメータ | 説明                 | 値                                    |
| ---------- | -------------------- | ------------------------------------- |
| `role`     | 参加種別でフィルタ   | `speaker`, `attendee`                 |
| `status`   | ステータスでフィルタ | `confirmed`, `tentative`, `cancelled` |

#### 備考

- タイトルの先頭に、ステータスのプレフィックスを付ける
  - `[確定]`
  - `[仮]`
  - `[中止]`
- `role` を指定しない場合
  - ステータスの後ろに、参加種別のプレフィックスも付ける
    - `[登壇]`
    - `[参加]`

#### 例

```
GET /feed.xml
GET /feed.xml?role=speaker
GET /feed.xml?status=confirmed
GET /feed.xml?role=speaker&status=confirmed
```

### GET /event

イベント一覧をJSON形式で取得する。

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

### 認証

POST/PUT/DELETEはBearer Token認証が必要だ。

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

#### Request Body

| フィールド     | 型      | 必須 | 説明                                                                                       |
| -------------- | ------- | ---- | ------------------------------------------------------------------------------------------ |
| `dtstart`      | ISO8601 | Yes  | 開始日時。タイムゾーンを付ける。例は `2026-01-01T10:00:00+09:00` か `2026-01-01T01:00:00Z` |
| `dtend`        | ISO8601 | Yes  | 終了日時。タイムゾーンを付ける。例は `2026-01-01T12:00:00+09:00` か `2026-01-01T03:00:00Z` |
| `summary`      | string  | Yes  | タイトル                                                                                   |
| `description`  | string  | Yes  | 説明                                                                                       |
| `location`     | string  | Yes  | 場所                                                                                       |
| `status`       | string  | Yes  | `CONFIRMED`, `TENTATIVE`, `CANCELLED`                                                      |
| `attendeeType` | string  | Yes  | `SPEAKER`, `ATTENDEE`                                                                      |
| `class`        | string  | No   | `PUBLIC`, `PRIVATE`, `CONFIDENTIAL`。省略すると `PUBLIC`                                   |

### PUT /event/:uid

### DELETE /event/:uid

## connpass同期

Cron Triggersで4時間ごとにconnpass API v2から自分の参加イベントを取得し、`events` テーブルへ同期する。

- 同期対象は、開催日の新しい順に取得した100件のうち、まだ始まっていない参加イベントだ
- connpassの `event_id` をキーにupsertする
  - 新規のイベント
    - INSERTする
  - 既存のイベント
    - 次の列を更新する
      - タイトル
      - 日時
      - 場所
      - status
      - 参加種別
- 参加種別は同期のたびに判定する
  - `/users/{nickname}/presenter_events/` に含まれるイベント
    - `SPEAKER`
  - 含まれないイベント
    - `ATTENDEE`
- connpassで見つからなくなった未来のイベントは `CANCELLED` に更新する
- 同期が書き換えるのは `connpass_event_id` を持つイベントだけだ

### 環境変数

| 変数名               | 説明                     |
| -------------------- | ------------------------ |
| `CONNPASS_API_TOKEN` | connpass API v2のAPIキー |

```bash
# connpass API キーを Cloudflare Workers に設定
wrangler secret put CONNPASS_API_TOKEN
```

ローカル開発では、`.dev.vars.sample` をもとに `.dev.vars` へ `CONNPASS_API_TOKEN` を設定する。

## License

ISC
