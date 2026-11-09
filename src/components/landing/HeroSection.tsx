import type { FC } from "hono/jsx";
import { css } from "hono/css";
import { containerClass } from "../Layout";

const heroClass = css`
  padding: 4.5rem 0 3rem;
  
  h1 {
    font-size: clamp(3.25rem, 10vw, 5.5rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--color-text);
  }
  
  p {
    margin-top: 0.75rem;
    font-size: 1.125rem;
    color: var(--color-text-muted);
  }
  
  @media (max-width: 640px) {
    padding: 3rem 0 2rem;
  
    p {
      font-size: 1rem;
    }
  }
`;

export const HeroSection: FC = () => {
  return (
    <header class={heroClass}>
      <div class={containerClass}>
        <h1>Mokuroku</h1>
        <p>ogadraの登壇予定・イベント情報</p>
      </div>
    </header>
  );
};
