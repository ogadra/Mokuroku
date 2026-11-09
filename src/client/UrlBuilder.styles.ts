import { css } from "hono/css";

export const tabsClass = css`
  display: flex;
  border-bottom: 1px solid var(--color-primary);
  margin-bottom: 1.75rem;
`;

export const tabClass = css`
  flex: 1;
  padding: 0.625rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: var(--font-mincho);
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
  transition:
    color 0.15s,
    border-color 0.15s;
  
  &:hover {
    color: var(--color-primary);
    border-bottom-color: var(--color-border);
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
`;

export const tabActiveClass = css`
  flex: 1;
  padding: 0.625rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: var(--font-mincho);
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin-bottom: -1px;
  color: var(--color-primary);
  border-bottom: 3px solid var(--color-primary);
  
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
`;

export const fieldsetClass = css`
  border: none;
  margin-bottom: 1.25rem;
`;

export const legendClass = css`
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-text-muted);
`;

export const radioGroupClass = css`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--color-primary);
  border-radius: 2px;
  overflow: hidden;
`;

export const labelClass = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.5rem;
  cursor: pointer;
  color: var(--color-primary);
  background: var(--color-card);
  transition:
    background 0.15s,
    color 0.15s;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  
  & + & {
    border-left: 1px solid var(--color-primary);
  }
  
  @media (min-width: 400px) {
    padding: 0.5rem 1rem;
    font-size: 0.9375rem;
  }
  
  &:hover {
    background: var(--color-primary-tint);
  }
  
  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  
  &:has(input:checked) {
    background: var(--color-primary);
    color: var(--color-card);
    font-weight: 700;
  }
  
  &:has(input:focus-visible) {
    outline: 2px solid var(--color-seal);
    outline-offset: -4px;
  }
`;

export const urlCopyClass = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-code-bg);
  padding: 0.625rem 0.625rem 0.625rem 1rem;
  border-radius: 2px;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    padding: 0.75rem;
  }
`;

export const inputClass = css`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  color: var(--color-code-text);
  font-family: var(--font-code);
  font-size: 0.875rem;
  outline: none;
  
  @media (max-width: 640px) {
    margin-bottom: 0.25rem;
  }
`;

export const copyBtnClass = css`
  background: var(--color-card);
  color: var(--color-primary);
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 2px;
  cursor: pointer;
  font-family: var(--font-gothic);
  font-size: 0.875rem;
  font-weight: 700;
  transition: background 0.15s;
  
  &:hover {
    background: #e6e3d8;
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-card);
    outline-offset: 2px;
  }
`;

export const stepsClass = css`
  margin: 0 0 0 1.25rem;
  color: var(--color-text);
  font-size: 0.9375rem;
  
  li {
    margin-bottom: 0.25rem;
  }
  
  li::marker {
    font-family: var(--font-mincho);
    font-weight: 700;
    color: var(--color-primary);
  }
`;

export const swipeContainerClass = css`
  position: relative;
  touch-action: pan-y;
`;

export const slidingWrapperClass = css`
  position: relative;
  margin-top: 0.5rem;
`;

export const slidingOverflowClass = css`
  overflow: hidden;
`;

export const slidingContainerClass = css`
  display: flex;
  width: 200%;
  gap: 2rem;
  transition: transform 0.3s ease-out;
`;

export const panelClass = css`
  width: 50%;
  flex-shrink: 0;
`;

export const swipeArrowClass = css`
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-primary);
  background: var(--color-card);
  border-radius: 50%;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  transition:
    background 0.15s,
    color 0.15s,
    opacity 0.2s;
  z-index: 10;
  
  &:hover {
    background: var(--color-primary);
    color: var(--color-card);
  }
`;

export const swipeArrowHiddenClass = css`
  opacity: 0;
  pointer-events: none;
`;

export const feedBtnClass = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s;
`;

export const rssBtnClass = css`
  background: var(--color-seal);
  
  &:hover {
    background: var(--color-seal-dark);
  }
`;

export const appleBtnClass = css`
  background: var(--color-text);
  
  &:hover {
    background: #000000;
  }
`;

export const googleBtnClass = css`
  background: var(--color-primary);
  
  &:hover {
    background: var(--color-primary-dark);
  }
`;

export const methodsClass = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const methodClass = css`
  display: flex;
  flex-direction: column;
`;

export const methodContentClass = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const methodTitleClass = css`
  font-family: var(--font-mincho);
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.04em;
  color: var(--color-primary);
  padding-bottom: 0.375rem;
  margin-bottom: 0.875rem;
  border-bottom: 1px dotted var(--color-rule);
`;
