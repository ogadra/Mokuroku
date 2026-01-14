import type { FC } from "hono/jsx";
import { css } from "hono/css";
import { containerClass, cardClass } from "../Layout";

const noteClass = css`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #feebc8;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #c05621;
  border-left: 3px solid #dd6b20;
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
        <table>
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
