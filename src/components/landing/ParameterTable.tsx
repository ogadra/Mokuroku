import type { FC } from "hono/jsx";
import { css } from "hono/css";
import { containerClass, cardClass } from "../Layout";

const noteClass = css`
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  background: rgba(180, 65, 46, 0.06);
  border: 1px solid rgba(180, 65, 46, 0.35);
  border-radius: 2px;
  font-size: 0.875rem;
  color: var(--color-seal-dark);
  
  code {
    color: var(--color-seal-dark);
    background: rgba(180, 65, 46, 0.1);
  }
`;

const tableClass = css`
  td:last-child {
    font-weight: 500;
  }
  
  tbody tr:last-child td {
    border-bottom: 1px solid var(--color-primary);
  }
`;

const parameters = [
  { param: "role", value: "speaker", description: "登壇イベントのみ" },
  { param: "role", value: "attendee", description: "参加イベントのみ" },
  { param: "status", value: "confirmed", description: "確定イベントのみ" },
  { param: "status", value: "tentative", description: "仮イベントのみ" },
  { param: "status", value: "cancelled", description: "キャンセル済みのみ" },
];

export const ParameterTable: FC = () => {
  return (
    <section id="parameters" class={containerClass}>
      <h2>クエリパラメータ</h2>
      <div class={cardClass}>
        <table class={tableClass}>
          <thead>
            <tr>
              <th>パラメータ</th>
              <th>値</th>
              <th>説明</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((p) => (
              <tr>
                <td>
                  <code>{p.param}</code>
                </td>
                <td>
                  <code>{p.value}</code>
                </td>
                <td>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p class={noteClass}>
          <code>role</code> を指定すると、タイトルから [登壇] / [参加]
          プレフィックスが省略されます。
        </p>
      </div>
    </section>
  );
};
