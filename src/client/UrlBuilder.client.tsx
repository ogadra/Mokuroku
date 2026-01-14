/** @jsxImportSource hono/jsx/dom */
import { useState, useRef } from "hono/jsx";
import { render } from "hono/jsx/dom";
import { css, Style } from "hono/css";
import type { AttendeeType } from "../repository/enums/attendeeType";
import type { EventStatusType } from "../repository/enums/eventStatus";

const FORMAT = {
  ICAL: "ical",
  RSS: "rss",
} as const;

type Format = (typeof FORMAT)[keyof typeof FORMAT];
type Role = "all" | Lowercase<AttendeeType>;
type Status = "all" | Lowercase<EventStatusType>;

const tabsClass = css`
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
`;

const tabClass = css`
  flex: 1;
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
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: -1px;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  box-shadow: 0 4px 6px -4px rgba(59, 130, 246, 0.5);
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
  gap: 0.5rem;
  
  @media (min-width: 400px) {
    gap: 1rem;
  }
`;

const labelClass = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text-muted);
  background: var(--color-bg);
  transition: all 0.2s;
  white-space: nowrap;
  font-size: 0.875rem;
  
  @media (min-width: 400px) {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
  
  input {
    display: none;
  }
  
  &:has(input:checked) {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }
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

const swipeContainerClass = css`
  position: relative;
  touch-action: pan-y;
`;

const slidingWrapperClass = css`
  position: relative;
`;

const slidingOverflowClass = css`
  overflow: hidden;
`;

const slidingContainerClass = css`
  display: flex;
  width: 200%;
  gap: 2rem;
  transition: transform 0.3s ease-out;
`;

const panelClass = css`
  width: 50%;
  flex-shrink: 0;
`;

const swipeArrowClass = css`
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  border: none;
  background: var(--color-bg);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: all 0.2s;
  z-index: 10;
  
  &:hover {
    color: var(--color-primary);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  }
`;

const swipeArrowHiddenClass = css`
  opacity: 0;
  pointer-events: none;
`;

const feedBtnClass = css`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
`;

const rssBtnClass = css`
  background: #f97316;
  
  &:hover {
    background: #ea580c;
  }
`;

const appleBtnClass = css`
  background: #374151;
  
  &:hover {
    background: #1f2937;
  }
`;

const googleBtnClass = css`
  background: #4285f4;
  
  &:hover {
    background: #3367d6;
  }
`;

const methodsClass = css`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const methodClass = css`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const methodContentClass = css`
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.5rem;
`;

const methodTitleClass = css`
  font-weight: 600;
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  text-align: center;
  border-left: 3px solid var(--color-primary);
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

const SWIPE_THRESHOLD = 50;

const UrlBuilderApp = () => {
  const [format, setFormat] = useState<Format>(FORMAT.ICAL);
  const [role, setRole] = useState<Role>("all");
  const [status, setStatus] = useState<Status>("all");
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = (touchStartX.current ?? 0) - touchEndX;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        setFormat(FORMAT.RSS);
      } else {
        setFormat(FORMAT.ICAL);
      }
    }
  };

  const buildUrl = (targetFormat: Format = format): string => {
    const base = window.location.origin;
    const path = targetFormat === FORMAT.ICAL ? "/schedule.ics" : "/feed.xml";
    const params = new URLSearchParams();
    if (role !== "all") params.set("role", role);
    if (status !== "all") params.set("status", status);
    return params.toString() ? `${base}${path}?${params}` : `${base}${path}`;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isIcal = format === FORMAT.ICAL;
  const isRss = format === FORMAT.RSS;

  const renderInfoPanel = (panelFormat: Format) => {
    const url = buildUrl(panelFormat);
    const path = panelFormat === FORMAT.ICAL ? "/schedule.ics" : "/feed.xml";
    const params = new URLSearchParams();
    if (role !== "all") params.set("role", role);
    if (status !== "all") params.set("status", status);
    const queryString = params.toString() ? `?${params}` : "";

    if (panelFormat === FORMAT.ICAL) {
      const webcalUrl = `webcal://${window.location.host}${path}${queryString}`;
      const googleUrl = `https://www.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`;

      return (
        <div class={panelClass}>
          <div class={urlCopyClass}>
            <input type="text" class={inputClass} value={url} readonly />
            <button class={copyBtnClass} onClick={() => copyToClipboard(url)}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div class={methodsClass}>
            <div class={methodClass}>
              <span class={methodTitleClass}>ワンクリックで追加</span>
              <div class={methodContentClass}>
                <a class={`${feedBtnClass} ${appleBtnClass}`} href={webcalUrl}>
                  <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  Apple Calendar
                </a>
                <a
                  class={`${feedBtnClass} ${googleBtnClass}`}
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 488 512" fill="currentColor">
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                  </svg>
                  Google Calendar
                </a>
              </div>
            </div>
            <div class={methodClass}>
              <span class={methodTitleClass}>URLで登録</span>
              <ol class={stepsClass}>
                <li>カレンダーアプリを開く</li>
                <li>「URLでカレンダーを追加」を選択</li>
                <li>上記URLを貼り付け</li>
              </ol>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div class={panelClass}>
        <div class={urlCopyClass}>
          <input type="text" class={inputClass} value={url} readonly />
          <button class={copyBtnClass} onClick={() => copyToClipboard(url)}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div class={methodsClass}>
          <div class={methodClass}>
            <span class={methodTitleClass}>ブラウザで開く</span>
            <div class={methodContentClass}>
              <a
                class={`${feedBtnClass} ${rssBtnClass}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="6.18" cy="17.82" r="2.18" />
                  <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
                </svg>
                RSSフィードを開く
              </a>
            </div>
          </div>
          <div class={methodClass}>
            <span class={methodTitleClass}>RSSリーダーで登録</span>
            <ol class={stepsClass}>
              <li>RSSリーダーを開く</li>
              <li>「フィードを追加」を選択</li>
              <li>上記URLを貼り付け</li>
            </ol>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Style />
      <div class={swipeContainerClass} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div class={tabsClass}>
          <button class={isIcal ? tabActiveClass : tabClass} onClick={() => setFormat(FORMAT.ICAL)}>
            iCal
          </button>
          <button class={isRss ? tabActiveClass : tabClass} onClick={() => setFormat(FORMAT.RSS)}>
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

        <div class={slidingWrapperClass}>
          <button
            class={`${swipeArrowClass} ${isIcal ? swipeArrowHiddenClass : ""}`}
            onClick={() => setFormat(FORMAT.ICAL)}
            aria-label="iCalに切り替え"
            style={{ left: "-1rem" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            class={`${swipeArrowClass} ${isRss ? swipeArrowHiddenClass : ""}`}
            onClick={() => setFormat(FORMAT.RSS)}
            aria-label="RSSに切り替え"
            style={{ right: "-1rem" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div class={slidingOverflowClass}>
            <div
              class={slidingContainerClass}
              style={{ transform: isRss ? "translateX(calc(-50% - 2rem))" : "translateX(0)" }}
            >
              {renderInfoPanel(FORMAT.ICAL)}
              {renderInfoPanel(FORMAT.RSS)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const root = document.getElementById("url-builder-root");
if (root) {
  render(<UrlBuilderApp />, root);
}
