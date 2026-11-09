import type { FC, PropsWithChildren } from "hono/jsx";
import { Style, css } from "hono/css";

export const globalStyles = css`
  :-hono-global {
    :root {
      --color-primary: #1d2b4f;
      --color-primary-dark: #121c36;
      --color-primary-tint: rgba(29, 43, 79, 0.06);
      --color-seal: #b4412e;
      --color-seal-dark: #933322;
      --color-bg: #e3e9ec;
      --color-card: #fbfaf6;
      --color-text: #1f2226;
      --color-text-muted: #5e6670;
      --color-border: #c9d1d6;
      --color-rule: #9aa5ad;
      --color-code-bg: #1d2b4f;
      --color-code-text: #e8ecf2;
      --color-code-comment: #d8b66a;
      --font-mincho: "Shippori Mincho B1", "Hiragino Mincho ProN", "Yu Mincho", serif;
      --font-gothic: "Zen Kaku Gothic New", "Hiragino Sans", "Yu Gothic", sans-serif;
      --font-code: "M PLUS 1 Code", "SF Mono", Consolas, monospace;
    }
  
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  
    body {
      font-family: var(--font-gothic);
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
      color: var(--color-primary);
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
      font-family: var(--font-mincho);
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
      font-family: var(--font-mincho);
      font-size: 1.375rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--color-primary);
      margin: 0 0 0.75rem 0.25rem;
    }
  
    @media (min-width: 768px) {
      section {
        display: grid;
        grid-template-columns: 3.5rem 1fr;
        align-items: start;
      }
  
      section h2 {
        writing-mode: vertical-rl;
        margin: 0;
        padding: 0.25rem 0 0.75rem;
        border-left: 1px solid var(--color-primary);
        padding-left: 0.5rem;
        justify-self: center;
      }
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
  color: var(--color-code-text);
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
          href="https://fonts.googleapis.com/css2?family=M+PLUS+1+Code:wght@400;500&family=Shippori+Mincho+B1:wght@600;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
        />
        <Style />
      </head>
      <body class={globalStyles}>{children}</body>
    </html>
  );
};
