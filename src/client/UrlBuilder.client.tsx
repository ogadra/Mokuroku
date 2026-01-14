import { useState } from "hono/jsx";
import { render } from "hono/jsx/dom";
import { css, Style } from "hono/css";

type Format = "ical" | "rss";
type Role = "all" | "speaker" | "attendee";
type Status = "all" | "confirmed" | "tentative";

const tabsClass = css`
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
`;

const tabClass = css`
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: var(--color-text-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition:
    color 0.2s,
    border-color 0.2s;
  
  &:hover {
    color: var(--color-text);
  }
`;

const tabActiveClass = css`
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: -1px;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
`;

const fieldsetClass = css`
  border: none;
  margin-bottom: 1rem;
`;

const legendClass = css`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const radioGroupClass = css`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const labelClass = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  color: var(--color-text-muted);
`;

const urlCopyClass = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-code-bg);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const inputClass = css`
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-code-text);
  font-family: monospace;
  font-size: 0.875rem;
  outline: none;
  
  @media (max-width: 640px) {
    margin-bottom: 0.5rem;
  }
`;

const copyBtnClass = css`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
  
  &:hover {
    background: var(--color-primary-dark);
  }
`;

const descriptionClass = css`
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const stepsClass = css`
  margin: 1rem 0 0 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  
  li {
    margin-bottom: 0.25rem;
  }
`;

const FEED_INFO = {
  ical: {
    description: "Google Calendar, Apple Calendar, Outlook などのカレンダーアプリに追加",
    steps: ["カレンダーアプリを開く", "「URLでカレンダーを追加」を選択", "上記URLを貼り付け"],
  },
  rss: {
    description: "Feedly, Inoreader などのRSSリーダーで購読",
    steps: ["RSSリーダーを開く", "「フィードを追加」を選択", "上記URLを貼り付け"],
  },
};

const UrlBuilderApp = () => {
  const [format, setFormat] = useState<Format>("ical");
  const [role, setRole] = useState<Role>("all");
  const [status, setStatus] = useState<Status>("all");
  const [copied, setCopied] = useState(false);

  const buildUrl = (): string => {
    const base = window.location.origin;
    const path = format === "ical" ? "/schedule.ics" : "/feed.xml";
    const params = new URLSearchParams();
    if (role !== "all") params.set("role", role);
    if (status !== "all") params.set("status", status);
    return params.toString() ? `${base}${path}?${params}` : `${base}${path}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(buildUrl()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const feedInfo = FEED_INFO[format];

  return (
    <>
      <Style />
      <div class={tabsClass}>
        <button
          class={format === "ical" ? tabActiveClass : tabClass}
          onClick={() => setFormat("ical")}
        >
          iCal
        </button>
        <button
          class={format === "rss" ? tabActiveClass : tabClass}
          onClick={() => setFormat("rss")}
        >
          RSS
        </button>
      </div>

      <fieldset class={fieldsetClass}>
        <legend class={legendClass}>参加種別</legend>
        <div class={radioGroupClass}>
          <label class={labelClass}>
            <input
              type="radio"
              name="role"
              value="all"
              checked={role === "all"}
              onChange={() => setRole("all")}
            />
            すべて
          </label>
          <label class={labelClass}>
            <input
              type="radio"
              name="role"
              value="speaker"
              checked={role === "speaker"}
              onChange={() => setRole("speaker")}
            />
            登壇のみ
          </label>
          <label class={labelClass}>
            <input
              type="radio"
              name="role"
              value="attendee"
              checked={role === "attendee"}
              onChange={() => setRole("attendee")}
            />
            参加のみ
          </label>
        </div>
      </fieldset>

      <fieldset class={fieldsetClass}>
        <legend class={legendClass}>ステータス</legend>
        <div class={radioGroupClass}>
          <label class={labelClass}>
            <input
              type="radio"
              name="status"
              value="all"
              checked={status === "all"}
              onChange={() => setStatus("all")}
            />
            すべて
          </label>
          <label class={labelClass}>
            <input
              type="radio"
              name="status"
              value="confirmed"
              checked={status === "confirmed"}
              onChange={() => setStatus("confirmed")}
            />
            確定のみ
          </label>
          <label class={labelClass}>
            <input
              type="radio"
              name="status"
              value="tentative"
              checked={status === "tentative"}
              onChange={() => setStatus("tentative")}
            />
            仮のみ
          </label>
        </div>
      </fieldset>

      <div class={urlCopyClass}>
        <input type="text" class={inputClass} value={buildUrl()} readonly />
        <button class={copyBtnClass} onClick={copyToClipboard}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p class={descriptionClass}>{feedInfo.description}</p>
      <ol class={stepsClass}>
        {feedInfo.steps.map((step) => (
          <li>{step}</li>
        ))}
      </ol>
    </>
  );
};

const root = document.getElementById("url-builder-root");
if (root) {
  render(<UrlBuilderApp />, root);
}
