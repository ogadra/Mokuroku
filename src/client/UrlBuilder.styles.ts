import { css } from "hono/css";

export const tabsClass = css`
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
`;

export const tabClass = css`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: var(--color-text-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition:
    color 0.2s,
    border-color 0.2s;
  
  &:hover {
    color: var(--color-text);
  }
`;

export const tabActiveClass = css`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: -1px;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  box-shadow: 0 4px 6px -4px rgba(59, 130, 246, 0.5);
`;

export const fieldsetClass = css`
  border: none;
  margin-bottom: 1rem;
`;

export const legendClass = css`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

export const radioGroupClass = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  @media (min-width: 400px) {
    gap: 1rem;
  }
`;

export const labelClass = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text-muted);
  background: var(--color-bg);
  transition: all 0.2s;
  white-space: nowrap;
  font-size: 0.875rem;
  
  @media (min-width: 400px) {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
  
  input {
    display: none;
  }
  
  &:has(input:checked) {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }
`;

export const urlCopyClass = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-code-bg);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const inputClass = css`
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-code-text);
  font-family: monospace;
  font-size: 0.875rem;
  outline: none;
  
  @media (max-width: 640px) {
    margin-bottom: 0.5rem;
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

export const descriptionClass = css`
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

export const stepsClass = css`
  margin: 1rem 0 0 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  
  li {
    margin-bottom: 0.25rem;
  }
`;

export const swipeContainerClass = css`
  position: relative;
  touch-action: pan-y;
`;

export const slidingWrapperClass = css`
  position: relative;
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
  border: none;
  background: var(--color-bg);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: all 0.2s;
  z-index: 10;
  
  &:hover {
    color: var(--color-primary);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  }
`;

export const swipeArrowHiddenClass = css`
  opacity: 0;
  pointer-events: none;
`;

export const feedBtnClass = css`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
`;

export const rssBtnClass = css`
  background: #f97316;
  
  &:hover {
    background: #ea580c;
  }
`;

export const appleBtnClass = css`
  background: #374151;
  
  &:hover {
    background: #1f2937;
  }
`;

export const googleBtnClass = css`
  background: #4285f4;
  
  &:hover {
    background: #3367d6;
  }
`;

export const methodsClass = css`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const methodClass = css`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const methodContentClass = css`
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.5rem;
`;

export const methodTitleClass = css`
  font-weight: 600;
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  text-align: center;
  border-left: 3px solid var(--color-primary);
`;
