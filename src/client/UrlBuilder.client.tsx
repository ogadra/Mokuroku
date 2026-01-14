/** @jsxImportSource hono/jsx/dom */
import { useState, useRef } from "hono/jsx";
import { render } from "hono/jsx/dom";
import { Style } from "hono/css";
import { ATTENDEE_TYPE } from "../repository/enums/attendeeType";
import { EVENT_STATUS } from "../repository/enums/eventStatus";
import {
  tabsClass,
  tabClass,
  tabActiveClass,
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
import { RadioGroup } from "./components/RadioGroup";
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

const ROLE = {
  ALL: "all",
  SPEAKER: ATTENDEE_TYPE.SPEAKER.toLowerCase(),
  ATTENDEE: ATTENDEE_TYPE.ATTENDEE.toLowerCase(),
} as const;

type Role = (typeof ROLE)[keyof typeof ROLE];

const STATUS = {
  ALL: "all",
  CONFIRMED: EVENT_STATUS.CONFIRMED.toLowerCase(),
  TENTATIVE: EVENT_STATUS.TENTATIVE.toLowerCase(),
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

const SWIPE_THRESHOLD = 50;

const UrlBuilderApp = () => {
  const [format, setFormat] = useState<Format>(FORMAT.ICAL);
  const [role, setRole] = useState<Role>(ROLE.ALL);
  const [status, setStatus] = useState<Status>(STATUS.ALL);
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
    if (role !== ROLE.ALL) params.set("role", role);
    if (status !== STATUS.ALL) params.set("status", status);
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
    const parsedUrl = new URL(url);

    if (panelFormat === FORMAT.ICAL) {
      const webcalUrl = `webcal://${parsedUrl.host}${parsedUrl.pathname}${parsedUrl.search}`;
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

        <RadioGroup
          name="role"
          legend="参加種別"
          options={[
            { value: ROLE.ALL, label: "すべて" },
            { value: ROLE.SPEAKER, label: "登壇のみ" },
            { value: ROLE.ATTENDEE, label: "参加のみ" },
          ]}
          value={role}
          onChange={(v) => setRole(v as Role)}
        />

        <RadioGroup
          name="status"
          legend="ステータス"
          options={[
            { value: STATUS.ALL, label: "すべて" },
            { value: STATUS.CONFIRMED, label: "確定のみ" },
            { value: STATUS.TENTATIVE, label: "仮のみ" },
          ]}
          value={status}
          onChange={(v) => setStatus(v as Status)}
        />

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
