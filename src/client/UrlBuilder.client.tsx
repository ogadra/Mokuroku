/** @jsxImportSource hono/jsx/dom */
import { useState } from "hono/jsx";
import { render } from "hono/jsx/dom";
import { css, Style } from "hono/css";

type Format = "ical" | "rss";
type Role = "all" | "speaker" | "attendee";
type Status = "all" | "confirmed" | "tentative";

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

  return (
    <>
      <Style />
      <fieldset class={fieldsetClass}>
        <legend class={legendClass}>フィード形式</legend>
        <div class={radioGroupClass}>
          <label class={labelClass}>
            <input
              type="radio"
              name="format"
              value="ical"
              checked={format === "ical"}
              onChange={() => setFormat("ical")}
            />
            iCal
          </label>
          <label class={labelClass}>
            <input
              type="radio"
              name="format"
              value="rss"
              checked={format === "rss"}
              onChange={() => setFormat("rss")}
            />
            RSS
          </label>
        </div>
      </fieldset>

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
    </>
  );
};

const root = document.getElementById("url-builder-root");
if (root) {
  render(<UrlBuilderApp />, root);
}
