import type { FC } from "hono/jsx";
import { css } from "hono/css";
import { containerClass, cardClass, codeBlockClass } from "../Layout";

const commentClass = css`
  color: var(--color-code-comment);
`;

const examples = `# すべてのイベント
/schedule.ics
/feed.xml

# 登壇イベントのみ
/schedule.ics?role=speaker
/feed.xml?role=speaker

# 参加イベントのみ
/schedule.ics?role=attendee

# 確定イベントのみ
/schedule.ics?status=confirmed

# 登壇 + 確定イベントのみ
/schedule.ics?role=speaker&status=confirmed`;

export const ExamplesSection: FC = () => {
  const lines = examples.split("\n");
  return (
    <section id="examples" class={containerClass}>
      <h2>使用例</h2>
      <div class={cardClass}>
        <pre class={codeBlockClass}>
          {lines.map((line, i) => (
            <>
              {line.startsWith("#") ? <span class={commentClass}>{line}</span> : line}
              {i < lines.length - 1 && "\n"}
            </>
          ))}
        </pre>
      </div>
    </section>
  );
};
