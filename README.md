# Mokuroku (目録)

おがどらの登壇予定を確認できるサイトのソースコードです。

## API

### GET /schedule.ics

iCalendar形式でイベント一覧を取得します。

#### Query Parameters

| パラメータ | 説明 | 値 |
|-----------|------|-----|
| `role` | 参加種別でフィルタ | `speaker`, `attendee` |
| `status` | ステータスでフィルタ | `confirmed`, `tentative`, `cancelled` |

#### 備考

- `role` を指定しない場合、SUMMARYに `[登壇]` または `[参加]` のプレフィックスが付与されます

#### 例

```
GET /schedule.ics
GET /schedule.ics?role=speaker
GET /schedule.ics?status=confirmed
GET /schedule.ics?role=speaker&status=confirmed
```

### GET /event

イベント一覧をJSON形式で取得します。

### GET /event/:uid

指定したUIDのイベントを取得します。

### POST /event

イベントを作成します。

### PUT /event/:uid

指定したUIDのイベントを更新します。

### DELETE /event/:uid

指定したUIDのイベントを削除します。
