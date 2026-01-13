import type { FC, PropsWithChildren } from "hono/jsx";
import { Style, css } from "hono/css";
import { raw } from "hono/html";

export const globalStyles = css`
  :-hono-global {
    :root {
      --color-primary: #3b82f6;
      --color-primary-dark: #2563eb;
      --color-bg: #f8fafc;
      --color-card: #ffffff;
      --color-text: #1e293b;
      --color-text-muted: #64748b;
      --color-border: #e2e8f0;
      --color-code-bg: #1e293b;
      --color-code-text: #e2e8f0;
    }
  
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
    }
  
    pre,
    code {
      font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
    }
  
    code {
      background: var(--color-bg);
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
    }
  
    @media (max-width: 640px) {
      table {
        font-size: 0.875rem;
      }
  
      th,
      td {
        padding: 0.5rem;
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
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

export const cardGridClass = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const codeBlockClass = css`
  background: var(--color-code-bg);
  color: var(--color-code-text);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.875rem;
`;

export const urlCopyClass = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-code-bg);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  
  input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--color-code-text);
    font-family: monospace;
    font-size: 0.875rem;
    outline: none;
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  
    input {
      margin-bottom: 0.5rem;
    }
  }
`;

export const copyBtnClass = css`
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

const copyScript = `
function copyToClipboard(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  navigator.clipboard.writeText(input.value).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  });
}
`;

export const Layout: FC<PropsWithChildren> = ({ children }) => {
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
        <link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml" />
        <Style />
      </head>
      <body class={globalStyles}>
        {children}
        <script>{raw(copyScript)}</script>
      </body>
    </html>
  );
};
