import type { FC } from "hono/jsx";
import { containerClass, cardClass, codeBlockClass } from "../Layout";

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
  return (
    <section id="examples" class={containerClass}>
      <h2>使用例</h2>
      <div class={cardClass}>
        <pre class={codeBlockClass}>{examples}</pre>
      </div>
    </section>
  );
};
