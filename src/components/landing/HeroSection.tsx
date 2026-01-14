import type { FC } from "hono/jsx";
import { css } from "hono/css";

const heroClass = css`
  text-align: center;
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%);
  color: white;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
  }
  
  p {
    font-size: 1.125rem;
    opacity: 0.9;
    font-weight: 400;
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
