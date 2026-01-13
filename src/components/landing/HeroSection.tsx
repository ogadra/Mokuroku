import type { FC } from "hono/jsx";
import { css } from "hono/css";

const heroClass = css`
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1.125rem;
    opacity: 0.9;
  }
`;

export const HeroSection: FC = () => {
  return (
    <header class={heroClass}>
      <h1>Mokuroku</h1>
      <p>ogadraの登壇予定・イベント情報</p>
    </header>
  );
};
