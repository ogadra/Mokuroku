/** @jsxImportSource hono/jsx/dom */
import { useState, useRef } from "hono/jsx";
import { render } from "hono/jsx/dom";
import { Style } from "hono/css";
import type { AttendeeType } from "../repository/enums/attendeeType";
import type { EventStatusType } from "../repository/enums/eventStatus";
import {
  tabsClass,
  tabClass,
  tabActiveClass,
  fieldsetClass,
  legendClass,
  radioGroupClass,
  labelClass,
  urlCopyClass,
  inputClass,
  copyBtnClass,
  stepsClass,
  swipeContainerClass,
  slidingWrapperClass,
  slidingOverflowClass,
  slidingContainerClass,
  panelClass,
  swipeArrowClass,
  swipeArrowHiddenClass,
  feedBtnClass,
  rssBtnClass,
  appleBtnClass,
  googleBtnClass,
  methodsClass,
  methodClass,
  methodContentClass,
  methodTitleClass,
} from "./UrlBuilder.styles";
import { AppleIcon } from "./icons/AppleIcon";
import { GoogleIcon } from "./icons/GoogleIcon";
import { RssIcon } from "./icons/RssIcon";
import { ChevronLeftIcon } from "./icons/ChevronLeftIcon";
import { ChevronRightIcon } from "./icons/ChevronRightIcon";

const FORMAT = {
  ICAL: "ical",
  RSS: "rss",
} as const;

type Format = (typeof FORMAT)[keyof typeof FORMAT];
type Role = "all" | Lowercase<AttendeeType>;
type Status = "all" | Lowercase<EventStatusType>;

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
                  <AppleIcon />
                  Apple Calendar
                </a>
                <a
                  class={`${feedBtnClass} ${googleBtnClass}`}
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GoogleIcon />
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
                <RssIcon />
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
            <ChevronLeftIcon />
          </button>
          <button
            class={`${swipeArrowClass} ${isRss ? swipeArrowHiddenClass : ""}`}
            onClick={() => setFormat(FORMAT.RSS)}
            aria-label="RSSに切り替え"
            style={{ right: "-1rem" }}
          >
            <ChevronRightIcon />
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
