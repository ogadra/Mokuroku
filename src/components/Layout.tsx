import type { FC, PropsWithChildren } from "hono/jsx";
import { Style, css } from "hono/css";

export const globalStyles = css`
  :-hono-global {
    :root {
      --color-primary: #3182ce;
      --color-primary-dark: #2b6cb0;
      --color-bg: #f7fafc;
      --color-card: #ffffff;
      --color-text: #1a202c;
      --color-text-muted: #718096;
      --color-border: #e2e8f0;
      --color-code-bg: #2d3748;
      --color-code-text: #e2e8f0;
    }
  
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  
    body {
      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
  
    pre,
    code {
      font-family: "JetBrains Mono", "SF Mono", Monaco, Consolas, monospace;
    }
  
    code {
      background: var(--color-border);
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.875em;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
    }
  
    th,
    td {
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--color-border);
    }
  
    th {
      background: var(--color-bg);
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  
    tr:hover td {
      background: rgba(49, 130, 206, 0.04);
    }
  
    main {
      padding-bottom: 3rem;
    }
  
    section {
      margin-bottom: 2rem;
    }
  
    section h2 {
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: 600;
    }
  
    @media (max-width: 640px) {
      table {
        font-size: 0.875rem;
      }
  
      th,
      td {
        padding: 0.5rem 0.75rem;
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
  border-radius: 8px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`;

export const codeBlockClass = css`
  background: var(--color-code-bg);
  color: var(--color-code-text);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.875rem;
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
        <Style />
      </head>
      <body class={globalStyles}>{children}</body>
    </html>
  );
};
