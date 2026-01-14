import type { FC } from "hono/jsx";
import { containerClass, cardClass } from "../Layout";

const scriptSrc = import.meta.env.DEV
  ? "/src/client/UrlBuilder.client.tsx"
  : "/assets/url-builder.js";

export const UrlBuilder: FC = () => {
  return (
    <section id="subscribe" class={containerClass}>
      <h2>購読する</h2>
      <div class={cardClass}>
        <div id="url-builder-root">
          <noscript>JavaScriptを有効にしてください</noscript>
        </div>
      </div>
      <script type="module" src={scriptSrc}></script>
    </section>
  );
};
