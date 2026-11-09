import type { FC } from "hono/jsx";
import { css } from "hono/css";
import { containerClass } from "../Layout";

const heroClass = css`
  position: relative;
  background-color: var(--color-primary);
  background-image:
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.06) 0 1px, transparent 1px 4px);
  padding: 2.5rem 0;
  margin-bottom: 3rem;
  overflow: hidden;
  
  &::after {
    content: "";
    position: absolute;
    top: 12%;
    bottom: 12%;
    right: 0;
    width: 2.25rem;
    background-image:
      linear-gradient(#d9d2bf, #d9d2bf), linear-gradient(#d9d2bf, #d9d2bf),
      linear-gradient(#d9d2bf, #d9d2bf), linear-gradient(#d9d2bf, #d9d2bf),
      linear-gradient(#d9d2bf, #d9d2bf);
    background-repeat: no-repeat;
    background-size:
      2px 100%,
      100% 2px,
      100% 2px,
      100% 2px,
      100% 2px;
    background-position:
      0.75rem 0,
      0.75rem 0,
      0.75rem 33.33%,
      0.75rem 66.66%,
      0.75rem 100%;
    opacity: 0.55;
  }
  
  @media (max-width: 640px) {
    padding: 2rem 0;
    margin-bottom: 2rem;
  }
`;

const titleSlipClass = css`
  writing-mode: vertical-rl;
  display: inline-flex;
  gap: 0.75rem;
  background: #f3f0e6;
  color: var(--color-primary);
  padding: 1.75rem 1.25rem;
  box-shadow:
    inset 0 0 0 6px #f3f0e6,
    inset 0 0 0 7px var(--color-primary);
  
  h1 {
    font-family: var(--font-mincho);
    font-size: 2.75rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.14em;
  }
  
  p {
    font-family: var(--font-mincho);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    line-height: 1;
    color: var(--color-text);
    padding-top: 1.5rem;
  }
  
  @media (max-width: 640px) {
    padding: 1.5rem 1rem;
  
    h1 {
      font-size: 2.25rem;
    }
  
    p {
      font-size: 0.8125rem;
      padding-top: 1rem;
    }
  }
`;

export const HeroSection: FC = () => {
  return (
    <header class={heroClass}>
      <div class={containerClass}>
        <div class={titleSlipClass}>
          <h1>Mokuroku</h1>
          <p>ogadraの登壇予定・イベント情報</p>
        </div>
      </div>
    </header>
  );
};
