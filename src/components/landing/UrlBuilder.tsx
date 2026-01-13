import type { FC } from "hono/jsx";
import { containerClass, cardClass } from "../Layout";
import scriptSrc from "/src/client/UrlBuilder.client.tsx?url";

type Props = {
  environment: string;
};

export const UrlBuilder: FC<Props> = ({ environment: _environment }) => {
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
