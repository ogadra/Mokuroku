import type { FC } from "hono/jsx";
import { css } from "hono/css";
import { cardClass, urlCopyClass, copyBtnClass } from "../Layout";

const BASE_URL = "https://mokuroku.ogadra.com";

const feedCardClass = css`
  ${cardClass}

  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.125rem;
  }

  p {
    color: var(--color-text-muted);
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  ol {
    margin: 1rem 0 0 1.25rem;
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }

  li {
    margin-bottom: 0.25rem;
  }
`;

interface FeedCardProps {
  type: "ical" | "rss";
}

export const FeedCard: FC<FeedCardProps> = ({ type }) => {
  const isIcal = type === "ical";
  const title = isIcal ? "iCal" : "RSS";
  const url = isIcal ? `${BASE_URL}/schedule.ics` : `${BASE_URL}/feed.xml`;
  const description = isIcal
    ? "Google Calendar, Apple Calendar, Outlook などのカレンダーアプリに追加"
    : "Feedly, Inoreader などの RSS リーダーで購読";
  const steps = isIcal
    ? ["カレンダーアプリを開く", "「URL でカレンダーを追加」を選択", "上記 URL を貼り付け"]
    : ["RSS リーダーを開く", "「フィードを追加」を選択", "上記 URL を貼り付け"];
  const inputId = `${type}-url`;
  const buttonId = `${type}-copy-btn`;

  return (
    <div class={feedCardClass}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div class={urlCopyClass}>
        <input type="text" id={inputId} value={url} readonly />
        <button
          class={copyBtnClass}
          id={buttonId}
          onclick={`copyToClipboard('${inputId}', '${buttonId}')`}
        >
          Copy
        </button>
      </div>
      <ol>
        {steps.map((step) => (
          <li>{step}</li>
        ))}
      </ol>
    </div>
  );
};
