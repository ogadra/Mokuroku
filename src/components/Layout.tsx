import type { FC, PropsWithChildren } from "hono/jsx";
import { Style, css } from "hono/css";

export const globalStyles = css`
  :-hono-global {
    :root {
      --color-primary: oklch(0.297 0.068 55);
      --color-primary-dark: oklch(0.232 0.052 55);
      --color-primary-tint: oklch(0.297 0.068 55 / 0.06);
      --color-accent: oklch(0.533 0.153 55);
      --color-accent-dark: oklch(0.458 0.133 55);
      --color-accent-tint: oklch(0.533 0.153 55 / 0.06);
      --color-accent-border: oklch(0.533 0.153 55 / 0.35);
      --color-bg: oklch(0.93 0.008 55);
      --color-card: oklch(0.985 0.005 55);
      --color-card-hover: oklch(0.915 0.015 55);
      --color-text: #000000;
      --color-text-muted: rgb(0 0 0 / 0.6);
      --color-text-strong: oklch(0.251 0.009 55);
      --color-on-dark: #ffffff;
      --color-on-dark-muted: rgb(255 255 255 / 0.6);
      --color-border: oklch(0.856 0.011 55);
      --color-rule: oklch(0.716 0.017 55);
      --color-code-bg: oklch(0.2 0.035 55);
      --font-sans: "IBM Plex Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif;
      --font-code: "M PLUS 1 Code", "SF Mono", Consolas, monospace;
    }
  
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  
    body {
      font-family: var(--font-sans);
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
  
    pre,
    code {
      font-family: var(--font-code);
    }
  
    code {
      color: var(--color-text);
      background: var(--color-primary-tint);
      padding: 0.0625rem 0.375rem;
      border-radius: 2px;
      font-size: 0.875em;
    }
  
    :focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
    }
  
    th,
    td {
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px dotted var(--color-rule);
    }
  
    th {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-text-muted);
      border-bottom: 1px solid var(--color-primary);
    }
  
    main {
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
      padding-bottom: 4rem;
    }
  
    main > section {
      width: 100%;
    }
  
    section h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 0.75rem;
    }
  
    @media (max-width: 640px) {
      table {
        font-size: 0.875rem;
      }
  
      th,
      td {
        padding: 0.5rem 0.5rem;
      }
    }
  
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        transition: none !important;
      }
    }
  }
`;

export const containerClass = css`
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const cardClass = css`
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 1.75rem;
  
  @media (max-width: 640px) {
    padding: 1.25rem 1rem;
  }
`;

export const codeBlockClass = css`
  background: var(--color-code-bg);
  color: var(--color-on-dark);
  padding: 1.25rem 1.5rem;
  border-radius: 2px;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.8;
`;

type LayoutProps = PropsWithChildren<{
  baseUrl: string;
}>;

export const Layout: FC<LayoutProps> = ({ children, baseUrl }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mokuroku - ogadraの登壇予定</title>
        <meta
          name="description"
          content="ogadraの登壇予定・イベント情報。iCal または RSS で購読できます。"
        />
        <link rel="alternate" type="application/rss+xml" title="RSS" href={`${baseUrl}/feed.xml`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@400;500;600;700&family=M+PLUS+1+Code:wght@400;500&display=swap"
        />
        <Style />
      </head>
      <body class={globalStyles}>{children}</body>
    </html>
  );
};
