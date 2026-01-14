/** @jsxImportSource hono/jsx/dom */
import type { FC, PropsWithChildren } from "hono/jsx";
import { methodClass, methodTitleClass, methodContentClass } from "../UrlBuilder.styles";

interface MethodSectionProps {
  title: string;
}

export const MethodSection: FC<PropsWithChildren<MethodSectionProps>> = ({ title, children }) => (
  <div class={methodClass}>
    <span class={methodTitleClass}>{title}</span>
    <div class={methodContentClass}>{children}</div>
  </div>
);
